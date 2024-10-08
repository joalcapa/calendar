'use client'

import { useEffect, useState } from 'react';
import useCalendarNavigation from '../../../../app/hooks/useCalendarNavigation';
import useGoogle from "../../../../app/hooks/useGoogle";

const useNavigation = (props: { type: string }) => {
  const [ isMount, setMount ] = useState(false);
  const hook = useCalendarNavigation(props);
  const { signIn, signOut, isSession } = useGoogle();

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
    signOut,
    signIn,
    isSession,
  }
};

export default useNavigation;