'use client'

import { useEffect, useState, useCallback } from 'react';
import { MonthEvents } from '@/types/month';
import { Event } from '@/types/event';
import { Day } from '@/types/month';
import useGetEvent from '@/app/hooks/useGetEvent';

const useMonth = (props: MonthEvents) => {
  const { today, startDayOfMonth } = props;
  const [isMount, setMount] = useState(false);
  const [isCreateEvent, setCreateEvent] = useState(false);
  const [dayCreateEvent, setDayCreateEvent] = useState<Date | null>(null);
  const [isUpdateEvent, setUpdateEvent] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [days, setDays] = useState<Day[]>(props.days);
  const { updateEvent } = useGetEvent();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setDays(props.days);
    }

    return () => { isMounted = false; }
  }, [props.days]);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setMount(true);
    }

    return () => { isMounted = false; }
  }, []);

  const onEvent = (e: Event) => {
    setUpdateEvent(true);
    setEvent(e);
  };

  const onDay = (day: Date) => {
    setCreateEvent(true);
    setDayCreateEvent(day);
  };

  const onCloseCreateEvent = () => {
    setCreateEvent(false);
  };

  const onCloseUpdateEvent = () => {
    setUpdateEvent(false);
  };

  const onDeleteEvent = useCallback((e: Event) => {
    setEvent(null);
    setDays(days.map((day) => ({
      ...day,
      events: day.events.filter((item: Event) => item.id != e.id)
    })));
  }, [days]);

  const onDrop = async (event: Event, targetDay: Day) => {
    const startDate: Date = new Date(event.start_date);
    startDate.setDate(targetDay.day);

    const finishDate: Date = new Date(event.finish_date);
    finishDate.setDate(targetDay.day);

    event.start_date = startDate;
    event.finish_date = finishDate;

    setDays((prevDays) => {
      const updatedDays = prevDays.map((day) => ({
        ...day,
        events: day.events.filter((e) => e.id !== event.id),
      }));

      return updatedDays.map((day) => {
        if (day.day === targetDay.day) {
          return {
            ...day,
            events: [...day.events, event],
          };
        }
        return day;
      });
    });

    try {
      const payload: Event = {
        ...event,
        start_date: startDate.toISOString(),
        finish_date: finishDate.toISOString(),
      };

      await updateEvent(event.id, payload);
    } catch {
      alert("error")
    }
  }

  const onDrag = (event: Event, day: Day) => {
    setDays((prevDays) => {
      const updatedDays = prevDays.map((day) => ({
        ...day,
        events: day.events.filter((e) => e.id !== event.id),
      }));

      return updatedDays;
    });
  }

  const onUpdateEvent = (e: Event) => {
    setDays(days.map((day) => ({
      ...day,
      events: day.events.map((item: Event) => {
        if (item.id == e.id) {
          return e;
        }

        return item;
      }),
    })));
  }

  return {
    days,
    today,
    isMount,
    isCreateEvent,
    isUpdateEvent,
    event,
    dayCreateEvent,
    startDayOfMonth,
    onEvent,
    onDay,
    onCloseCreateEvent,
    onCloseUpdateEvent,
    onDeleteEvent,
    onDrop,
    onDrag,
    onUpdateEvent,
  }
};

export default useMonth;