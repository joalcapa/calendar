'use client';

import React from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Event } from '@/types/event';
import { Day, MonthEvents } from '@/types/month';
import useMonth from './useMonth';
import MonthServer from './monthServer';
import CreateEvent from '@/app/components/calendar/events/create/createEvent';
import UpdateEvent from '../events/update/updateEvent';

interface MonthProps {
  days: Day[];
  today: number;
  weekDays?: string[];
  isMount: boolean;
  onEvent: (event: Event) => void;
  onDay: (day: number) => void;
  startDayOfMonth: number;
  onDrop: () => void;
  onDrag: () => void;
}

const ItemTypes = {
  EVENT: 'event',
};

const DraggableEvent: React.FC<{
  event: Event,
  onDrag: (event: Event, day: number) => void,
  day: Day,
  onEvent: (event: Event) => void,
}> = (
    {
      event,
      onDrag,
      day,
      onEvent,
    }
) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.EVENT,
    item: { event },
    collect: (monitor) => {
      if (monitor.isDragging()) {
        onDrag(event, day);
      }

      return ({
        isDragging: monitor.isDragging(),
      })
    },
  }));

  return (
    <div
      ref={drag}
      className={`text-xs text-left truncate bg-blue-100 p-1 mb-1 rounded cursor-pointer ${isDragging ? 'opacity-50' : ''}`}
      style={{ maxWidth: '100%', maxHeight: '20px', paddingBottom: 20 }}
      onClick={(e) => { e.stopPropagation(); onEvent(event); }}
    >
      {event.title}
    </div>
  );
};

const DroppableDay: React.FC<{ today: number, day: Day; onDrop: (event: Event, day: number) => void, onDay: (day: Date) => void }> = ({ day, onDrop, children, onDay, today }) => {
  const [, drop] = useDrop(() => ({
    accept: ItemTypes.EVENT,
    drop: (item: { event: Event }) => {
      onDrop(item.event, day);
    },
  }));

  return (
    <div
      ref={drop}
      className={`relative flex flex-col items-start justify-start border h-32 w-32 p-1 overflow-hidden cursor-pointer ${day.isCurrentMonth
        ? (day.isToday ? 'border-2 border-yellow-600 shadow-lg' : day.isCurrent ? 'border-2 border-blue-600 shadow-lg' : 'bg-white hover:bg-gray-100')
        : 'bg-gray-200 opacity-50'
        }`}
      onClick={(e) => {
        e.stopPropagation();
        onDay(day.dayDate);
      }
      }
    >
      {children}
    </div>
  );
};

const Month: React.FC<MonthProps> = ({
  days,
  today,
  weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  isMount = false,
  onEvent = (event: Event) => { },
  onDay = (day: Day) => { },
  startDayOfMonth,
  onDrop = () => { },
  onDrag = () => { },
}) => (
  <>
    {isMount ? (
      <div className="max-w-3xl mx-auto text-center">
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div className="font-bold flex items-center justify-center" key={day}>
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: startDayOfMonth }, (_, index) => (
            <div key={`empty-${index}`} className="flex items-center justify-center">
              <div className="relative flex flex-col items-start justify-start border border-gray-300 h-32 w-32 bg-gray-200"></div>
            </div>
          ))}
          {days.map((day, index) => (
            <div key={index} className="flex items-center justify-center">
              <DroppableDay today={today} day={day} onDrop={onDrop} onDay={onDay}>
                <span className="absolute top-1 left-1 text-xs font-bold">{day.day}</span>
                <div className="mt-5 w-full h-full overflow-hidden">
                  {day.events.map((event, eventIndex) => (
                    <DraggableEvent key={eventIndex} event={event} onDrag={onDrag} day={day} onEvent={onEvent} />
                  ))}
                </div>
              </DroppableDay>
            </div>
          ))}
          {Array.from({ length: startDayOfMonth + days.length % 7 === 0 ? 0 : 7 - (startDayOfMonth + days.length % 7) }, (_, index) => (
            <div key={`empty-end-${index}`} className="flex items-center justify-center">
              <div className="relative flex flex-col items-start justify-start border border-gray-300 h-32 w-32 bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <MonthServer days={days} today={today} startDayOfMonth={startDayOfMonth} />
    )}
  </>
);

const Calendar: React.FC<MonthEvents> = (props) => {
  const hook = useMonth(props);
  const {
    event,
    isUpdateEvent,
    isCreateEvent,
    onCloseUpdateEvent,
    onDeleteEvent,
    onUpdateEvent,
    onCloseCreateEvent,
    dayCreateEvent,
  } = hook;

  return (
    <DndProvider backend={HTML5Backend}>
      <>
        <Month {...hook} />
        {
          isUpdateEvent && (
              <UpdateEvent
                  onClose={onCloseUpdateEvent}
                  event={event}
                  onDeleteEvent={onDeleteEvent}
                  onUpdateEvent={onUpdateEvent}
              />
          )
        }
        {
          isCreateEvent && (
              <CreateEvent
                  onClose={onCloseCreateEvent}
                  dayCreateEvent={dayCreateEvent}
              />
          )
        }
      </>
    </DndProvider>
  );
};

export default Calendar;
