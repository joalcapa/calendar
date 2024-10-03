import BaseService from '../baseService';
import GetEvents from '../events/getEvents';
import { Event } from '@/types/event';
import { MonthEvents, Day } from '@/types/month';
import {
  getDaysInMonth,
  getDateFromNumberDay,
  getEventsFromDay,
} from '@/utils/utils';

export default class GetMonthEvents extends BaseService {
  private date: Date;
  private events: MonthEvents | null;

  constructor(date: Date = new Date()) {
    super();
    this.date = date;
    this.events = null;
  }

  public async call(): Promise<void> {
    try {
      const service = new GetEvents({ date: this.date });
      await service.call();

      if (!service.valid) {
        this.setError(service.error);
      }

      this.events = this.createMonthEvents(service.getEvents());
    } catch(error) {
      if (error instanceof Error) {
        this.setError(error.message);
      } else {
        this.setError('Error desconocido');
      }
    }
  }

  private createMonthEvents(events: Event[]): MonthEvents {
    return {
      today: new Date().getDate(),
      startDayOfMonth: new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay(),
      days: Array.from({ length: getDaysInMonth(this.date) }, (_, index): Day => ({
        day: index + 1,
        isCurrent: false,
        isToday: (new Date().getDate() === (index + 1)) && this.date.getMonth() === new Date().getMonth(),
        dayDate: getDateFromNumberDay(this.date, index + 1),
        isCurrentMonth: true,
        events: getEventsFromDay(events, index + 1),
      })),
    }
  }

  public getEvents(): MonthEvents | null {
    return this.events;
  }
}