/**
 * @module useCalendarNavigation
 *
 * This module provides a custom React hook for navigating through a calendar interface.
 * It supports monthly, weekly, and daily views, allowing users to reset the view to today,
 * navigate to the previous or next period, and change the current view type.
 */

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addMonths, addWeeks, addDays, startOfToday } from 'date-fns';
import { format } from '../utils/utils';

/**
 * Defines the possible views for the calendar navigation.
 */
export type View = 'MONTH' | 'WEEK' | 'DAY';

/** Constant representing the month view type. */
export const MONTH = "MONTH";
/** Constant representing the week view type. */
export const WEEK = "WEEK";
/** Constant representing the day view type. */
export const DAY = "DAY";
/** Constant for adding periods. */
export const ADD_COUNT = 1;
/** Constant for subtracting periods. */
export const DIFF_COUNT = -1;
/** The format for dates in the calendar. */
const DATE_FORMAT = 'yyyy-MM-dd';

/**
 * A custom hook for managing calendar navigation.
 *
 * @param props - An object containing the type of view.
 * @param props.type - The initial type of view, can be 'MONTH', 'WEEK', or 'DAY'.
 *
 * @returns An object containing methods and state related to calendar navigation.
 *
 * @example
 * const {
 *   onMonth,
 *   onWeek,
 *   onDay,
 *   onResetToday,
 *   currentDate,
 *   view,
 *   onNext,
 *   onPrev,
 *   setCurrentView,
 * } = useCalendarNavigation({ type: 'MONTH' });
 */
const useCalendarNavigation = (props: { type: string | null }) => {
  const { type } = props;
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  console.log(params.get('date'))

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const dateParam = params.get('date');
    return dateParam ? new Date(dateParam) : startOfToday();
  });

  const [view, setView] = useState<View>(type ? (type.toUpperCase() as View) : MONTH);
  const { replace } = useRouter();

  /**
   * Resets the current date to today.
   */
  const onResetToday = () => {
    const newDate = startOfToday();
    setCurrentDate(newDate);
    replace(`/${ view === MONTH ? 'month' : view.toLocaleLowerCase() }?date=${format(newDate, DATE_FORMAT)}&type=${view.toLocaleLowerCase()}`);
  };

  /**
   * Navigates to the previous period based on the current view.
   */
  const onPrev = () => {
    if (view === MONTH) {
      const newDate = addMonths(currentDate, DIFF_COUNT);
      setCurrentDate(newDate);
      replace(`/month?date=${format(newDate, DATE_FORMAT)}&type=${MONTH.toLocaleLowerCase()}`);
    } else if (view === WEEK) {
      const newDate = addWeeks(currentDate, DIFF_COUNT);
      setCurrentDate(newDate);
      replace(`/week?date=${format(newDate, DATE_FORMAT)}&type=${WEEK.toLocaleLowerCase()}`);
    } else if (view === DAY) {
      const newDate = addDays(currentDate, DIFF_COUNT);
      setCurrentDate(newDate);
      replace(`/day?date=${format(newDate, DATE_FORMAT)}&type=${DAY.toLocaleLowerCase()}`);
    }
  };

  /**
   * Navigates to the next period based on the current view.
   */
  const onNext = () => {
    if (view === MONTH) {
      const newDate = addMonths(currentDate, ADD_COUNT);
      setCurrentDate(newDate);
      replace(`/month?date=${format(newDate, DATE_FORMAT)}&type=${MONTH.toLocaleLowerCase()}`);
    } else if (view === WEEK) {
      const newDate = addWeeks(currentDate, ADD_COUNT);
      setCurrentDate(newDate);
      replace(`/week?date=${format(newDate, DATE_FORMAT)}&type=${WEEK.toLocaleLowerCase()}`);
    } else if (view === DAY) {
      const newDate = addDays(currentDate, ADD_COUNT);
      setCurrentDate(newDate);
      replace(`/day?date=${format(newDate, DATE_FORMAT)}&type=${DAY.toLocaleLowerCase()}`);
    }
  };

  /**
   * Sets the current view to a specified view type.
   *
   * @param newView - The view type to set ('MONTH', 'WEEK', or 'DAY').
   */
  const setCurrentView = (newView: View) => {
    setView(newView);
  };

  /**
   * Navigates to the month view.
   */
  const onMonth = useCallback(() => {
    setView(MONTH);
    replace(`/month?date=${format(currentDate, DATE_FORMAT)}&type=${MONTH.toLocaleLowerCase()}`);
  }, [replace, currentDate]);

  /**
   * Navigates to the week view.
   */
  const onWeek = useCallback(() => {
    setView(WEEK);
    replace(`/week?date=${format(currentDate, DATE_FORMAT)}&type=${WEEK.toLocaleLowerCase()}`);
  }, [replace, currentDate]);

  /**
   * Navigates to the day view.
   */
  const onDay = useCallback(() => {
    setView(DAY);
    replace(`/day?date=${format(currentDate, DATE_FORMAT)}&type=${DAY.toLowerCase()}`);
  }, [replace, currentDate]);

  return {
    onMonth,
    onWeek,
    onDay,
    onResetToday,
    currentDate,
    view,
    onNext,
    onPrev,
    setCurrentView,
  };
};

export default useCalendarNavigation;
