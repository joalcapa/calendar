import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import BaseService from '../baseService';

export default class CreateEvent extends BaseService {
  private data: Event;
  private event: Event | null;

  constructor(data: Event) {
    super();
    this.data = data;
    this.event = null;
  }

  public async call(): Promise<void> {
    if (!this.data.title) {
      this.setError('El título es requerido');
      return
    }

    if (!this.data.description) {
      this.setError('La descripción es requerida');
      return
    }

    if (!this.data.start_date) {
      this.setError('La Fecha de inicio es requerida');
      return
    }

    if (!this.data.is_all_day && !this.data.finish_date) {
      this.setError('La Fecha de culminación es requerida');
      return
    }

    const startDate = new Date(this.data.start_date);
    if (this.data.is_all_day) {
      startDate.setHours(0, 0, 0, 0);
      const finishDate = new Date(startDate);
      finishDate.setUTCHours(23, 59, 59, 999);
      this.data.finish_date = finishDate;
    } else {
      const finishDate = new Date(this.data.finish_date);
      this.data.finish_date = finishDate;
    }

    this.data.start_date = startDate;

    this.event = await eventRepository.create(this.data);
  }

  public getEvent(): Event | null {
    return this.event;
  }
}