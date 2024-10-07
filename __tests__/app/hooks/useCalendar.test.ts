import { renderHook, act, waitFor } from '@testing-library/react';
import useCalendar from '../../../app/hooks/useCalendar';
import { MonthEvents } from '../../../types/month';
import { Event } from '../../../types/event';

const updateEventMock = jest.fn();

jest.mock('../../../app/hooks/useDays', () => ({
    __esModule: true,
    default: () => ({
        days: [
            { dayDate: new Date(), dayName: 'Monday' },
        ],
    }),
}));

jest.mock('../../../app/hooks/useEvents', () => ({
    __esModule: true,
    default: () => ({
        updateEvent: updateEventMock,
    }),
}));

describe('useCalendar', () => {
    const props: MonthEvents = {
        today: new Date(),
        startDayOfMonth: new Date(),
        monthName: 'October',
        dayName: 'Monday',
        isHours: true,
        dayNumber: 31,
        isSmallHour: false,
    };

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useCalendar(props));

        expect(result.current.month.isMount).toBe(true);
        expect(result.current.month.days).toHaveLength(1);
        expect(result.current.month.day).toBe(result.current.month.days[0]);
        expect(result.current.eventForUpdate.isVisible).toBe(false);
        expect(result.current.dayForCreateEvent.isVisible).toBe(false);
    });

    it('should set day and create event on onDay call', () => {
        const { result } = renderHook(() => useCalendar(props));
        const day = { dayDate: new Date(), dayName: 'Monday' };

        act(() => {
            result.current.month.onDay(day);
        });

        expect(result.current.dayForCreateEvent.day).toEqual(day);
        expect(result.current.dayForCreateEvent.isVisible).toBe(true);
    });

    it('should update event on onEvent call', () => {
        const { result } = renderHook(() => useCalendar(props));
        const event: Event = { id: '1', title: 'Test Event', description: 'Test Description', start_date: new Date(), finish_date: new Date(), is_all_day: false };

        act(() => {
            result.current.month.onEvent(event);
        });

        expect(result.current.eventForUpdate.event).toEqual(event);
        expect(result.current.eventForUpdate.isVisible).toBe(true);
    });

    it('should close event creation/updating on onClose call', () => {
        const { result } = renderHook(() => useCalendar(props));

        act(() => {
            result.current.month.onDay({ dayDate: new Date(), dayName: 'Monday' });
        });

        act(() => {
            result.current.eventForUpdate.onClose();
        });

        expect(result.current.eventForUpdate.isVisible).toBe(false);
        expect(result.current.dayForCreateEvent.isVisible).toBe(false);
    });

    it('should call updateEvent on onDropHour', async () => {
        const { result } = renderHook(() => useCalendar(props));
        const event: Event = { id: '1', title: 'Test Event', description: 'Test Description', start_date: new Date(), finish_date: new Date(), is_all_day: false };
        const oldDay = { dayDate: new Date(), dayName: 'Monday' };
        const newDay = { dayDate: new Date(), dayName: 'Tuesday' };
        const hour = 9;

        act(() => {
            result.current.month.onEvent(event);
        });

        await act(async () => {
            await result.current.month.onDropHour(event, oldDay, hour, newDay);
        });

        await waitFor(() => {
            expect(updateEventMock).toHaveBeenCalledWith(expect.objectContaining({
                id: event.id,
                data: expect.objectContaining({
                    title: event.title,
                    start_date: expect.any(Date),
                    finish_date: expect.any(Date),
                }),
                oldDay,
                currentDay: newDay,
            }));
        });
    });
});
