import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { addMonths, addWeeks, addDays, startOfToday, format } from 'date-fns';

export type View = 'MONTH' | 'WEEK' | 'DAY';

export const MONTH = "MONTH";
export const WEEK = "WEEK";
export const DAY = "DAY";
export const ADD_COUNT = 1;
export const DIFF_COUNT = -1;
const DATE_FORMAT = 'yyyy-MM-dd';

const useCalendarNavigation = (props: { type: string | null }) => {
  const { type } = props;
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const [currentDate, setCurrentDate] = useState<Date>(() => {
    const dateParam = params.get('date');
    return dateParam ? new Date(dateParam) : startOfToday();
  });

  const [view, setView] = useState<View>(type ? (type.toUpperCase() as View) : MONTH);
  const router = useRouter();

  const setCurrentDateHandler = useCallback((call: (prev: Date) => Date) => {
    setCurrentDate((prev) => {
      const newDate = call(prev);

      const viewType = view.toLocaleLowerCase();
      router.push(`/${view !== MONTH ? viewType : ''}?date=${format(newDate, DATE_FORMAT)}&type=${viewType}`);

      return newDate;
    });
  }, [view, router]);

  const onResetToday = () => {
    setCurrentDateHandler((prev) => startOfToday());
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
    router.push(`/?date=${format(currentDate, DATE_FORMAT)}&type=${MONTH.toLocaleLowerCase()}`);
  }, [currentDate]);

  const onWeek = useCallback(() => {
    setView(WEEK);
    router.push(`/week?date=${format(currentDate, DATE_FORMAT)}&type=${WEEK.toLocaleLowerCase()}`);
  }, [currentDate]);

  const onDay = useCallback(() => {
    setView(DAY);
    router.push(`/day?date=${format(currentDate, DATE_FORMAT)}&type=${DAY.toLowerCase()}`);
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