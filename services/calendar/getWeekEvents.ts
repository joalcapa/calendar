import BaseService from '../baseService';
import { DateTime } from 'luxon';
import { MonthEvents } from '../../types/month';
import GetDayEvents from '../calendar/getDayEvents';

/**
 * A service class for retrieving events for a specific week.
 * Inherits from BaseService to provide error handling functionality.
 */
export default class GetWeekEvents extends BaseService {
  /** The date used to determine the week for which events are to be retrieved. */
  private date: Date;

  /** The events retrieved for each day of the week. */
  private events: MonthEvents[];

  /**
   * Initializes a new instance of the GetWeekEvents class.
   *
   * @param date - The date used to determine the week (defaults to the current date).
   */
  constructor(date: Date = new Date()) {
    super();
    this.date = date;
    this.events = [];
  }

  /**
   * Retrieves events for the week that contains the specified date.
   *
   * @returns A promise that resolves when the retrieval is complete.
   *          Sets an error message if the event retrieval fails.
   */
  public async call(): Promise<void> {
    try {
      const dt = DateTime.fromJSDate(this.date);
      const dayOfWeek = dt.weekday % 7;
      const startOfWeek = dt.minus({ days: dayOfWeek });
      const eventsPromises = Array.from({ length: 7 }, (_, i) =>
          startOfWeek.plus({ days: i }).toJSDate()
      ).map(async (day) => {
        const service = new GetDayEvents(day, this.date);
        await service.call();
        return service.getEvents();
      });

      this.events = await Promise.all(eventsPromises);
    } catch {
      this.setError('Error al obtener los eventos');
    }
  }

  /**
   * Gets the events retrieved for the week.
   *
   * @returns An array of events for each day of the week or null if no events have been retrieved.
   */
  public getEvents(): MonthEvents[] | null {
    return this.events;
  }

  /**
   * Gets a formatted label for the date used to determine the week.
   *
   * @returns A string representing the date in the format: "day month year" in Spanish.
   */
  public getDateLabel(): string {
    return this.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
