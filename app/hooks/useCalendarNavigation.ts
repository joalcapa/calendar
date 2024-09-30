import { useState } from 'react';
import { addMonths, addWeeks, addDays, startOfToday } from 'date-fns';

type View = 'MONTH' | 'WEEK' | 'DAY';

const MONTH = "MONTH";
const WEEK = "WEEK";
const DAY = "DAY";
const ADD_COUNT = 1;
const DIFF_COUNT = -1;

const useCalendarNavigation = () => {
  const [currentDate, setCurrentDate] = useState<Date>(startOfToday());
  const [view, setView] = useState<View>(MONTH);

  const resetToToday = () => {
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

  return {
    currentDate,
    view,
    next,
    prev,
    setCurrentView,
    resetToToday,
  };
};

export default useCalendarNavigation;