import {
    createEventOnWeek,
    createEvent,
    deleteEventOnWeek,
    deleteEvent,
    updateEvent,
    updateEventOnWeek,
    updateEventWithDifferentDays,
    updateEventWithDifferentDaysOnWeek,
} from '../../../app/lib/eventUtils';
import { Day } from '../../../types/month';
import { mockRequestData } from '../../../__mocks__/eventRequest';
import { mockEvents } from '../../../__mocks__/eventData';
import { MonthData } from '../../../app/lib/eventUtils';
import { Event } from "@/types/event";
import { monthData, monthDataTwoDays } from '../../../__mocks__/monthData';

describe('Event Manipulation Functions', () => {
    const initialData: Array<MonthData> = [ monthData ];
    const initialDataTwoDays: Array<MonthData> = [ monthDataTwoDays ];
    const eventRequest = mockRequestData[0];
    const event = mockEvents[0];

    test('createEventOnWeek adds event to correct day', () => {
        const result = createEventOnWeek(eventRequest)(initialData);
        console.log(result[0].days[0].events)
        expect(result[0].days[0].events).toHaveLength(2);
        expect(result[0].days[0].events[0]).toEqual(eventRequest);
    });

    test('createEvent adds event to correct day', () => {
        const result = createEvent(eventRequest)(monthData);
        expect(result.days[0].events).toHaveLength(2);
        expect(result.days[0].events[0]).toEqual(eventRequest);
    });

    test('deleteEventOnWeek removes event from correct day', () => {
        const result = deleteEventOnWeek(event.id)(initialData);
        expect(result[0].days[0].events).toHaveLength(0);
    });

    test('deleteEvent removes event from correct day', () => {
        const result = deleteEvent(event.id)(monthData);
        expect(result.days[0].events).toHaveLength(0);
    });

    test('updateEvent updates event data', () => {
        const updatedEvent = {
            id: 14,
            data: { ...eventRequest, title: 'Updated Meeting' },
        };

        const result = updateEvent(updatedEvent)(monthData);
        expect(result.days[0].events[0].title).toBe('Updated Meeting');
    });

    test('updateEventOnWeek updates event data', () => {
        const updatedEvent = {
            id: 14,
            data: { ...eventRequest, title: 'Updated Meeting' },
        };

        const result = updateEventOnWeek(updatedEvent)(initialData);
        expect(result[0].days[0].events[0].title).toBe('Updated Meeting');
    });

    test('updateEventWithDifferentDays updates event from old day to current day', () => {
        const oldDay: Day = {
            day: 10,
            isCurrent: false,
            isToday: false,
            dayDate: new Date(event.start_date),
            isCurrentMonth: false,
            events: [ event ],
        };

        const currentDay: Day = {
            day: 2,
            isCurrent: false,
            isToday: false,
            dayDate: new Date("2024-10-02T00:00:00.000Z"),
            isCurrentMonth: false,
            events: [],
        };

        const updatedEvent = {
            id: 14,
            data: { ...eventRequest, title: 'Updated Meeting' },
        };

        const result = updateEventWithDifferentDays(oldDay, currentDay, updatedEvent)(monthDataTwoDays);
        expect(result.days[1].events[1].title).toBe('Updated Meeting');
        expect(result.days[0].events).toHaveLength(0);
    });

    test('updateEventWithDifferentDaysOnWeek updates event from old day to current day', () => {
        const oldDay: Day = {
            day: 10,
            isCurrent: false,
            isToday: false,
            dayDate: new Date(event.start_date),
            isCurrentMonth: false,
            events: [ event ],
        };

        const currentDay: Day = {
            day: 2,
            isCurrent: false,
            isToday: false,
            dayDate: new Date("2024-10-02T00:00:00.000Z"),
            isCurrentMonth: false,
            events: [],
        };

        const updatedEvent = {
            id: 14,
            data: { ...eventRequest, title: 'Updated Meeting' },
        };

        const result = updateEventWithDifferentDaysOnWeek(oldDay, currentDay, updatedEvent)(initialDataTwoDays);
        expect(result[0].days[1].events[1].title).toBe('Updated Meeting');
        expect(result[0].days[0].events).toHaveLength(0);
    });
});
