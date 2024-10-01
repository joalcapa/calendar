import BaseService from '../baseService';
import { Event } from '@/types/event';
import { MonthEvents } from '@/types/month';
import GetEvents from '../events/getEvents';

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
        this.setError(
          service.error && service.error["message"] ?
            service.error["message"] :
            'Error al obtener los eventos'
        )
      }

      this.events = this.createMonthEvents(service.getEvents());
    } catch (error) {
      this.setError('Error al obtener los eventos');
    }
  }

  private createMonthEvents(events: Event[] | null): MonthEvents | null {
    if (!events) {
      return null;
    }

    console.log({
      today: this.date.getDate(),
      days: Array.from({ length: this.getDaysInMonth(this.date) }, (_, index) => ({
        day: index + 1,
        dayDate: this.getDate(this.date, index + 1),
        isCurrentMonth: true,
        events: this.getEventsFromDB(events, index),
      })),
    })
    return {
      today: this.date.getDate(),
      days: Array.from({ length: this.getDaysInMonth(this.date) }, (_, index) => ({
        day: index + 1,
        dayDate: this.getDate(this.date, index + 1),
        isCurrentMonth: true,
        events: this.getEventsFromDB(events, index + 1),
      })),
    }
  }

  private getDaysInMonth(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
  }

  private getEventsFromDB(events: Event[] | null, day: number): Event[] {
    if (!events) {
      return [];
    }

    return events.filter((event) => (event.start_date.getDate() === day))
  }

  private getDate(date: Date, i: number): Date {
    const newDate = new Date(date);
    newDate.setUTCDate(i);
    newDate.setUTCHours(7, 0, 0, 0);
    return newDate;
  }

  public getEvents(): MonthEvents | null {
    return this.events;
  }
}