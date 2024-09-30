import { useState } from 'react';
import { addMonths, addWeeks, addDays, startOfToday } from 'date-fns';

type View = 'MONTH' | 'WEEK' | 'DAY';

export const MONTH = "MONTH";
export const WEEK = "WEEK";
export const DAY = "DAY";
export const ADD_COUNT = 1;
export const DIFF_COUNT = -1;

const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState<Date>(startOfToday());
  const [view, setView] = useState<View>(MONTH);

  const onResetToday = () => {
    setCurrentDate(startOfToday());
    setView(MONTH);
  };

  const prev = () => {
    if (view === MONTH) {
      setCurrentDate((prev) => addMonths(prev, DIFF_COUNT));
      return
    }

    if (view === WEEK) {
      setCurrentDate((prev) => addWeeks(prev, DIFF_COUNT));
      return
    }

    if (view === DAY) {
      setCurrentDate((prev) => addDays(prev, DIFF_COUNT));
      return
    }
  };

  const next = () => {
    if (view === MONTH) {
      setCurrentDate((prev) => addMonths(prev, ADD_COUNT));
      return
    }

    if (view === WEEK) {
      setCurrentDate((prev) => addWeeks(prev, ADD_COUNT));
      return
    }

    if (view === DAY) {
      setCurrentDate((prev) => addDays(prev, ADD_COUNT));
      return
    }
  };

  const setCurrentView = (newView: View) => {
    setView(newView);
  };

  const onMonth = () => {
    setView(MONTH);
  };

  const onWeek = () => {
    setView(WEEK);
  };

  const onDay = () => {
    setView(DAY);
  };

  return {
    onMonth,
    onWeek,
    onDay,
    onResetToday,
    currentDate,
    view,
    next,
    prev,
    setCurrentView,
  };
};

export default useCalendarNavigation;