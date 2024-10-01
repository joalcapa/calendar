import BaseService from '../baseService';
import { Event } from '@/types/event';
import GetEvents from '../events/getEvents';

interface Day {
  day: number;
  isCurrentMonth: boolean;
}

interface MonthEvents {
  today: number;
  days: Day[];
}

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

    return {
      today: this.date.getDate(),
      days: Array.from({ length: this.getDaysInMonth(this.date) }, (_, index) => ({
        day: index + 1,
        isCurrentMonth: true,
        events: this.getEventsFromDB(events, index),
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

  public getEvents(): MonthEvents | null {
    return this.events;
  }
}