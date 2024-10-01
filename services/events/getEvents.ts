import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import BaseService from '../baseService';

interface GeEventsParams {
  date?: Date;
}

export default class GetEvents extends BaseService {
  private events: Event[] | null;
  private date: Date | null;

  constructor(params: GeEventsParams) {
    super();
    this.events = null;
    this.date = params.date || null;
  }

  public async call(): Promise<void> {
    try {
      if (this.date) {
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

        return
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