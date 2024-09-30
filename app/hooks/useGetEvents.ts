import { useState } from 'react';
import { Event } from '@/types/event';
import { getEvents } from '@/app/services/event';
import useApi from '@/app/hooks/useApi';

const useGetEvents = () => {
  const { fetch } = useApi();
  const [events, setEvents] = useState<Event[]>([])

  const getEventsHandler = async () => {
    try {
      const response = await fetch(getEvents());
      const data: Event[] = response?.data;
      if (data) { setEvents(data); }
    } catch { }
  };

  return {
    events,
    getEvents: getEventsHandler,
  }
};

export default useGetEvents;