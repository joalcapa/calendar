import { Event } from "@/types/event";
import { DateTime } from "luxon";

export const formatDateForInput = (d: Date | string) => {
    const date = new Date(d);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const formatDateYYYYMMDD = (d: Date | string) => {
    const startDate = new Date(d);
    return `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
};

export const getHourLabel = (hour: number) => {
    return `${ hour > 12 ? hour - 12 : `0${ hour }`  }:00 ${ hour < 12 ? 'AM' : 'PM' }`
};

export const getPropsFromEventForHours = (event: Event, positions: any, hoveredEventId: number) => {
    const startLocal = DateTime.fromJSDate(new Date(event.start_date)).toLocal();
    const endLocal = DateTime.fromJSDate(new Date(event.finish_date)).toLocal();

    const start = startLocal.setZone('UTC');
    const end = endLocal.setZone('UTC');

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

        if ((eventStart < prevEvent.eventEnd) && (eventEnd > prevEvent.eventStart)) {
            overlapCount++;
        }
    }

    if (overlapCount > 0) {
        leftPosition = `${parseInt(leftPosition) + overlapCount * 50}px`;
    } else {
        leftPosition = `${parseInt(leftPosition) - overlapCount * 10}px`;
    }

    positions[event.id] = {
        eventStart,
        eventEnd,
        left: leftPosition,
    };

    const hh = eventStartHour > 12 ? eventStartHour - 12 : eventStartHour;
    const mm = eventEndHour > 12 ? eventEndHour - 12 : eventEndHour;

    return {
        height,
        eventStart,
        leftPosition,
        isHovered: hoveredEventId === event.id,
        hourLabel: `${
            hh < 10 ? '0' + hh : hh
        }:${
            eventStartMinute < 10 ? '0' + eventStartMinute : eventStartMinute
        } ${
            eventStartHour >= 12 ? 'PM' : 'AM'} - ${mm < 10 ? '0' + mm : mm
        }:${
            eventEndMinute < 10 ? '0' + eventEndMinute : eventEndMinute
        } ${
            eventEndHour >= 12 ? 'PM' : 'AM'
        }`,
    }
}