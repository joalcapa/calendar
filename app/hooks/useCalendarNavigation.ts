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
  const { replace } = useRouter();

  const setCurrentDateHandler = useCallback((call: (prev: Date) => Date) => {
    setCurrentDate((prev) => {
      const newDate = call(prev);

      const viewType = view.toLocaleLowerCase();
      replace(`/${view !== MONTH ? viewType : ''}?date=${format(newDate, DATE_FORMAT)}&type=${viewType}`);

      return newDate;
    });
  }, [replace, view]);


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
    replace(`/?date=${format(currentDate, DATE_FORMAT)}&type=${MONTH.toLocaleLowerCase()}`);
  }, [replace, currentDate]);

  const onWeek = useCallback(() => {
    setView(WEEK);
    replace(`/week?date=${format(currentDate, DATE_FORMAT)}&type=${WEEK.toLocaleLowerCase()}`);
  }, [replace, currentDate]);

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