'use client'

import { useEffect, useState, useCallback } from 'react';
import { MonthEvents } from '@/types/month';
import { Event } from '@/types/event';
import { Day } from '@/types/month';

const useMonth = (props: MonthEvents) => {
  const { today } = props;
  const [isMount, setMount] = useState(false);
  const [isCreateEvent, setCreateEvent] = useState(false);
  const [dayCreateEvent, setDayCreateEvent] = useState<Date | null>(null);
  const [isUpdateEvent, setUpdateEvent] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [days, setDays] = useState<Day[]>(props.days);

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

  return {
    days,
    today,
    isMount,
    isCreateEvent,
    isUpdateEvent,
    event,
    dayCreateEvent,
    onEvent,
    onDay,
    onCloseCreateEvent,
    onCloseUpdateEvent,
    onDeleteEvent,
  }
};

export default useMonth;