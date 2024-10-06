'use client';

import React, { useState } from 'react';
import { Event } from '../../../../types/event';
import { Day } from '../../../../types/month';
import DayServer from './DayServer';
import EventManager from '../../../../app/components/calendar/events/eventManager/EventManager';
import DraggableEvent from '../../../../app/components/dnd/DraggableEvent';
import useCalendar from '../../../../app/hooks/useCalendarRQ';
import Hour from "../../../../app/components/calendar/dia/Hour";
import HourEvent from "../../../../app/components/calendar/dia/HourEvent";
import { getPropsFromEventForHours } from '../../../../app/utils/utils';
import { MonthEvents } from "../../../../types/month";

interface CalendarColumnProps {
    day: Day,
    onHour: (hour: number) => void,
    onDropHour,
    onEvent: (event: Event) => void,
    isHours: boolean;
    hours: [ number ];
    dayName: string;
}

const CalendarColumn: React.FC<CalendarColumnProps> = (
    {
        day,
        onHour,
        onDropHour,
        onEvent,
        isHours,
        hours,
        dayName,
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
        <>
            <h3 className="text-xl font-semibold text-gray-800 pb-3">{ dayName }</h3>
            <div className="relative border-l border-r border-gray-200">
                {
                    hours.map((hour, i) => (
                        <Hour
                            key={'ED' + i}
                            onDrop={(event: Event, oldDay: Day) => onDropHour(event, oldDay, hour, day)}
                            onHour={() => onHour(hour)}
                            isHours={isHours}
                            hour={hour}
                        />
                    ))
                }
                {renderEvents()}
            </div>
        </>
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
                        day={{...props.days[0]}}
                        isHours={props.isHours}
                        dayName={month.dayName}
                    />
            }
            <EventManager
                eventForUpdate={eventForUpdate}
                dayForCreateEvent={dayForCreateEvent}
                dayNumber={props.dayNumber}
            />
        </>
    );
};

export default Calendar;
