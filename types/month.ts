import { Event } from "@prisma/client";

export interface Day {
  day: number;
  isCurrentMonth: boolean;
  events: Event[];
}

export interface MonthEvents {
  today: number;
  days: Day[];
}