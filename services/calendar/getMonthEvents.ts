import BaseService from '../baseService';
import GetEvents from '../events/getEvents';
import { Event } from '../../types/event';
import { MonthEvents } from '../../types/month';
import {
  getDaysInMonth,
  getDateFromNumberDay,
  getEventsFromDay,
  getMonthAndYearFromDate,
} from '../../utils/utils';

/**
 * A service class for retrieving events for a specific month.
 * Inherits from BaseService to provide error handling functionality.
 */
export default class GetMonthEvents extends BaseService {
  /** The date for which events are to be retrieved. */
  private date: Date;

  /** The events retrieved for the specified month. */
  private events: MonthEvents | null;

  /**
   * Initializes a new instance of the GetMonthEvents class.
   *
   * @param date - The date for which to retrieve events (defaults to the current date).
   */
  constructor(date: Date = new Date()) {
    super();
    this.date = date;
    this.events = null;
  }

  /**
   * Retrieves events for the specified month.
   *
   * @returns A promise that resolves when the retrieval is complete.
   *          Sets an error message if the event retrieval fails.
   */
  public async call(): Promise<void> {
    try {
      const service = new GetEvents({ date: this.date });
      await service.call();

      if (!service.valid) {
        this.setError(service.error);
      }

      this.events = this.createMonthEvents(service.getEvents());
    } catch (error) {
      if (error instanceof Error) {
        this.setError(error.message);
      } else {
        this.setError('Error desconocido');
      }
    }
  }

  /**
   * Creates a structured representation of the events for the specified month.
   *
   * @param events - The list of events to be organized.
   * @returns An object containing details about the month, including the month name,
   *          start day of the month, and a list of events for each day.
   */
  private createMonthEvents(events: Event[]): {
    startDayOfMonth: number;
    today: number;
    monthName: string;
    days: {
      isCurrent: boolean;
      dayDate: Date;
      isToday: boolean;
      day: number;
      isCurrentMonth: boolean;
      events: Event[];
    }[];
  } {
    return {
      today: new Date().getDate(),
      monthName: getMonthAndYearFromDate(this.date),
      startDayOfMonth: new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay(),
      days: Array.from({ length: getDaysInMonth(this.date) }, (_, index): {
        isCurrent: boolean;
        dayDate: Date;
        isToday: boolean;
        day: number;
        isCurrentMonth: boolean;
        events: Event[];
      } => ({
        day: index + 1,
        isCurrent: this.date.getDate() === index + 1,
        isToday: (new Date().getDate() === (index + 1)) && this.date.getMonth() === new Date().getMonth() && this.date.getFullYear() === new Date().getFullYear(),
        dayDate: getDateFromNumberDay(this.date, index + 1),
        isCurrentMonth: true,
        events: getEventsFromDay(events, index + 1),
      })),
    };
  }

  /**
   * Gets the events retrieved for the specified month.
   *
   * @returns The events for the specified month or null if no events have been retrieved.
   */
  public getEvents(): MonthEvents | null {
    return this.events ? { ...this.events } : null;
  }
}
