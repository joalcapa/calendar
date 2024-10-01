'use client'

import { useEffect, useState } from 'react';
import { MonthEvents } from '@/types/month';
import { Event } from '@prisma/client';

const useMonth = (props: MonthEvents) => {
  const { today } = props;
  const [isMount, setMount] = useState(false);
  const [days, setDays] = useState(props.days);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setMount(true);
    }

    return () => { isMounted = false; }
  }, []);

  const onEvent = (event: Event) => {
    alert(JSON.stringify(event))
  };

  const onDay = (day: number) => {
    alert("dia: " + day.toString())
  };

  return {
    days,
    today,
    isMount,
    onEvent,
    onDay,
  }
};

export default useMonth;