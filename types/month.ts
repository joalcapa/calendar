import { Event } from "@prisma/client";

export interface Day {
  day: number;
  dayDate: Date;
  isCurrentMonth: boolean;
  events: Event[];
  isCurrent: boolean;
  isToday: boolean;
}

export interface MonthEvents {
  today: number;
  days: Day[];
  startDayOfMonth: number;
}