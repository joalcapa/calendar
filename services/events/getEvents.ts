import { DateTime } from 'luxon';
import { eventRepository } from '../../repositories/eventRepository';
import { Event } from '../../types/event';
import BaseService from '../baseService';

// Constants for query types
const MONTH = "month";
const DAY = "day";
const WEEK = "week";

/**
 * Parameters for retrieving events.
 */
export interface GetEventsParams {
  /** The date to query events for. */
  date?: Date;
  /** The type of query: 'month', 'day', or 'week'. */
  queryType?: 'month' | 'day' | 'week';
}

/**
 * A service class for retrieving events based on a specified date and query type.
 * Inherits from BaseService to provide error handling functionality.
 */
export default class GetEvents extends BaseService {
  /** The list of retrieved events. */
  private events: Event[];

  /** The date used for querying events. */
  private date: Date | null;

  /** The type of query to perform. */
  private queryType: 'month' | 'day' | 'week';

  /**
   * Initializes a new instance of the GetEvents class.
   *
   * @param params - The parameters for retrieving events, including date and query type.
   */
  constructor(params: GetEventsParams) {
    super();
    this.events = [];
    this.date = params.date || null;
    this.queryType = params.queryType || MONTH;
  }

  /**
   * Retrieves events based on the specified date and query type.
   *
   * @returns A promise that resolves when the retrieval is complete.
   *          Sets an error message if the query type is unsupported, or if an error occurs during retrieval.
   */
  public async call(): Promise<void> {
    try {
      if (this.queryType !== MONTH && this.queryType !== WEEK && this.queryType !== DAY) {
        this.setError("Tipo de busqueda no soportada");
        return;
      }

      if (this.date) {
        const dt = DateTime.fromJSDate(this.date);

        if (this.queryType === 'month') {
          const startDate = dt.startOf('month').toJSDate();
          const endDate = dt.endOf('month').toJSDate();

          this.events = await eventRepository.findMany({
            where: {
              start_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });
        } else if (this.queryType === 'day') {
          const startDate = dt.startOf('day').toJSDate();
          const endDate = dt.endOf('day').toJSDate();

          this.events = await eventRepository.findMany({
            where: {
              start_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });
        } else if (this.queryType === 'week') {
          const startDate = dt.startOf('week').toJSDate();
          const endDate = dt.endOf('week').toJSDate();

          this.events = await eventRepository.findMany({
            where: {
              start_date: {
                gte: startDate,
                lte: endDate,
              },
            },
          });
        }

        return;
      }

      this.events = await eventRepository.findAll() || [];
    } catch (error) {
      if (error instanceof Error) {
        this.setError(error.message);
      } else {
        this.setError('Error desconocido');
      }
    }
  }

  /**
   * Gets the list of retrieved events.
   *
   * @returns An array of events retrieved from the repository.
   */
  public getEvents(): Event[] {
    return this.events;
  }
}

