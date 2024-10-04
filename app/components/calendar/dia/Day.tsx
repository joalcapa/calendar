'use client';

import React, { useState } from 'react';
import { Event } from '../../../../types/event';
import { Day } from '../../../../types/month';
import DayServer from './DayServer';
import EventManager from '../../../../app/components/calendar/events/eventManager/EventManager';
import DraggableEvent from '../../../../app/components/dnd/DraggableEvent';
import useCalendar from '../../../../app/hooks/useCalendar';
import Hour from "../../../../app/components/calendar/dia/Hour";
import HourEvent from "../../../../app/components/calendar/dia/HourEvent";
import { getPropsFromEventForHours } from '../../../../app/utils/utils';

interface CalendarColumnProps {
    day: Day,
    onHour: (hour: number) => void,
    onDragHour: (event: Event, day: Day) => void,
    onDropHour,
    onEvent: (event: Event) => void,
    isHours: boolean;
    hours: [ number ];
}

const CalendarColumn: React.FC<CalendarColumnProps> = (
    {
        day,
        onHour,
        onDragHour,
        onDropHour,
        onEvent,
        isHours,
        hours,
    }
) => {
    const events = day.events || [];
    const [hoveredEventId, setHoveredEventId] = useState<number | null>(null);

    const renderEvents = () => {
        const renderedEvents: React.ReactNode[] = [];
        const positions: any = {};

        events.forEach((event, i) => {
            const eventProps = getPropsFromEventForHours(event, positions, hoveredEventId);

            renderedEvents.push(
                <DraggableEvent
                    key={"EVEN" + i}
                    day={day}
                    event={event}
                    onDrag={onDragHour}
                >
                    {
                        ({ isDragging }: { isDragging: boolean }) => (
                            <HourEvent
                                {...eventProps}
                                event={event}
                                isDragging={isDragging}
                                onMouseEnter={() => setHoveredEventId(event.id)}
                                onMouseLeave={() => setHoveredEventId(null)}
                                onClick={() => onEvent(event)}
                                isHours={isHours}
                            />
                        )
                    }
                </DraggableEvent>
            );
        });

        return renderedEvents;
    };

    return (
        <div className="relative border-l border-r border-gray-200">
            {
                hours.map((hour, i) => (
                    <Hour
                        key={'ED' + i}
                        onDrop={() => onDropHour(hour, day)}
                        onHour={() => onHour(hour)}
                        isHours={isHours}
                        hour={hour}
                    />
                ))
            }
            {renderEvents()}
        </div>
    );
};

const Calendar: React.FC<MonthEvents> = (props) => {
    const {month, eventForUpdate, dayForCreateEvent} = useCalendar(props);

    return (
        <>
            {
                month.isMount ?
                    <CalendarColumn {...month} /> :
                    <DayServer
                        day={month.days[0]}
                        isHours={props.isHours}
                    />
            }
            <EventManager
                eventForUpdate={eventForUpdate}
                dayForCreateEvent={dayForCreateEvent}
            />
        </>
    );
};

export default Calendar;
