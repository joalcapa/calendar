'use client'

import { useState, useMemo } from 'react';
import { Event } from '@/types/event';
import useGetEvent from '@/app/hooks/useGetEvent';

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
}

const formatDateForInput = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const useCreateEvent = (props: CreateEventProps) => {
  const { onClose = () => { }, event, isDelete } = props;
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(event && event.title ? event.title : '');
  const [description, setDescription] = useState(event && event.description ? event.description : '');
  const [startDate, setStartDate] = useState(event && event.start_date ? formatDateForInput(event.start_date.toString()) : '');
  const [isAllDay, setAllDay] = useState(event && event.is_all_day ? event.is_all_day : false);
  const [finishDate, setFinishDate] = useState(event && event.finish_date ? formatDateForInput(event.finish_date.toString()) : '');
  const { isLoading, error } = useGetEvent();

  const onCreate = async () => {

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
    setStartDate(event.target.value);
  };

  const changeFinishDate = (event: TargetEvent) => {
    setFinishDate(event.target.value);
  };

  const changeAllDay = (event: TargetCheckEvent) => {
    setAllDay(event.target.checked);
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