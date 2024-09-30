'use client'

import { useEffect, useState } from 'react';
import useCalendarNavigation from '@/app/hooks/useCalendarNavigation';

export default () => {
  const [ isMount, setMount ] = useState(false);
  const hook = useCalendarNavigation();

  useEffect(() => {
    setMount(true);
  }, []);

  return {
    ...hook,
    isMount,
  }
};