import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import BaseService from '../baseService';

interface GetEventsParams {
  date?: Date;
  queryType?: 'month' | 'day';
}

export default class GetEvents extends BaseService {
  private events: Event[] | null;
  private date: Date | null;
  private queryType: 'month' | 'day';

  constructor(params: GetEventsParams) {
    super();
    this.events = null;
    this.date = params.date || null;
    this.queryType = params.queryType || 'month';
  }

  public async call(): Promise<void> {
    try {
      if (this.date) {
        if (this.queryType === 'month') {
          const year = this.date.getFullYear();
          const month = this.date.getMonth() + 1;

          const startDate = new Date(year, month - 1, 1);
          const endDate = new Date(year, month, 0);

          this.events = await eventRepository.findMany({
            where: {
              start_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });
        } else if (this.queryType === 'day') {
          const startDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
          const endDate = new Date(startDate);
          endDate.setHours(23, 59, 59, 999);

          this.events = await eventRepository.findMany({
            where: {
              start_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });
        }

        return;
      }

      this.events = await eventRepository.findAll();
    } catch (error) {
      this.setError('Error al obtener los eventos');
    }
  }

  public getEvents(): Event[] | null {
    return this.events;
  }
}
