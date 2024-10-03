import { useState } from 'react';
import { Event } from '@/types/event';
import { getEvent, deleteEvent, updateEvent } from '@/app/services/event';
import useApi from '@/app/hooks/useApi';
import { AxiosResponse } from 'axios';

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

  const deleteEventHandler = async (id: number) => {
    try {
      await fetch(deleteEvent(id));
    } catch { }
  };

  const updateEventHandler = async (
      id: number,
      payload: {
        title: string;
        description: string;
        is_all_day: boolean;
        start_date: string;
        finish_date: string;
      }
  ): Promise<Event | null> => {
    try {
      const response: AxiosResponse<Event> | undefined = await fetch(updateEvent(id, payload));
      if (response && response.data) {
        return response.data;
      }

      return null;
    } catch (error) {
      console.error('Hubo un error:', error);
      return null;
    }
  };

  return {
    event,
    isLoading,
    error,
    getEvent: getEventHandler,
    deleteEvent: deleteEventHandler,
    updateEvent: updateEventHandler,
  }
};

export default useGetEvent;