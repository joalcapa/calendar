import { eventRepository } from '../../repositories/eventRepository';
import BaseService from '../baseService';
import { Event, EventRequest } from '../../types/event';
import { DateTime } from 'luxon';
import GetWeather from "../../services/weather/getWeather";
import { formatDateYYYYMMDD } from '../../utils/utils';

/**
 * A service class for updating an event in the repository.
 * Inherits from BaseService to provide error handling functionality.
 */
export default class UpdateEvent extends BaseService {
  /** The event being updated. */
  private event: Event | null;

  /** The ID of the event to be updated. */
  private id: number;

  /** The parameters for the event update. */
  private params: EventRequest;

  /**
   * Initializes a new instance of the UpdateEvent class.
   *
   * @param id - The ID of the event to be updated.
   * @param params - The parameters containing the updated event data.
   */
  constructor(id: number, params: EventRequest) {
    super();
    this.id = id;
    this.event = null;
    this.params = params;
  }

  /**
   * Updates the event with the provided parameters.
   *
   * @returns A promise that resolves when the update is complete.
   *          Sets an error message if the ID is required, the event does not exist,
   *          or an error occurs during retrieval or update.
   */
  public async call(): Promise<void> {
    try {
      if (!this.id) {
        this.setError("El id es requerido");
        return;
      }

      this.event = await eventRepository.findById(this.id);
      if (!this.event) {
        this.setError('El evento no existe');
        return;
      }

      this.normalizeDates();

      if (!this.params.finish_date || !this.params.start_date) {
        this.setError("Ha ocurrido un error al actualizar el evento");
        return;
      }

      if (this.params.start_date && this.params.city) {
        const service = new GetWeather({ date: formatDateYYYYMMDD(this.params.start_date), location: this.params.city });
        await service.call();

        if (service.valid) {
          const weather = service.getWeather();
          this.params.weather = weather.condition;
          this.params.weather_url = weather.icon;
        }
      }

      await eventRepository.update(this.id, this.params);
      this.event = await eventRepository.findById(this.id);

      if (!this.event) {
        this.setError("El evento no existe");
      }
    } catch {
      this.setError('Error al obtener el evento');
    }
  }

  /**
   * Normalizes the start and finish dates in the event parameters.
   * Adjusts the time zones and formats the dates to ISO format.
   */
  private normalizeDates(): void {
    try {
      if (this.params.start_date) {
        this.params.start_date = DateTime.fromISO(this.params.start_date, { zone: 'UTC' })
            .toUTC()
            .toISO() ?? "";
      }

      if (this.params.finish_date) {
        this.params.finish_date = DateTime.fromISO(this.params.finish_date, { zone: 'UTC' })
            .toUTC()
            .toISO() ?? "";
      }

      if (this.params.is_all_day) {
        this.setAllDayDates();
      }
    } catch { }
  }

  /**
   * Sets the start and finish dates for all-day events.
   * Adjusts the start and finish times to the specified hours in the America/Bogota time zone.
   */
  private setAllDayDates(): void {
    const startDate = this.params.start_date || this.event?.start_date.toDateString();
    if (startDate) {
      let adjustedStartDate = DateTime.fromISO(startDate, { zone: 'UTC' })
          .setZone('America/Bogota')
          .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
          .toUTC() ?? "";

      const adjustedFinishDate = adjustedStartDate
          .set({ hour: 19, minute: 0, second: 0, millisecond: 0 })
          .setZone('America/Bogota')
          .toUTC() ?? "";

      adjustedStartDate = adjustedStartDate
          .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
          .setZone('America/Bogota')
          .toUTC() ?? "";

      this.params.finish_date = adjustedFinishDate.toISO() ?? "";
      this.params.start_date = adjustedStartDate.toISO() ?? "";
    }
  }

  /**
   * Gets the updated event after the call has been made.
   *
   * @returns The updated event or null if no event has been set.
   */
  public getEvent(): Event | null {
    return this.event;
  }
}

