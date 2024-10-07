import { eventRepository } from '../../repositories/eventRepository';
import { EventRequest, Event } from '../../types/event';
import { DateTime } from 'luxon';
import BaseService from '../baseService';

/**
 * A service class for creating an event.
 * Inherits from BaseService to provide error handling functionality.
 */
export default class CreateEvent extends BaseService {
  /** The event request data. */
  private data: EventRequest;

  /** The created event, if successful. */
  private event: Event | null;

  /**
   * Initializes a new instance of the CreateEvent class.
   *
   * @param data - The event request data.
   */
  constructor(data: EventRequest) {
    super();
    this.data = data;
    this.event = null;
  }

  /**
   * Validates the event request data and creates the event.
   *
   * @returns A promise that resolves when the event creation is complete.
   */
  public async call(): Promise<void> {
    try {
      if (!this.data.title) {
        this.setError('El título es requerido');
        return;
      }

      if (!this.data.city) {
        this.setError('La ciudad es requerido');
        return;
      }

      if (!this.data.weather) {
        this.setError('El clima es requerido');
        return;
      }

      if (!this.data.weather_url) {
        this.setError('El clima es requerido');
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
        startDate = startDate
            .setZone('America/Bogota')
            .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
            .toUTC();

        const finishDate = startDate
            .set({ hour: 19, minute: 0, second: 0, millisecond: 0 })
            .setZone('America/Bogota')
            .toUTC();

        startDate = startDate
            .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
            .setZone('America/Bogota')
            .toUTC();

        this.data.start_date = startDate.toISO() ?? "";
        this.data.finish_date = finishDate.toISO() ?? "";
      } else {
        startDate = startDate
            .set({ second: 0, millisecond: 0 })
            .toUTC();

        const finishDate = DateTime.fromISO(this.data.finish_date, { zone: 'UTC' })
            .set({ second: 0, millisecond: 0 })
            .toUTC();

        this.data.start_date = startDate.toISO() ?? "";
        this.data.finish_date = finishDate.toISO() ?? "";
      }

      if (!this.data.start_date || !this.data.finish_date) {
        this.setError("Ha ocurrido un error en la creación del evento, por favor intente más tarde");
        return
      }

      this.event = await eventRepository.create(this.data) as Event;
      if (!this.event) {
        this.setError("Ha ocurrido un error en la creación del evento, por favor intente más tarde");
      }
    } catch {
      this.setError("Ha ocurrido un error en la creación del evento, por favor intente más tarde");
    }
  }

  /**
   * Gets the created event.
   *
   * @returns The created event or null if creation failed.
   */
  public getEvent(): Event | null {
    return this.event;
  }
}

