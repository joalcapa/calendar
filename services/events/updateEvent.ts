import { eventRepository } from '@/repositories/eventRepository';
import BaseService from '../baseService';
import { Event } from '@/types/event';
import { DateTime } from 'luxon';

export default class UpdateEvent extends BaseService {
  private event: Event | null;

  constructor(private id: number, private params: Event) {
    super();
    this.event = null;
    this.params = params;
  }

  public async call(): Promise<void> {
    try {
      // Buscar el evento existente
      console.log("vamos")
      this.event = await eventRepository.findById(this.id);
      console.log("pasamos esto")
      if (!this.event) {
        return this.setError('El evento no existe');
      }

      // Normalizar las fechas
      this.normalizeDates();

      // Actualizar el evento
      this.event = await eventRepository.update(this.id, this.params);
    } catch (error) {
      console.log("ere: ", error)
      this.setError('Error al obtener el evento');
    }
  }

  private normalizeDates(): void {
    try {
      // Normalizar start_date
      console.log(this.params)
      if (this.params.start_date) {
        this.params.start_date = DateTime.fromISO(this.params.start_date, { zone: 'UTC' }).toUTC().toISO();
      }

      console.log("paso 1")
      // Normalizar finish_date
      if (this.params.finish_date) {
        this.params.finish_date = DateTime.fromISO(this.params.finish_date, { zone: 'UTC' }).toUTC().toISO();
      }

      // Si es un evento de todo el día
      if (this.params.is_all_day) {
        this.setAllDayDates();
      }
    } catch (error) {
      console.log(error)
    }
  }

  private setAllDayDates(): void {
    // Usar la fecha de inicio (start_date) si está disponible o la del evento original
    const startDate = this.params.start_date || this.event?.start_date;
    if (startDate) {
      // Convertir la fecha de inicio en UTC y ajustarla a 7:00 AM hora de Colombia
      const adjustedStartDate = DateTime.fromISO(startDate, { zone: 'UTC' })
        .setZone('America/Bogota')
        .set({ hour: 7, minute: 0, second: 0, millisecond: 0 })
        .toUTC();
      this.params.start_date = adjustedStartDate.toISO();

      // Configurar la fecha de finalización para las 7:00 PM hora de Colombia
      const adjustedFinishDate = adjustedStartDate
        .set({ hour: 19, minute: 0, second: 0, millisecond: 0 })
        .setZone('America/Bogota')
        .toUTC();
      this.params.finish_date = adjustedFinishDate.toISO();
    }
  }

  public getEvent(): Event | null {
    return this.event;
  }
}
