'use client'

import { useEffect, useState } from 'react';
import { MonthEvents } from '@/types/month';
import { Event } from '@prisma/client';

const useMonth = (props: MonthEvents) => {
  const { today } = props;
  const [isMount, setMount] = useState(false);
  const [isCreateEvent, setCreateEvent] = useState(false);
  const [isUpdateEvent, setUpdateEvent] = useState(false);
  const [event, setEvent] = useState<Event | null>(null);
  const [days, setDays] = useState(props.days);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setMount(true);
    }

    return () => { isMounted = false; }
  }, []);

  const onEvent = (e: Event) => {
    setUpdateEvent(true);
    setEvent(e)
  };

  const onDay = (day: number) => {
    setCreateEvent(true);
  };

  const onCloseCreateEvent = () => {
    setCreateEvent(false);
  };

  const onCloseUpdateEvent = () => {
    setUpdateEvent(false);
  };

  return {
    days,
    today,
    isMount,
    isCreateEvent,
    isUpdateEvent,
    event,
    onEvent,
    onDay,
    onCloseCreateEvent,
    onCloseUpdateEvent,
  }
};

export default useMonth;