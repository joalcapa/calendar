import { DateTime } from 'luxon';
import { eventRepository } from '../../repositories/eventRepository';
import { Event } from '../../types/event';
import BaseService from '../baseService';

const MONTH = "month";
const DAY = "day";
const WEEK = "week";

export interface GetEventsParams {
  date?: Date;
  queryType?: 'month' | 'day' | 'week';
}

export default class GetEvents extends BaseService {
  private events: Event[];
  private date: Date | null;
  private queryType: 'month' | 'day' | 'week';

  constructor(params: GetEventsParams) {
    super();
    this.events = [];
    this.date = params.date || null;
    this.queryType = params.queryType || MONTH;
  }

  public async call(): Promise<void> {
    try {
      if (this.queryType !== MONTH && this.queryType !== WEEK && this.queryType !== DAY) {
        this.setError("Tipo de busqueda no soportada")
        return
      }

      if (this.date) {
        const dt = DateTime.fromJSDate(this.date);

        if (this.queryType === 'month') {
          const startDate = dt.startOf('month').toJSDate();
          const endDate = dt.endOf('month').toJSDate();

          this.events = await eventRepository.findMany({
            where: {
              start_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });
        } else if (this.queryType === 'day') {
          const startDate = dt.startOf('day').toJSDate();
          const endDate = dt.endOf('day').toJSDate();

          this.events = await eventRepository.findMany({
            where: {
              start_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });
        } else if (this.queryType === 'week') {
          const startDate = dt.startOf('week').toJSDate();
          const endDate = dt.endOf('week').toJSDate();

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

      this.events = await eventRepository.findAll() || [];
    } catch (error) {
      if (error instanceof Error) {
        this.setError(error.message);
      } else {
        this.setError('Error desconocido');
      }
    }
  }

  public getEvents(): Event[] {
    return this.events;
  }
}
