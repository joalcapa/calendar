import { useState } from 'react';
import { Event } from '@/types/event';
import { getEvent, deleteEvent, updateEvent } from '@/app/services/event';
import useApi from '@/app/hooks/useApi';

export default () => {
  const { fetch } = useApi();
  const [event, setEvent] = useState<Event | null>(null)

  const getEventHandler = async (id: number) => {
    try {
      const response = await fetch(getEvent(id));
      const data: Event = response?.data;
      if (data) { setEvent(data); }
    } catch { }
  };

  const deleteEventHandler = async (id: number) => {
    try {
      await fetch(deleteEvent(id));
    } catch { }
  };

  const updateEventHandler = async (id: number, payload: Event) => {
    try {
      const response = await fetch(updateEvent(id, payload));
      const data: Event = response?.data;
      if (data) { setEvent(data); }
    } catch { }
  };

  return {
    event,
    getEvent: getEventHandler,
    deleteEvent: deleteEventHandler,
    updateEvent: updateEventHandler,
  }
};