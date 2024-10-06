import React from 'react';
import { Event } from '../../../../types/event';
import { Day } from '../../../../types/month';
import {getHourLabel, getPropsFromEventForHours} from '../../../../app/utils/utils';
import HourEvent from "../../../../app/components/calendar/dia/HourEvent";

interface CalendarColumnProps {
    events: Event[];
    day: Day;
    isHours?: boolean;
    dayName: string;
    today: number;
}

const CalendarColumn: React.FC<CalendarColumnProps> = ({ day, isHours = true, dayName, today }) => {
    const events = day.events || [];
    const hours = Array.from({ length: 13 }, (_, i) => i + 7);

    const renderEvents = () => {
        const renderedEvents: React.ReactNode[] = [];
        const positions: any = {};

        events.forEach((event, i) => {
            const eventProps = getPropsFromEventForHours(event, positions, null);

            renderedEvents.push(
                <HourEvent
                    key={"EVEN" + i}
                    {...eventProps}
                    event={event}
                    isHours={isHours}
                />
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
                {hours.map((hour) => (
                    <div
                        key={hour}
                        className="border-t border-b border-gray-200 relative h-16 flex items-center cursor-pointer hover:bg-gray-300"
                    >
                        {
                            isHours && (<span className="absolute left-2 top-0 text-xs">
              {getHourLabel(hour)}
            </span>)
                        }
                    </div>
                ))}
                {renderEvents()}
            </div>
        </>
    );
};

export default CalendarColumn;