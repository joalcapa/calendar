'use client'

import React from 'react';
import { CreateEvent } from '@/app/components/calendar/events/create/createEvent';
import useUpdateEvent from './useUpdateEvent';
import useGetEvent from '@/app/hooks/useGetEvent';

export default (props) => {
  const hook = useUpdateEvent(props);

  return (
    <CreateEvent
      {...hook}
      isDelete
      onDelete={hook.onDelete}
      operationLabel={"Actualizar evento"}
      buttonLabel={"¡Actualizar ahora!"}
    />
  );
};
