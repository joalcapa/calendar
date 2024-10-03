'use client'

import { useEffect } from "react";
import { Event } from "@/types/event";
import { Day } from '@/types/month';
import { formatDateForInput } from '@/app/utils/utils';
import useCreateEvent from "../create/useCreateEvent";
import useGetEvent from "@/app/hooks/useGetEvent";

interface UpdateEventProps {
  event: Event,
  isVisible: boolean,
  onDeleteEvent: () => void,
  onUpdateEvent: (event: Event) => void
  onClose: () => void,
}

const useUpdateEvent = (props: UpdateEventProps) => {
  const {
    event,
    onDeleteEvent,
    onUpdateEvent,
    onClose,
  } = props;

  const { deleteEvent, updateEvent, isLoading, error } = useGetEvent();
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

      isMounted = false;
    }

    return () => {
      isMounted = false;
    }
  }, []);

  const onUpdate = async () => {
    try {
      if (isValidForm) {
        const payload = {
          title,
          description,
          city,
          weather,
          weather_url: weatherUrl,
          is_all_day: isAllDay,
          start_date: new Date(startDate + "Z").toISOString(),
          finish_date: new Date(finishDate + "Z").toISOString(),
        };

        const eventUpdated: Event | null = await updateEvent(event.id, payload);
        if (eventUpdated) {
          onUpdateEvent(eventUpdated);
        }
      }
    } catch { }
  };

  const onDelete = async () => {
    try {
      await deleteEvent(event.id);
      onDeleteEvent(event);
    } catch { }
  };

  return {
    ...hook,
    isLoading,
    error,
    onCreate: onUpdate,
    onDelete,
    onClose,
  };
};

export default useUpdateEvent;