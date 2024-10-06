'use client'

import { useEffect } from "react";
import { Event } from "../../../../../types/event";
import { formatDateForInput } from '../../../../../app/utils/utils';
import useCreateEvent from "../create/useCreateEvent";
import useEvents from "../../../../hooks/useEvents";

interface UpdateEventProps {
  event: Event,
  isVisible: boolean,
  onClose: () => void,
  path: string;
  RQTypes: string;
  dayNumber: number;
}

const useUpdateEvent = (props: UpdateEventProps) => {
  const { event, onClose, path, RQTypes, dayNumber} = props;
  const { deleteEvent, updateEvent } = useEvents({ path, RQTypes, dayNumber });
  const hook = useCreateEvent({ onClose, isDelete: true });

  const {
    isValidForm,
    title,
    description,
    startDate,
    isAllDay,
    finishDate,
    city,
    weather,
    weatherUrl,
    changeTitle,
    changeDescription,
    changeStartDate,
    setAllDay,
    changeFinishDate,
    changeCity,
    changeWeather,
    changeWeatherUrl,
  } = hook;

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setAllDay(event.is_all_day)
      changeTitle({ target: { value: event.title }});
      changeDescription({ target: { value: event.description }});
      changeStartDate({ target: { value: formatDateForInput(event.start_date) }});
      changeFinishDate({ target: { value: formatDateForInput(event.finish_date) }});
      changeCity({ target: { value: event.city }})

      if (event.weather) {
        changeWeather(event.weather);
      }

      if (event.weather_url) {
        changeWeatherUrl(event.weather_url);
      }

      isMounted = false;
    }

    return () => {
      isMounted = false;
    }
  }, []);

  const onUpdate = async () => {
    try {
      if (isValidForm) {
        await updateEvent({
          id: event.id,
          data: {
            title,
            description,
            city,
            weather,
            weather_url: weatherUrl,
            is_all_day: isAllDay,
            start_date: new Date(startDate + "Z").toISOString(),
            finish_date: new Date(finishDate + "Z").toISOString(),
          },
        })

        onClose();
      }
    } catch { }
  };

  const onDelete = async () => {
    try {
      await deleteEvent(event.id);
      onClose();
    } catch { }
  };

  return {
    ...hook,
    isLoading: false,
    error: '',
    onSend: onUpdate,
    onDelete,
    onClose,
  };
};

export default useUpdateEvent;