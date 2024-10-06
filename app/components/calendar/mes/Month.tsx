'use client';

import React from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Event } from '../../../../types/event';
import { Day, MonthEvents } from '../../../../types/month';
import useCalendar from '../../../../app/hooks/useCalendarRQ';
import MonthServer from './MonthServer';
import EventManager from "../../../../app/components/calendar/events/eventManager/EventManager";

interface MonthProps {
    today: number;
    startDayOfMonth: number;
    days: Day[];
    daysServer: Day[];
    isMount: boolean;
    onDrop: (event: Event, day: Day) => void;
    onDay: (day: Day) => void;
    onDrag: (event: Event) => void;
    onEvent: (event: Event) => void;
    monthName: string;
    eventDrag: Event;
}

const ItemTypes = {
    EVENT: 'event',
};

const DraggableEvent: React.FC<{
    event: Event,
    onDrag: (event: Event) => void,
    onEvent: (event: Event) => void,
}> = (
    {
        event,
        onDrag,
        onEvent,
    }
) => {
        const [{ isDragging }, drag] = useDrag(() => ({
            type: ItemTypes.EVENT,
            item: { event },
            collect: (monitor) => {
                if (monitor.isDragging()) {
                    console.log("Vamos a mover, ", event.id)
                    onDrag(event);
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
                onClick={(e) => {
                    e.stopPropagation(); onEvent(event);
                }}
            >
                {event.title}
            </div>
        );
    };

const DroppableDay: React.FC<{
    today: number,
    day: Day;
    onDrop: (event: Event, day: Day) => void,
    onDay: (day: Day) => void
}
> = (
    {
        day,
        onDrop,
        children,
        onDay,
        today,
    }) => {
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
                    onDay(day);
                }
                }
            >
                {children}
            </div>
        );
    };

const Month: React.FC<MonthProps> = (
    {
        today,
        startDayOfMonth,
        days,
        isMount,
        onDrop,
        onDay,
        onDrag,
        onEvent,
        monthName,
        eventDrag,
        daysServer,
    }
) => (
    <>
        {isMount ? (
            <div className="max-w-3xl mx-auto text-center">
                <h3 className="text-xl font-semibold text-gray-800 pb-3">{monthName}</h3>
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                        <div className="font-bold flex items-center justify-center" key={day}>
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({length: startDayOfMonth}, (_, index) => (
                        <div key={`empty-${index}`} className="flex items-center justify-center">
                            <div
                                className="relative flex flex-col items-start justify-start border border-gray-300 h-32 w-32 bg-gray-200"></div>
                        </div>
                    ))}
                    {days.map((day, index) => (
                        <div key={index} className="flex items-center justify-center">
                            <DroppableDay
                                key={day.day}
                                today={today}
                                day={day}
                                onDrop={onDrop}
                                onDay={onDay}
                            >
                                <span
                                    className="absolute top-1 left-1 text-xs font-bold">{day.day} {day.isToday ? '- HOY' : ''}</span>
                                <div className="mt-5 w-full h-full overflow-hidden">
                                    {day.events.filter((e) => e.id != eventDrag?.id).map((event, eventIndex) => (
                                        <DraggableEvent
                                            key={eventIndex}
                                            event={event}
                                            onDrag={onDrag}
                                            day={day}
                                            onEvent={onEvent}
                                        />
                                    ))}
                                </div>
                            </DroppableDay>
                        </div>
                    ))}
                    {Array.from({length: startDayOfMonth + days.length % 7 === 0 ? 0 : 7 - (startDayOfMonth + days.length % 7)}, (_, index) => (
                        <div key={`empty-end-${index}`} className="flex items-center justify-center">
                            <div
                                className="relative flex flex-col items-start justify-start border border-gray-300 h-32 w-32 bg-gray-200"></div>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
            <MonthServer
                days={daysServer}
                today={today}
                startDayOfMonth={startDayOfMonth}
                monthName={monthName}
            />
        )}
    </>
);

const Calendar: React.FC<MonthEvents> = (props) => {
    const { month, eventForUpdate, dayForCreateEvent } = useCalendar(props);

    return (
        <>
            <DndProvider backend={HTML5Backend}>
                <Month {...month} daysServer={props.days} />
            </DndProvider>
            <EventManager
                eventForUpdate={eventForUpdate}
                dayForCreateEvent={dayForCreateEvent}
                path={props.path}
            />
        </>
    );
};

export default Calendar;