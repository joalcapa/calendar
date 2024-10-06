import { Event } from "../types/event";

export interface Day {
  day: number;
  isCurrent: boolean;
  isToday: boolean;
  dayDate: Date;
  isCurrentMonth: boolean;
  events: Event[];
}

export interface MonthEvents {
  today: number;
  startDayOfMonth: number;
  monthName: string;
  days: Day[];
  isHours?: boolean;
  dayName: string;
  dayNumber?: number;
  isSmallHour?: boolean;
}