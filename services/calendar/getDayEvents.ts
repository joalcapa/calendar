import BaseService from '../baseService';
import { Event } from '@/types/event';
import { MonthEvents } from '@/types/month';
import GetEvents from '../events/getEvents';
import { getDateFromNumberDay } from '@/utils/utils';

export default class GetDayEvents extends BaseService {
  private date: Date;
  private events: MonthEvents | null;

  constructor(date: Date = new Date()) {
    super();
    this.date = date;
    this.events = null;
  }

  public async call(): Promise<void> {
    try {
      const service = new GetEvents({ date: this.date, queryType: 'day' });
      await service.call();

      if (!service.valid) {
        this.setError(
          service.error && service.error["message"] ?
            service.error["message"] :
            'Error al obtener los eventos'
        )
      }

      this.events = this.createEvents(service.getEvents());
    } catch (error) {
      console.log("error: ---------------------------->", error.message)
      this.setError('Error al obtener los eventos');
    }
  }

  private createEvents(events: Event[]): {
    startDayOfMonth: number;
    today: number;
    days: {
      isCurrent: boolean;
      dayDate: Date;
      isToday: boolean;
      day: number;
      isCurrentMonth: boolean;
      events: Event[]
    }[]
  } {
    return {
      today: new Date().getDate(),
      startDayOfMonth: new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay(),
      days: [
        {
          day: this.date.getDate(),
          isCurrent: false,
          isToday: (new Date().getDate() === (this.date.getDate())) && this.date.getMonth() === new Date().getMonth(),
          dayDate: getDateFromNumberDay(this.date, this.date.getDate()),
          isCurrentMonth: true,
          events: events,
        }
      ],
    }
  }

  public getEvents(): MonthEvents | null {
    return this.events;
  }

  public getDateLabel(): string {
    return this.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}