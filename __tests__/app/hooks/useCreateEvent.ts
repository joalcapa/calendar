import { renderHook, act, waitFor } from '@testing-library/react';
import { Day } from "@/types/month";
import useCreateEvent from '../../../app/hooks/useCreateEvent';

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('@/app/hooks/useEvents', () => require("../../../__mocks__/useEvents"));
// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock('@/app/hooks/useWeather', () => require("../../../__mocks__/useWeather"));

describe('useCreateEvent', () => {
    const mockOnClose = jest.fn();

    const props: {
        onClose: () => void;
        isDelete?: boolean;
        day: Day | null;
    } = {
        onClose: mockOnClose,
        isDelete: false,
        day: {
            day: new Date().getDate(),
            isCurrent: false,
            isToday: false,
            dayDate: new Date(),
            isCurrentMonth: false,
            events: [ ],
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useCreateEvent(props));

        expect(result.current.isLoading).toBe(false);
        expect(result.current.isDelete).toBe(false);
        expect(result.current.isCreating).toBe(false);
        expect(result.current.title).toBe('');
        expect(result.current.city).toBe('');
        expect(result.current.description).toBe('');
        expect(result.current.startDate).toBeTruthy();
        expect(result.current.isAllDay).toBe(false);
        expect(result.current.finishDate).toBeTruthy();
        expect(result.current.weather).toBe('');
        expect(result.current.weatherUrl).toBe('');
        expect(result.current.isValidForm).toBe(false);
    });

    it('should update title and validate form without description', () => {
        const { result } = renderHook(() => useCreateEvent(props));

        act(() => {
            result.current.changeTitle({ target: { value: 'Test title' } });
            result.current.changeCity({ target: { value: 'City Test' } });
            result.current.changeStartDate({ target: { value: '2024-10-07T10:00' } });
            result.current.changeFinishDate({ target: { value: '2024-10-07T12:00' } });
        });

        expect(result.current.isValidForm).toBe(false);
    });

    it('should update title and validate form', () => {
        const { result } = renderHook(() => useCreateEvent(props));

        act(() => {
            result.current.changeTitle({ target: { value: 'Test title' } });
            result.current.changeDescription({ target: { value: 'Test Description' } });
            result.current.changeCity({ target: { value: 'City Test' } });
            result.current.changeStartDate({ target: { value: '2024-10-07T10:00' } });
            result.current.changeFinishDate({ target: { value: '2024-10-07T12:00' } });
        });

        expect(result.current.isValidForm).toBe(true);
    });

    it('should update title and validate form with is all day', () => {
        const { result } = renderHook(() => useCreateEvent(props));

        act(() => {
            result.current.changeTitle({ target: { value: 'Test title' } });
            result.current.changeDescription({ target: { value: 'Test Description' } });
            result.current.changeCity({ target: { value: 'City Test' } });
            result.current.changeStartDate({ target: { value: '2024-10-07T10:00' } });
            result.current.changeAllDay({ target: { checked: true }});
        });

        expect(result.current.isValidForm).toBe(true);
        expect(result.current.finishDate != null).toBe(true);
    });

    it('should update title and validate form without isAllDay in true', () => {
        const { result } = renderHook(() => useCreateEvent(props));

        act(() => {
            result.current.changeTitle({ target: { value: 'Test title' } });
            result.current.changeDescription({ target: { value: 'Test Description' } });
            result.current.changeCity({ target: { value: 'City Test' } });
            result.current.changeAllDay({ target: { checked: false }});
            result.current.changeStartDate({ target: { value: '2024-10-07T10:00' } });
        });

        expect(result.current.isValidForm).toBe(true);
        expect(result.current.finishDate !== "").toBe(true);
    });

    it('should create event', async () => {
        const { result } = renderHook(() => useCreateEvent(props));

        act(() => {
            result.current.changeTitle({ target: { value: 'Test title' } });
            result.current.changeDescription({ target: { value: 'Test Description' } });
            result.current.changeCity({ target: { value: 'City Test' } });
            result.current.changeStartDate({ target: { value: '2024-10-07T10:00' } });
            result.current.changeAllDay({ target: { checked: true }});
        });

        expect(result.current.isValidForm).toBe(true);

        await waitFor(() => expect(result.current.weatherUrl).toEqual('images.com/i.png'));
        await waitFor(() => expect(result.current.weather).toEqual('Soleado'));

        await act(async () => {
            await result.current.onSend();
        });

        expect(mockOnClose).toHaveBeenCalled();
    });
});