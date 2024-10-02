import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addMonths, addWeeks, addDays, startOfToday, format } from 'date-fns';

type View = 'MONTH' | 'WEEK' | 'DAY';

export const MONTH = "MONTH";
export const WEEK = "WEEK";
export const DAY = "DAY";
export const ADD_COUNT = 1;
export const DIFF_COUNT = -1;

const useCalendarNavigation = () => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const dateParam = params.get('date');
    return dateParam ? new Date(dateParam) : startOfToday();
  });

  const [view, setView] = useState<View>(MONTH);
  const router = useRouter();

  const setCurrentDateHandler = useCallback((call: (prev: Date) => Date) => {
    setCurrentDate((prev) => {
      const newDate = call(prev);
      router.push(`/?date=${format(newDate, 'yyyy-MM-dd')}&type=${view.toLocaleLowerCase()}`);
      return newDate;
    });
  }, [view, router]);

  const onResetToday = () => {
    setCurrentDateHandler((prev) => startOfToday());
    setView(MONTH);
  };

  const onPrev = () => {
    if (view === MONTH) {
      setCurrentDateHandler((prev) => addMonths(prev, DIFF_COUNT));
    } else if (view === WEEK) {
      setCurrentDateHandler((prev) => addWeeks(prev, DIFF_COUNT));
    } else if (view === DAY) {
      setCurrentDateHandler((prev) => addDays(prev, DIFF_COUNT));
    }
  };

  const onNext = () => {
    if (view === MONTH) {
      setCurrentDateHandler((prev) => addMonths(prev, ADD_COUNT));
    } else if (view === WEEK) {
      setCurrentDateHandler((prev) => addWeeks(prev, ADD_COUNT));
    } else if (view === DAY) {
      setCurrentDateHandler((prev) => addDays(prev, ADD_COUNT));
    }
  };

  const setCurrentView = (newView: View) => {
    setView(newView);
  };

  const onMonth = useCallback(() => {
    setView(MONTH);
    router.push(`/?date=${format(currentDate, 'yyyy-MM-dd')}&type=month`);
  }, [currentDate]);

  const onWeek = useCallback(() => {
    setView(WEEK);
    router.push(`/?date=${format(currentDate, 'yyyy-MM-dd')}&type=week`);
  }, [currentDate]);

  const onDay = useCallback(() => {
    setView(DAY);
    router.push(`/?date=${format(currentDate, 'yyyy-MM-dd')}&type=day`);
  }, [currentDate]);

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