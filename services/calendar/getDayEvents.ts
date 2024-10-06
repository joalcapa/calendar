import BaseService from '../baseService';
import { Event } from '../../types/event';
import { MonthEvents } from '../../types/month';
import { getDateFromNumberDay, getDayLabel } from '../../utils/utils';
import GetEvents from '../events/getEvents';

export default class GetDayEvents extends BaseService {
  private date: Date;
  private currentDate: Date;
  private events: MonthEvents | null;

  constructor(date: Date = new Date(), currentDate: Date | null) {
    super();
    this.date = date;
    this.currentDate = currentDate || this.date;
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
      this.setError('Error al obtener los eventos');
    }
  }

  private createEvents(events: Event[]): {
    startDayOfMonth: number;
    today: number;
    dayName: string;
    days: {
      isCurrent: boolean;
      dayDate: Date;
      isToday: boolean;
      day: number;
      isCurrentMonth: boolean;
      events: Event[]
    }[]
  } {
    const dayDate = getDateFromNumberDay(this.date, this.date.getDate());

    return {
      today: new Date().getDate(),
      dayName: getDayLabel(this.date),
      startDayOfMonth: new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay(),
      days: [
        {
          day: this.date.getDate(),
          isCurrent: dayDate.getDate() === this.currentDate.getDate(),
          isToday: (new Date().getDate() === (this.date.getDate())) && this.date.getMonth() === new Date().getMonth(),
          dayDate: dayDate,
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