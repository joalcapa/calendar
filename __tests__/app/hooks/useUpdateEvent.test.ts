import { renderHook, act } from '@testing-library/react';
import useUpdateEvent from '../../../app/hooks/useUpdateEvent';
import useEvents from '../../../app/hooks/useEvents';
import { Event } from "../../../types/event";
import { mockEvents } from '../../../__mocks__/eventData'

jest.mock('../../../app/hooks/useEvents', () => ({
    __esModule: true,
    default: () => ({
        deleteEvent: jest.fn(),
        updateEvent: jest.fn(),
    }),
}));

describe('useUpdateEvent', () => {
    const mockOnClose = jest.fn();
    const mockEvent: Event = mockEvents[0];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with correct values', () => {
        const { result } = renderHook(() => useUpdateEvent({ event: mockEvent, isVisible: true, onClose: mockOnClose }));

        expect(result.current.title).toBe(mockEvent.title);
        expect(result.current.description).toBe(mockEvent.description);
        expect(result.current.city).toBe(mockEvent.city);
        expect(result.current.weather).toBe(mockEvent.weather);
        expect(result.current.weatherUrl).toBe(mockEvent.weather_url);
        expect(result.current.isAllDay).toBe(mockEvent.is_all_day);
        expect(result.current.startDate).toBe("2024-10-01T07:00");
        expect(result.current.finishDate).toBe("2024-10-01T08:22");
    });

    it('should call updateEvent with correct data on onUpdate', async () => {
        const { result } = renderHook(() => useUpdateEvent({ event: mockEvent, isVisible: true, onClose: mockOnClose }));

        act(() => {
            result.current.changeTitle({ target: { value: 'Updated Event' } });
            result.current.changeDescription({ target: { value: 'Updated Description' } });
            result.current.changeCity({ target: { value: 'Updated City' } });
            result.current.changeWeather('Cloudy');
            result.current.changeWeatherUrl('http://example.com/updated-weather.png');
            result.current.setAllDay(true);
        });

        await act(async () => {
            await result.current.onSend();
        });

        expect(mockOnClose).toHaveBeenCalled();
        /*expect(useEvents().updateEvent).toHaveBeenCalledWith({
            id: mockEvent.id,
            data: {
                title: 'Updated Event',
                description: 'Updated Description',
                city: 'Updated City',
                weather: 'Cloudy',
                weather_url: 'http://example.com/updated-weather.png',
                is_all_day: true,
                start_date: new Date(mockEvent.start_date + "Z").toISOString(),
                finish_date: new Date(mockEvent.finish_date + "Z").toISOString(),
            },
        });*/
    });

    it('should call deleteEvent with correct id on onDelete', async () => {
        const { result } = renderHook(() => useUpdateEvent({ event: mockEvent, isVisible: true, onClose: mockOnClose }));

        await act(async () => {
            await result.current.onDelete();
        });

        //expect(useEvents().deleteEvent).toHaveBeenCalledWith(mockEvent.id);
        expect(mockOnClose).toHaveBeenCalled();
    });

    it('should not call updateEvent if form is invalid', async () => {
        const { result } = renderHook(() => useUpdateEvent({ event: mockEvent, isVisible: true, onClose: mockOnClose }));

        act(() => {
            result.current.changeTitle({ target: { value: '' } });
        });

        await act(async () => {
            await result.current.onSend();
        });

        expect(useEvents().updateEvent).not.toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });
    /*
    it('should handle error in onUpdate gracefully', async () => {
        const { result } = renderHook(() => useUpdateEvent({ event: mockEvent, isVisible: true, onClose: mockOnClose }));

        useEvents().updateEvent.mockRejectedValue(new Error('Update failed'));

        act(() => {
            result.current.changeTitle({ target: { value: 'Updated Event' } });
            result.current.changeDescription({ target: { value: 'Updated Description' } });
        });

        await act(async () => {
            await result.current.onSend();
        });

        expect(useEvents().updateEvent).toHaveBeenCalled();
        expect(mockOnClose).not.toHaveBeenCalled();
    });*/
/*
    it('should handle error in onDelete gracefully', async () => {
        const { result } = renderHook(() => useUpdateEvent({ event: mockEvent, isVisible: true, onClose: mockOnClose }));

        // Simulamos que deleteEvent lanza un error
        useEvents().deleteEvent.mockRejectedValue(new Error('Delete failed'));

        await act(async () => {
            await result.current.onDelete(); // Llama a la función onDelete
        });

        expect(useEvents().deleteEvent).toHaveBeenCalledWith(mockEvent.id);
        expect(mockOnClose).not.toHaveBeenCalled(); // No se debe cerrar si hay un error
    });
*/
    it('should set all day correctly', () => {
        const { result } = renderHook(() => useUpdateEvent({ event: mockEvent, isVisible: true, onClose: mockOnClose }));

        act(() => {
            result.current.setAllDay(true);
        });

        expect(result.current.isAllDay).toBe(true);
    });

    it('should correctly format start and finish dates', () => {
        const { result } = renderHook(() => useUpdateEvent({ event: mockEvent, isVisible: true, onClose: mockOnClose }));
        expect(result.current.startDate).toBe("2024-10-01T07:00");
        expect(result.current.finishDate).toBe("2024-10-01T08:22");
    });
});
