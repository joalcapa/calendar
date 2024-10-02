import { Event } from '@/types/event';
import { createEvent } from '@/app/services/event';
import useApi from '@/app/hooks/useApi';

const useCreateEvent = () => {
  const { fetch, isLoading, error } = useApi();

  const createEventHandler = async (payload: Event) => {
    try {
      console.log("Payload", payload)
      const response = await fetch(createEvent(payload));
      const data: Event = response?.data;
      return data;
    } catch { }
  };

  return {
    isLoading,
    error,
    createEvent: createEventHandler,
  }
};

export default useCreateEvent;