import { useState } from 'react';
import { Event } from '../../types/event';
import { getEvent } from '../../app/services/event';
import useApi from '../../app/hooks/useApi';

const useGetEvent = () => {
  const { fetch, isLoading, error } = useApi();
  const [event, setEvent] = useState<Event | null>(null)

  const getEventHandler = async (id: number) => {
    try {
      const response = await fetch(getEvent(id));
      const data: Event = response?.data;
      if (data) { setEvent(data); }
    } catch { }
  };

  return {
    event,
    isLoading,
    error,
    getEvent: getEventHandler,
  }
};

export default useGetEvent;