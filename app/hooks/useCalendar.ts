import { useState, useEffect, useRef } from 'react';
import { Event } from "@/types/event";
import { MonthEvents, Day } from '@/types/month';
import useGetEvent from "@/app/hooks/useGetEvent";

const useCalendar = (props: MonthEvents) => {
  const { today, startDayOfMonth, monthName, isHours } = props;
  const [isMount, seMount] = useState<boolean>(false);
  const [days, setDays] = useState<Day[]>(props.days);
  const [event, setEvent] = useState<Event | null>(null);
  const [day, setDay] = useState<Day | null>(null);
  const [isUpdateEvent, setUpdateEvent] = useState<boolean>(false);
  const [isCreateEvent, setCreateEvent] = useState<boolean>(false);
  const { updateEvent } = useGetEvent();
  const dragEventRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      seMount(true)
    }

    return () => {
      isMounted = false;
    }
  }, []);

  const onDrop = async (eventUpdated: Event, targetDay: Day) => {
    const startDate: Date = new Date(eventUpdated.start_date);
    startDate.setDate(targetDay.day);

    const finishDate: Date = new Date(eventUpdated.finish_date);
    finishDate.setDate(targetDay.day);

    eventUpdated.start_date = startDate;
    eventUpdated.finish_date = finishDate;

    const payload = {
      title: eventUpdated.title,
      description: eventUpdated.description,
      is_all_day: eventUpdated.is_all_day,
      start_date: startDate.toISOString(),
      finish_date: finishDate.toISOString(),
      city: eventUpdated.city,
      weather: eventUpdated.weather,
      weather_url: eventUpdated.weather_url,
    };

    setDays((prevDays) =>
        prevDays
            .map((d) => ({
              ...d,
              events: d.events.filter((e) => e.id !== eventUpdated.id),
            }))
            .map((d) => {
              if (d.day === targetDay.day) {
                return {
                  ...d,
                  events: [...d.events, eventUpdated],
                };
              }
              return d;
            })
    );

    try {
      const response = await updateEvent(eventUpdated.id, payload);
      if (response) {
        eventUpdated.weather_url = response.weather_url;
        eventUpdated.weather = response.weather;
      }

      setDays((prevDays) =>
          prevDays
              .map((d) => ({
                ...d,
                events: d.events.filter((e) => e.id !== eventUpdated.id),
              }))
              .map((d) => {
                if (d.day === targetDay.day) {
                  return {
                    ...d,
                    events: [...d.events, eventUpdated],
                  };
                }
                return d;
              })
      );
    } catch {

    }

    dragEventRef.current = false;
  };

  const onDay = (d: Day): void => {
    setDay(d);
    setCreateEvent(true);
  };

  const onHour = (hour: number): void => {
    console.log(days[0])
    const d = days[0];
    d.dayDate = new Date(d.dayDate);
    d.dayDate.setUTCHours(hour, 0, 0);

    setDay(d);
    setCreateEvent(true);
  };

  const onDrag = (eventDeleted: Event): void => {
    if (!dragEventRef.current) {
      dragEventRef.current = true;
      setDays((prevDays) =>
        prevDays.map((d) => ({
          ...d,
          events: d.events.filter((e) => e.id !== eventDeleted.id),
        }))
      );
    }
  };

  const onEvent = (e: Event): void => {
    setUpdateEvent(true);
    setEvent(e);
  };

  const onDeleteEvent = (eventDeleted: Event): void => {
    setDays((prevDays) =>
      prevDays.map((d) => ({
        ...d,
        events: d.events.filter((e) => e.id !== eventDeleted.id),
      }))
    );

    onClose();
  };

  const onUpdateEvent = (eventUpdated: Event): void => {
    setDays((prevDays) =>
      prevDays
        .map((d) => ({
          ...d,
          events: d.events.filter((e) => e.id !== eventUpdated.id),
        }))
        .map((d) => {
          if (d.day === new Date(eventUpdated.start_date).getDate()) {
            return {
              ...d,
              events: [...d.events, eventUpdated],
            };
          }
          return d;
        })
    );

    onClose();
  };

  const onClose = (): void => {
    setUpdateEvent(false);
    setCreateEvent(false);
    setEvent(null);
    setDay(null);
  };

  const onCreateEvent = (e: Event) => {
    console.log(e);

    setDays((prevDays) =>
      prevDays.map((d) => {
        if (d === day) {
          return {
            ...d,
            events: [...d.events, e],
          };
        }

        return d;
      })
    );

    onClose();
  };

  return {
    month: {
      isHours,
      monthName,
      today,
      startDayOfMonth,
      isMount,
      days,
      day: days[0],
      onDrop,
      onDay,
      onDrag,
      onEvent,
      onHour,
    },
    eventForUpdate: {
      event,
      isVisible: isUpdateEvent,
      onDeleteEvent,
      onUpdateEvent,
      onClose,
    },
    dayForCreateEvent: {
      day,
      isVisible: isCreateEvent,
      onClose,
      onCreateEvent,
    },
  }
};

export default useCalendar;