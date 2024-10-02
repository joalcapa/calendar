'use client'

import { useEffect, useState } from 'react';
import useCalendarNavigation from '@/app/hooks/useCalendarNavigation';

const useNavigation = (props: { type: string }) => {
  const [isMount, setMount] = useState(false);
  const hook = useCalendarNavigation(props);

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setMount(true);
    }

    return () => { isMounted = false; }
  }, []);

  return {
    ...hook,
    isMount,
  }
};

export default useNavigation;