import { Event } from "../types/event";

/**
 * Represents a day in the calendar, including its properties and associated events.
 */
export interface Day {
  /** The day of the month (1-31). */
  day: number;

  /** Indicates if the day is the current day. */
  isCurrent: boolean;

  /** Indicates if the day is today. */
  isToday: boolean;

  /** The date object representing the specific day. */
  dayDate: Date;

  /** Indicates if the day belongs to the current month. */
  isCurrentMonth: boolean;

  /** An array of events occurring on this day. */
  events: Event[];
}

/**
 * Represents the events and details for a month in the calendar.
 */
export interface MonthEvents {
  /** The day of the month that is today (1-31). */
  today: number;

  /** The starting day of the month (usually 1). */
  startDayOfMonth: number;

  /** The name of the month (e.g., "January"). */
  monthName: string;

  /** An array of days in the month. */
  days: Day[];

  /** Indicates if hour information is available (optional). */
  isHours?: boolean;

  /** The name of the day (e.g., "Monday"). */
  dayName: string;

  /** The number of the day (optional). */
  dayNumber?: number;

  /** Indicates if the hour information is displayed in a small format (optional). */
  isSmallHour?: boolean;
}
