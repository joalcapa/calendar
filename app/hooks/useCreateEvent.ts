import { Event } from '../../types/event';
import { createEvent } from '../../app/services/event';
import useApi from '../../app/hooks/useApi';
import { AxiosResponse } from 'axios';

const useCreateEvent = () => {
  const { fetch, isLoading, error } = useApi();

  const createEventHandler = async (payload: {
    title: string;
    city: string;
    weather: string;
    weather_url: string;
    description: string;
    is_all_day: boolean;
    start_date: string;
    finish_date: string;
  }) => {
    try {
      const response: AxiosResponse<Event> | undefined = await fetch(createEvent(payload));
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
    isLoading,
    error,
    createEvent: createEventHandler,
  }
};

export default useCreateEvent;