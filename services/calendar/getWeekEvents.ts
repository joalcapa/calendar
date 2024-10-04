import BaseService from '../baseService';
import { DateTime } from 'luxon';
import { MonthEvents } from '../../types/month';
import GetDayEvents from '../calendar/getDayEvents';

export default class GetWeekEvents extends BaseService {
  private date: Date;
  private events: MonthEvents[];

  constructor(date: Date = new Date()) {
    super();
    this.date = date;
    this.events = [];
  }

  public async call(): Promise<void> {
    try {
      const dt = DateTime.fromJSDate(this.date);

      // Obtener el día de la semana (0 = Domingo, 1 = Lunes, ..., 6 = Sábado)
      const dayOfWeek = dt.weekday % 7; // Ajustar para que Domingo sea 0

      // Calcular el domingo anterior o actual restando los días necesarios
      const startOfWeek = dt.minus({ days: dayOfWeek });

      // Usar map para generar el array de eventos
      const eventsPromises = Array.from({ length: 7 }, (_, i) =>
        startOfWeek.plus({ days: i }).toJSDate()
      ).map(async (day) => {
        const service = new GetDayEvents(day);
        await service.call();
        return service.getEvents();
      });

      // Esperar a que todas las promesas se resuelvan
      this.events = await Promise.all(eventsPromises);

    } catch (error) {
      this.setError('Error al obtener los eventos');
    }
  }

  public getEvents(): MonthEvents[] | null {
    return this.events;
  }

  public getDateLabel(): string {
    return this.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}