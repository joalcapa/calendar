'use client';

import React, { useState } from 'react';
import { Event } from '@/types/event';
import { useDrag, useDrop, /*DndProvider*/ } from 'react-dnd';
//import { HTML5Backend } from 'react-dnd-html5-backend';
import { Day } from '@/types/month';
import useCalendar from '@/app/hooks/useCalendar';
import { DateTime } from 'luxon';
import DayServer from './DayServer';
import EventManager from '@/app/components/calendar/events/eventManager/EventManager';

interface CalendarColumnProps {
    events: Event[];
    days: Day[];
    onHourClick: (hour: string) => void;
    onEventClick: (event: Event) => void;
    isHours: boolean;
}

const ItemTypes = {
    EVENT: 'event',
};


const EventComponent = ({ event, day, eventStartHour, eventStartMinute, onDragHour, setHoveredEventId, children }) => {
    const [{ isDragging }, drag] = useDrag({
        type: ItemTypes.EVENT,
        item: { id: event.id },
        collect: (monitor) => {
            if (monitor.isDragging()) {
                onDragHour(event, day)
            }

            return {isDragging: monitor.isDragging()
            }

        },
    });

    return (
        <div ref={drag}>
            {children}
        </div>
    );
};

const EventDrop = ({
                       children,
                       onDropHour
}) => {
    const [, drop] = useDrop({
        accept: ItemTypes.EVENT,
        drop: (item: { id: number; }) => {


            onDropHour()
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        }),
    });

    return (
        <div ref={drop}>
            {children}
        </div>
    );
}

const CalendarColumn: React.FC<CalendarColumnProps> = ({
                                                           day,
                                                           onHourClick,
                                                           onEventClick,
                                                           onHour,
                                                           onDragHour,
                                                           onDropHour,
                                                           eventDrag,
                                                           onDay,
                                                           onEvent,
                                                           isHours
                                                       }) => {
    const events = day.events || [];

    const hours = Array.from({length: 13}, (_, i) => i + 7); // Genera las horas de 7 a 19
    const [hoveredEventId, setHoveredEventId] = useState<number | null>(null); // Estado para el evento que está sobrevolando

    const renderEvents = () => {
        const renderedEvents: React.ReactNode[] = [];
        const positions: any = {};

        events.forEach((event) => {

            const startLocal = DateTime.fromJSDate(new Date(event.start_date)).toLocal();
            const endLocal = DateTime.fromJSDate(new Date(event.finish_date)).toLocal();

            const start = startLocal.setZone('UTC');
            const end = endLocal.setZone('UTC');

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

                if ((eventStart < prevEvent.eventEnd) && (eventEnd > prevEvent.eventStart)) {
                    overlapCount++; // Incrementa el contador de superposiciones
                }
            }

            // Ajusta la posición hacia la derecha o hacia la izquierda
            if (overlapCount > 0) {
                leftPosition = `${parseInt(leftPosition) + overlapCount * 50}px`; // Mueve a la derecha
            } else {
                leftPosition = `${parseInt(leftPosition) - overlapCount * 10}px`; // Mueve a la izquierda si no hay superposición
            }

            positions[event.id] = {
                eventStart,
                eventEnd,
                left: leftPosition,
            };

            const isHovered = hoveredEventId === event.id; // Verifica si el evento está siendo sobrevolado

            const hh = eventStartHour > 12 ? eventStartHour - 12 : eventStartHour;
            const mm = eventEndHour > 12 ? eventEndHour - 12 : eventEndHour;

            /*if (event.id === eventDrag?.id) {
             return(
                 <></>
             )
         }*/

            renderedEvents.push(
                <EventComponent key={day.day + event.id} day={day} event={event} onDragHour={onDragHour} eventStartHour={eventStartHour} eventStartMinute={eventStartMinute}>
                    <div

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
                            flexDirection: height < 40 ? 'row' : 'column',
                            //opacity: isDragging ? 0.5 : 1, // Cambiar la opacidad mientras se arrastra
                        }}
                        onMouseEnter={() => setHoveredEventId(event.id)}
                        onMouseLeave={() => setHoveredEventId(null)}
                        onClick={() => onEvent(event)}
                    >
                        <span className="text-xs" style={{marginTop: height < 20 ? -9 : 0}}>{event.title}</span>
                        <span className="text-xs"
                              style={{marginTop: height < 20 ? -9 : 0, paddingLeft: height < 40 ? 10 : 0}}>
                        {hh < 10 ? '0' + hh : hh}:{eventStartMinute < 10 ? '0' + eventStartMinute : eventStartMinute} {eventStartHour >= 12 ? 'PM' : 'AM'} - {mm < 10 ? '0' + mm : mm}:{eventEndMinute < 10 ? '0' + eventEndMinute : eventEndMinute} {eventEndHour >= 12 ? 'PM' : 'AM'}
                    </span>
                    </div>
                </EventComponent>
            );
        });

        return renderedEvents;
    };

    return (
        <div className="relative border-l border-r border-gray-200">
            {hours.map((hour) => {
                return (
                    <EventDrop key={hour + day.day} onDropHour={() => onDropHour(hour, day)}>
                        <div
                            className="border-t border-b border-gray-200 relative h-16 flex items-center cursor-pointer hover:bg-gray-300"
                            onClick={() => {
                                onHour(hour)
                            }}
                        >
                            {
                                isHours && (<span className="absolute left-2 top-0 text-xs">
                                {`${hour % 12 === 0 ? 12 : hour % 12}:00 ${hour < 12 ? 'AM' : 'PM'}`}
                            </span>)
                            }
                        </div>
                    </EventDrop>
                );
            })}
            {renderEvents()}
        </div>
    );
};

const Calendar: React.FC<MonthEvents> = (props) => {
    const {month, eventForUpdate, dayForCreateEvent} = useCalendar(props);

    return (
        <>
            {/*<DndProvider backend={HTML5Backend}>*/}
            {month.isMount ? <CalendarColumn {...month} /> :
                <DayServer day={month.days[0]} isHours={props.isHours}/>}
            {/*</DndProvider>*/}
            <EventManager
                eventForUpdate={eventForUpdate}
                dayForCreateEvent={dayForCreateEvent}
            />
        </>
    );
};

export default Calendar;
