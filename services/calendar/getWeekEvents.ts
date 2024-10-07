import BaseService from '../baseService';
import { DateTime } from 'luxon';
import { MonthEvents } from '../../types/month';
import GetDayEvents from '../calendar/getDayEvents';

export default class GetWeekEvents extends BaseService {
  private date: Date;
  private events: MonthEvents[];

  constructor(date: Date = new Date()) {
    super();
    this.date = date;
    this.events = [];
  }

  public async call(): Promise<void> {
    try {
      const dt = DateTime.fromJSDate(this.date);
      const dayOfWeek = dt.weekday % 7;
      const startOfWeek = dt.minus({ days: dayOfWeek });
      const eventsPromises = Array.from({ length: 7 }, (_, i) =>
        startOfWeek.plus({ days: i }).toJSDate()
      ).map(async (day) => {
        const service = new GetDayEvents(day, this.date);
        await service.call();
        return service.getEvents();
      });

      this.events = await Promise.all(eventsPromises);

    } catch (error) {
      this.setError('Error al obtener los eventos');
    }
  }

  public getEvents(): MonthEvents[] | null {
    return this.events;
  }

  public getDateLabel(): string {
    return this.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}