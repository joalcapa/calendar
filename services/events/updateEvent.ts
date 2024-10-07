import { eventRepository } from '../../repositories/eventRepository';
import BaseService from '../baseService';
import { Event, EventRequest } from '../../types/event';
import { DateTime } from 'luxon';
import GetWeather from "../../services/weather/getWeather";
import { formatDateYYYYMMDD } from '../../utils/utils';

export default class UpdateEvent extends BaseService {
  private event: Event | null;
  private id: number;
  private params: EventRequest;

  constructor(id: number, params: EventRequest) {
    super();
    this.id = id;
    this.event = null;
    this.params = params;
  }

  public async call(): Promise<void> {
    try {
      if (!this.id) {
        this.setError("El id es requerido");
        return
      }

      this.event = await eventRepository.findById(this.id);
      if (!this.event) {
        this.setError('El evento no existe');
        return
      }

      this.normalizeDates();

      if (!this.params.finish_date || !this.params.start_date) {
        this.setError("Ha ocurrido un error al actualizar el evento")
        return
      }

      if (this.params.start_date && this.params.city) {
        const service = new GetWeather({ date: formatDateYYYYMMDD(this.params.start_date), location: this.params.city });
        await service.call();

        if (service.valid) {
          const weater = service.getWeather();
          this.params.weather = weater.condition;
          this.params.weather_url = weater.icon;
        }
      }

      await eventRepository.update(this.id, this.params);
      this.event = await eventRepository.findById(this.id);

      if (!this.event) {
        this.setError("El evento no existe")
      }
    } catch {
      this.setError('Error al obtener el evento');
    }
  }

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

  public getEvent(): Event | null {
    return this.event;
  }
}
