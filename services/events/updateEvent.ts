import { eventRepository } from '@/repositories/eventRepository';
import BaseService from '../baseService';
import { Event } from '@/types/event';

export default class UpdateEvent extends BaseService {
  private event: Event | null;

  constructor(private id: number, private params: Event) {
    super();
    this.event = null;
  }

  public async call(): Promise<void> {
    try {
      this.event = await eventRepository.findById(this.id);
      if (!this.event) {
        return this.setError('El evento no existe');
      }

      this.normalizeDates();

      this.event = await eventRepository.update(this.id, this.params);
    } catch (error) {
      this.setError('Error al obtener el evento');
    }
  }

  private normalizeDates(): void {
    if (this.params.start_date) {
      this.params.start_date = new Date(this.params.start_date);
    }

    if (this.params.finish_date) {
      this.params.finish_date = new Date(this.params.finish_date);
    }

    if (this.params.is_all_day) {
      this.setAllDayDates();
    }
  }

  private setAllDayDates(): void {
    const startDate = this.params.start_date || this.event?.start_date;
    if (startDate) {
      this.params.start_date = new Date(startDate);
      this.params.start_date.setHours(0, 0, 0, 0);

      const finishDate = new Date(this.params.start_date);
      finishDate.setUTCHours(23, 59, 59, 999);
      this.params.finish_date = finishDate;
    }
  }

  public getEvent(): Event | null {
    return this.event;
  }
}