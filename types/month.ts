import { Event } from "@prisma/client";

export interface Day {
  day: number;
  dayDate: Date;
  isCurrentMonth: boolean;
  events: Event[];
}

export interface MonthEvents {
  today: number;
  days: Day[];
}