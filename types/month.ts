import { Event } from "@prisma/client";

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
}