'use client'

import { Event } from "@/types/event";
import useCreateEvent from "../create/useCreateEvent";
import useGetEvent from "@/app/hooks/useGetEvent";

interface UpdateEventProps {
  onClose: () => void;
  event: Event;
}

const useUpdateEvent = (props: UpdateEventProps) => {
  const { event } = props;
  const hook = useCreateEvent(props);
  const { isValidForm, title, description, startDate, isAllDay, finishDate } = hook;
  const { updateEvent, isLoading, error } = useGetEvent();

  const onUpdate = async () => {
    if (isValidForm && event) {
      try {
        await updateEvent(
          event.id, {
          title,
          description,
          start_date: startDate,
          is_all_day: isAllDay,
          finish_date: finishDate,
        }
        );
      } catch { }
    }
  };

  const onDelete = () => {

  };

  return {
    ...hook,
    isLoading,
    error,
    onCreate: onUpdate,
    onDelete,
  };
};

export default useUpdateEvent;