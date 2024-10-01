'use client'

import { Event } from "@/types/event";
import useCreateEvent from "../create/useCreateEvent";
import useGetEvent from "@/app/hooks/useGetEvent";

interface UpdateEventProps {
  onClose: () => void;
  onDeleteEvent: (e: Event) => void;
  event: Event;
}

const useUpdateEvent = (props: UpdateEventProps) => {
  const { event, onClose, onDeleteEvent } = props;
  const hook = useCreateEvent(props);
  const { isValidForm, title, description, startDate, isAllDay, finishDate } = hook;
  const { deleteEvent, updateEvent, isLoading, error } = useGetEvent();


  const onUpdate = async () => {
    try {
      if (isValidForm && event && event.id) {
        const payload: Event = {
          title,
          description,
          is_all_day: isAllDay,
          start_date: new Date(startDate + "Z").toISOString(),
        };

        if (!isAllDay && !!finishDate) {
          payload.finish_date = new Date(finishDate + "Z").toISOString();
        }

        await updateEvent(event.id, payload);
        onClose();
      }
    } catch {
    }
  };

  const onDelete = async () => {
    try {
      if (event && event.id) {
        await deleteEvent(event.id);
        onDeleteEvent(event);
        onClose();
      }
    } catch { }
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