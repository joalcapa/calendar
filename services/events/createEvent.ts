import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import BaseService from '../baseService';
import { DateTime } from 'luxon';

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
      return;
    }

    if (!this.data.description) {
      this.setError('La descripción es requerida');
      return;
    }

    if (!this.data.start_date) {
      this.setError('La Fecha de inicio es requerida');
      return;
    }

    if (!this.data.is_all_day && !this.data.finish_date) {
      this.setError('La Fecha de culminación es requerida');
      return;
    }

    let startDate = DateTime.fromISO(this.data.start_date, { zone: 'UTC' });

    if (this.data.is_all_day) {
      startDate = startDate.setZone('America/Bogota').set({ hour: 7, minute: 0, second: 0, millisecond: 0 }).toUTC();

      let finishDate = startDate.set({ hour: 19, minute: 0, second: 0, millisecond: 0 }).setZone('America/Bogota').toUTC();
      this.data.finish_date = finishDate.toISO();

      startDate = startDate.set({ hour: 7, minute: 0, second: 0, millisecond: 0 }).setZone('America/Bogota').toUTC();
      this.data.start_date = startDate.toISO();
    } else {
      startDate = startDate.set({ second: 0, millisecond: 0 }).toUTC();
      this.data.start_date = startDate.toISO();

      let finishDate = DateTime.fromISO(this.data.finish_date, { zone: 'UTC' });
      // Mantener los minutos originales del finishDate
      finishDate = finishDate.set({ second: 0, millisecond: 0 }).toUTC();
      this.data.finish_date = finishDate.toISO();
    }

    // Guardar el evento en la base de datos
    this.event = await eventRepository.create(this.data);
  }

  public getEvent(): Event | null {
    return this.event;
  }
}

