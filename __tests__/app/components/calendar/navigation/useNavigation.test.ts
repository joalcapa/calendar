import { renderHook, act } from '@testing-library/react';
import { MONTH, WEEK, DAY, ADD_COUNT } from '@/app/hooks/useCalendarNavigation';
import useNavigation from '@/app/components/calendar/navigation/useNavigation';
import { startOfToday, addMonths, subDays, subMonths, addWeeks, subWeeks, addDays } from 'date-fns';

describe('useCalendarNavigation', () => {
  test('should initialize with today date and month view', () => {
    const { result } = renderHook(() => useNavigation());

    expect(result.current.isMount).toBe(true)
    expect(result.current.currentDate).toEqual(startOfToday());
    expect(result.current.view).toBe(MONTH);
  });

  test('should navigate to next month', () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.next();
    });

    expect(result.current.isMount).toBe(true)
    const expectedDate = addMonths(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate).toEqual(expectedDate);
  });

  test('should navigate to previous month', () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.prev();
    });

    expect(result.current.isMount).toBe(true)
    const expectedDate = subMonths(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate.toISOString()).toEqual(expectedDate.toISOString());
  });

  test('should change view to week', () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.setCurrentView(WEEK);
    });

    expect(result.current.isMount).toBe(true)
    expect(result.current.view).toBe(WEEK);
  });

  test('should reset to today', () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.onResetToday();
    });

    expect(result.current.isMount).toBe(true)
    expect(result.current.currentDate).toEqual(startOfToday());
    expect(result.current.view).toBe(MONTH);
  });

  test('should navigate to next week', () => {
    const { result } = renderHook(() => useNavigation());

    expect(result.current.view).toBe(MONTH);
    expect(result.current.isMount).toBe(true)

    act(() => {
      result.current.setCurrentView(WEEK);
    });

    expect(result.current.isMount).toBe(true)
    expect(result.current.view).toBe(WEEK);

    act(() => {
      result.current.next();
    });

    expect(result.current.isMount).toBe(true)
    const expectedDate = addWeeks(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate.toISOString()).toEqual(expectedDate.toISOString());
  });

  test('should navigate to previous week', () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.setCurrentView(WEEK);
    });

    expect(result.current.isMount).toBe(true)

    act(() => {
      result.current.prev();
    });

    expect(result.current.isMount).toBe(true)
    const expectedDate = subWeeks(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate.toISOString()).toEqual(expectedDate.toISOString());
  });

  test('should navigate to next day', () => {
    const { result } = renderHook(() => useNavigation());

    act(() => {
      result.current.setCurrentView(DAY);
    });

    expect(result.current.isMount).toBe(true)

    act(() => {
      result.current.next();
    });

    expect(result.current.isMount).toBe(true)
    const expectedDate = addDays(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate.toISOString()).toEqual(expectedDate.toISOString());
  });

  test('should navigate to previous day', () => {
    const initialDate = startOfToday();

    const { result } = renderHook(() => useNavigation());

    expect(result.current.currentDate).toEqual(initialDate);

    act(() => {
      result.current.setCurrentView(DAY);
    });

    expect(result.current.isMount).toBe(true)

    act(() => {
      result.current.prev();
    });

    expect(result.current.isMount).toBe(true)
    const expectedDate = subDays(initialDate, ADD_COUNT);
    expect(result.current.currentDate).toEqual(expectedDate);
  });
});
