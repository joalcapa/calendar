import BaseService from '../baseService';
import { Event } from '../../types/event';
import { MonthEvents } from '../../types/month';
import { getDateFromNumberDay, getDayLabel } from '../../utils/utils';
import GetEvents from '../events/getEvents';

/**
 * A service class for retrieving events for a specific day.
 * Inherits from BaseService to provide error handling functionality.
 */
export default class GetDayEvents extends BaseService {
  /** The date for which events are to be retrieved. */
  private date: Date;

  /** The current date for comparison and reference. */
  private currentDate: Date;

  /** The events retrieved for the specified date. */
  private events: MonthEvents | null;

  /**
   * Initializes a new instance of the GetDayEvents class.
   *
   * @param date - The date for which to retrieve events (defaults to today).
   * @param currentDate - The current date to compare against (optional).
   */
  constructor(date: Date = new Date(), currentDate: Date | null) {
    super();
    this.date = date;
    this.currentDate = currentDate || this.date;
    this.events = null;
  }

  /**
   * Retrieves events for the specified date.
   *
   * @returns A promise that resolves when the retrieval is complete.
   *          Sets an error message if the event retrieval fails.
   */
  public async call(): Promise<void> {
    try {
      const service = new GetEvents({ date: this.date, queryType: 'day' });
      await service.call();

      if (!service.valid) {
        this.setError(
            service.error && service.error["message"] ?
                service.error["message"] :
                'Error al obtener los eventos'
        );
      }

      this.events = this.createEvents(service.getEvents());
    } catch {
      this.setError('Error al obtener los eventos');
    }
  }

  /**
   * Creates a structured representation of the events for the specified date.
   *
   * @param events - The list of events to be organized.
   * @returns An object containing details about the day, including the day name,
   *          start day of the month, and the list of events for the day.
   */
  private createEvents(events: Event[]): {
    startDayOfMonth: number;
    today: number;
    dayName: string;
    days: {
      isCurrent: boolean;
      dayDate: Date;
      isToday: boolean;
      day: number;
      isCurrentMonth: boolean;
      events: Event[];
    }[];
  } {
    const dayDate = getDateFromNumberDay(this.date, this.date.getDate());

    return {
      today: new Date().getDate(),
      dayName: getDayLabel(this.date),
      startDayOfMonth: new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay(),
      days: [
        {
          day: this.date.getDate(),
          isCurrent: dayDate.getDate() === this.currentDate.getDate(),
          isToday: (new Date().getDate() === this.date.getDate()) && this.date.getMonth() === new Date().getMonth(),
          dayDate: dayDate,
          isCurrentMonth: true,
          events: events,
        }
      ],
    };
  }

  /**
   * Gets the events retrieved for the specified date.
   *
   * @returns The events for the specified date or null if no events have been retrieved.
   */
  public getEvents(): MonthEvents | null {
    return this.events;
  }

  /**
   * Gets the formatted date label for the specified date.
   *
   * @returns A string representing the date in a long format (e.g., "1 de enero de 2024").
   */
  public getDateLabel(): string {
    return this.date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}
