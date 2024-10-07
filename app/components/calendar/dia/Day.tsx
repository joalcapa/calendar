'use client';

import React, { useState } from 'react';
import { Event } from '../../../../types/event';
import { Day } from '../../../../types/month';
import DayServer from './DayServer';
import EventManager from '../../../../app/components/calendar/events/eventManager/EventManager';
import DraggableEvent from '../../../../app/components/dnd/DraggableEvent';
import useCalendar from '../../../hooks/useCalendar';
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
    today: number;
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
        today,
        isSmallHour,
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
                                isSmallHour={isSmallHour}
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
            <h3 className="flex flex-row text-xl font-semibold text-gray-800 pb-3">
                {dayName}
                {today === day.day && <div className="text-xs pl-3 text-orange-600">HOY</div>}
            </h3>
            <div className={`relative border-r ${today === day.day ? 'border-l border-orange-600' : day.isCurrent ? 'border-l border-blue-600' : 'border-l border-gray-200'}`}>
                {
                    hours.map((hour, i) => (
                        <Hour
                            key={'ED' + i}
                            onDrop={(event: Event, oldDay: Day) => onDropHour(event, oldDay, hour, day)}
                            onHour={() => onHour(hour)}
                            isHours={isHours}
                            hour={hour}
                            isSmallHour={isSmallHour}
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
                        today={month.today}
                        isSmallHour={month.isSmallHour}
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
