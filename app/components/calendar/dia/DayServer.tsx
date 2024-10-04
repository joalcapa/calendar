import React from 'react';
import { Event } from '@/types/event';
import { Day } from '@/types/month';
import { DateTime } from "luxon";

interface CalendarColumnProps {
    events: Event[];
    day: Day;
    isHours?: boolean;
}

const CalendarColumn: React.FC<CalendarColumnProps> = ({ day, isHours = true }) => {
    const events = day.events || [];
    const hours = Array.from({ length: 13 }, (_, i) => i + 7);

    const renderEvents = () => {
        const renderedEvents: React.ReactNode[] = [];
        const positions = {};

        events.forEach((event) => {
            const start = DateTime.fromJSDate(event.start_date).setZone('UTC');
            const end = DateTime.fromJSDate(event.finish_date).setZone('UTC');

            const eventStartHour = start.hour;
            const eventStartMinute = start.minute;
            const eventEndHour = end.hour;
            const eventEndMinute = end.minute;
            const eventStart = (eventStartHour - 7) * 64 + eventStartMinute;
            const eventEnd = (eventEndHour - 7) * 64 + eventEndMinute;
            const height = eventEnd - eventStart;

            let leftPosition = '80px';
            let overlapCount = 0;

            for (const key in positions) {
                const prevEvent = positions[key];
                if (
                    (eventStart < prevEvent.eventEnd) &&
                    (eventEnd > prevEvent.eventStart)
                ) {
                    overlapCount++;
                }
            }

            if (overlapCount > 0) {
                leftPosition = `${parseInt(leftPosition) + overlapCount * 50}px`;
            } else {
                leftPosition = `${parseInt(leftPosition) - (overlapCount * 10)}px`;
            }

            positions[event.id] = {
                eventStart,
                eventEnd,
                left: leftPosition,
            };

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
                        zIndex: 3,
                        paddingTop: height < 40 ? 5 : 0,
                        paddingLeft: 5,
                        display: 'flex',
                        flexDirection: height < 40 ? 'row' : 'column'
                    }}
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

export default CalendarColumn;