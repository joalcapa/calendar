import { renderHook, act } from '@testing-library/react';
import useCalendarNavigation from '@/app/hooks/useCalendarNavigation';
import { startOfToday, addMonths, subDays, subMonths, addWeeks, subWeeks, addDays } from 'date-fns';

const MONTH = "MONTH";
const WEEK = "WEEK";
const DAY = "DAY";
const ADD_COUNT = 1;

describe('useCalendarNavigation', () => {
  test('should initialize with today date and month view', () => {
    const { result } = renderHook(() => useCalendarNavigation());

    expect(result.current.currentDate).toEqual(startOfToday());
    expect(result.current.view).toBe(MONTH);
  });

  test('should navigate to next month', () => {
    const { result } = renderHook(() => useCalendarNavigation());

    act(() => {
      result.current.next();
    });

    const expectedDate = addMonths(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate).toEqual(expectedDate);
  });

  test('should navigate to previous month', () => {
    const { result } = renderHook(() => useCalendarNavigation());

    act(() => {
      result.current.prev();
    });

    const expectedDate = subMonths(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate.toISOString()).toEqual(expectedDate.toISOString());
  });

  test('should change view to week', () => {
    const { result } = renderHook(() => useCalendarNavigation());

    act(() => {
      result.current.setCurrentView(WEEK);
    });

    expect(result.current.view).toBe(WEEK);
  });

  test('should reset to today', () => {
    const { result } = renderHook(() => useCalendarNavigation());

    act(() => {
      result.current.resetToToday();
    });

    expect(result.current.currentDate).toEqual(startOfToday());
    expect(result.current.view).toBe(MONTH);
  });

  test('should navigate to next week', () => {
    const { result } = renderHook(() => useCalendarNavigation());

    expect(result.current.view).toBe(MONTH);

    act(() => {
      result.current.setCurrentView(WEEK);
    });

    expect(result.current.view).toBe(WEEK);

    act(() => {
      result.current.next();
    });

    const expectedDate = addWeeks(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate.toISOString()).toEqual(expectedDate.toISOString());
  });

  test('should navigate to previous week', () => {
    const { result } = renderHook(() => useCalendarNavigation());

    act(() => {
      result.current.setCurrentView(WEEK);
    });

    act(() => {
      result.current.prev();
    });

    const expectedDate = subWeeks(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate.toISOString()).toEqual(expectedDate.toISOString());
  });

  test('should navigate to next day', () => {
    const { result } = renderHook(() => useCalendarNavigation());

    act(() => {
      result.current.setCurrentView(DAY);
    });

    act(() => {
      result.current.next();
    });

    const expectedDate = addDays(startOfToday(), ADD_COUNT);
    expect(result.current.currentDate.toISOString()).toEqual(expectedDate.toISOString());
  });

  test('should navigate to previous day', () => {
    const initialDate = startOfToday();

    const { result } = renderHook(() => useCalendarNavigation());

    expect(result.current.currentDate).toEqual(initialDate);

    act(() => {
      result.current.setCurrentView(DAY);
    });

    act(() => {
      result.current.prev();
    });

    const expectedDate = subDays(initialDate, ADD_COUNT);
    expect(result.current.currentDate).toEqual(expectedDate);
  });
});
