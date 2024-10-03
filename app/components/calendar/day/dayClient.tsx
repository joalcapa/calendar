'use client';

import React, { useState } from 'react';
import { Event } from '@/types/event';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Day } from '@/types/month';
import useMonth from '../month/useMonth';
import CreateEvent from '@/app/components/calendar/events/create/createEvent';
import UpdateEvent from '../events/update/updateEvent';
import { DateTime } from "luxon";
import DayServer from './dayServer';

interface CalendarColumnProps {
  events: Event[];
  days: Day[];
  onHourClick: (hour: string) => void;
  onEventClick: (event: Event) => void;
  isHours: boolean;
}

const CalendarColumn: React.FC<CalendarColumnProps> = ({ day, onHourClick, onEventClick, onDay, onEvent, isHours }) => {
  const events = day.events || [];

  const hours = Array.from({ length: 13 }, (_, i) => i + 7); // Genera las horas de 7 a 19
  const [hoveredEventId, setHoveredEventId] = useState<number | null>(null); // Estado para el evento que está sobrevolando

  const renderEvents = () => {
    const renderedEvents: React.ReactNode[] = [];
    const positions = {};

    events.forEach((event) => {
      const start = DateTime.fromJSDate(event.start_date).setZone('UTC');
      const end = DateTime.fromJSDate(event.finish_date).setZone('UTC');

      // Extraer horas y minutos
      const eventStartHour = start.hour;
      const eventStartMinute = start.minute;

      const eventEndHour = end.hour;
      const eventEndMinute = end.minute;

      const eventStart = (eventStartHour - 7) * 64 + eventStartMinute; // Minutos desde las 7:00 AM
      const eventEnd = (eventEndHour - 7) * 64 + eventEndMinute; // Minutos desde las 7:00 AM
      const height = eventEnd - eventStart; // Altura en minutos

      let leftPosition = '80px'; // Posición inicial
      let overlapCount = 0; // Contador de superposiciones

      // Verifica si hay eventos anteriores
      for (const key in positions) {
        const prevEvent = positions[key];

        // Comprueba si hay superposición
        if (
          (eventStart < prevEvent.eventEnd) &&
          (eventEnd > prevEvent.eventStart)
        ) {
          overlapCount++; // Incrementa el contador de superposiciones
        }
      }

      // Ajusta la posición hacia la derecha o hacia la izquierda
      if (overlapCount > 0) {
        leftPosition = `${parseInt(leftPosition) + overlapCount * 50}px`; // Mueve a la derecha
      } else {
        leftPosition = `${parseInt(leftPosition) - (overlapCount * 10)}px`; // Mueve a la izquierda si no hay superposición
      }

      // Guarda la posición del evento actual
      positions[event.id] = {
        eventStart,
        eventEnd,
        left: leftPosition,
      };

      const isHovered = hoveredEventId === event.id; // Verifica si el evento está siendo sobrevolado

      const hh = eventStartHour > 12 ? eventStartHour - 12 : eventStartHour;
      const mm = eventEndHour > 12 ? eventEndHour - 12 : eventEndHour;

      renderedEvents.push(
        <div
          key={event.id}
          className="absolute bg-blue-500 text-white cursor-pointer border-2 border-r border-white-200"
          style={{
            top: `${eventStart}px`,
            height: `${height}px`,
            width: '100%',
            left: isHours ? leftPosition : 0,
            right: isHours ? '80px' : 0,
            borderRadius: 10,
            zIndex: isHovered ? 5 : 3,
            paddingTop: height < 40 ? 5 : 0,
            paddingLeft: 5,
            display: 'flex',
            flexDirection: height < 40 ? 'row' : 'column'
          }}
          onMouseEnter={() => setHoveredEventId(event.id)}
          onMouseLeave={() => setHoveredEventId(null)}
          onClick={() => onEvent(event)}
        >
          <span className="text-xs" style={{ marginTop: height < 20 ? -9 : 0 }}>{event.title}</span>
          <span className="text-xs" style={{ marginTop: height < 20 ? -9 : 0, paddingLeft: height < 40 ? 10 : 0 }}>{hh < 10 ? '0' + hh : hh}:{eventStartMinute < 10 ? '0' + eventStartMinute : eventStartMinute} {eventStartHour >= 12 ? 'PM' : 'AM'} - {mm < 10 ? '0' + mm : mm}:{eventEndMinute < 10 ? '0' + eventEndMinute : eventEndMinute} {eventEndHour >= 12 ? 'PM' : 'AM'}</span>
        </div>
      );
    });

    return renderedEvents;
  };

  return (
    <div className="relative border-l border-r border-gray-200">
      {hours.map((hour) => (
        <div
          key={hour}
          className="border-t border-b border-gray-200 relative h-16 flex items-center cursor-pointer hover:bg-gray-300"
          onClick={() => onDay(null, hour)}
        >
          {
            isHours && (<span className="absolute left-2 top-0 text-xs">
              {`${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`}
            </span>)
          }
        </div>
      ))}
      {renderEvents()}
    </div>
  );
};

const Calendar: React.FC<MonthEvents> = (props) => {
  const hook = useMonth(props);

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        {hook.isMount ? <CalendarColumn {...props} {...hook} /> : <DayServer day={props.day} isHours={props.isHours} />}
        {hook.isUpdateEvent && (
          <UpdateEvent onClose={hook.onCloseUpdateEvent} event={hook.event} onDeleteEvent={hook.onDeleteEvent} onUpdateEvent={hook.onUpdateEvent} />
        )}
        {hook.isCreateEvent && (
          <CreateEvent onClose={hook.onCloseCreateEvent} dayCreateEvent={hook.dayCreateEvent} />
        )}
      </>
    </DndProvider>
  );
};

export default Calendar;