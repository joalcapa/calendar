'use client'

import { useState, useMemo } from 'react';
import { Event } from '@/types/event';
import useCreateEventHook from '@/app/hooks/useCreateEvent';

interface TargetEvent {
  target: {
    value: string,
  },
}

interface TargetCheckEvent {
  target: {
    checked: boolean,
  },
}

interface CreateEventProps {
  onClose: () => void;
  event?: Event,
  isDelete?: boolean;
  dayCreateEvent?: Date;
}

const formatDateForInput = (d: Date) => {
  const date = new Date(d);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hours = String(date.getUTCHours()).padStart(2, '0');
  const minutes = String(date.getUTCMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const useCreateEvent = (props: CreateEventProps) => {
  const { onClose = () => { }, event, isDelete, dayCreateEvent } = props;
  console.log(props)
  const [title, setTitle] = useState(event && event.title ? event.title : '');
  const [description, setDescription] = useState(event && event.description ? event.description : '');
  const [startDate, setStartDate] = useState<string>(event && event.start_date ? formatDateForInput(event.start_date) : dayCreateEvent ? formatDateForInput(dayCreateEvent) : '');
  const [isAllDay, setAllDay] = useState(event && event.is_all_day ? event.is_all_day : false);
  const [finishDate, setFinishDate] = useState(event && event.finish_date ? formatDateForInput(event.finish_date) : '');
  const { isLoading, error, createEvent } = useCreateEventHook();

  const onCreate = async () => {
    try {
      const payload: Event = {
        title,
        description,
        is_all_day: isAllDay,
        start_date: new Date(startDate + "Z").toISOString(),
      };

      if (!isAllDay && !!finishDate) {
        payload.finish_date = new Date(finishDate + "Z").toISOString();
      }

      await createEvent(payload);
      onClose();
    } catch {
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStartDate('');
    setAllDay(false);
    setFinishDate('');
  };

  const changeTitle = (event: TargetEvent) => {
    setTitle(event.target.value);
  };

  const changeDescription = (event: TargetEvent) => {
    setDescription(event.target.value);
  };

  const changeStartDate = (event: TargetEvent) => {
    if (isAllDay) {
      const originalDateString = event.target.value;
      const originalDate = new Date(originalDateString);
      originalDate.setUTCHours(7, 0);
      setStartDate(originalDate.toISOString().slice(0, 16));
    } else {
      setStartDate(event.target.value);
    }
  };

  const changeFinishDate = (event: TargetEvent) => {
    setFinishDate(event.target.value);
  };

  const changeAllDay = (event: TargetCheckEvent) => {
    setAllDay(event.target.checked);

    if (event.target.checked) {
      const originalDateString = startDate;
      const originalDate = new Date(originalDateString);
      originalDate.setUTCHours(7, 0);
      setStartDate(originalDate.toISOString().slice(0, 16));
    }
  };

  const isValidForm = useMemo(() => {
    return !!title && !!description && !!startDate && (isAllDay ? true : !!finishDate);
  }, [title, description, startDate, isAllDay, finishDate, event]);

  return {
    isDelete,
    isLoading,
    error,
    title,
    description,
    startDate,
    isAllDay,
    finishDate,
    onClose,
    changeTitle,
    changeDescription,
    changeStartDate,
    changeAllDay,
    changeFinishDate,
    onCreate,
    isValidForm,
  };
};

export default useCreateEvent;