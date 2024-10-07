import db from '../libs/db';
import { Event, EventRequest } from '../types/event';

/**
 * Options for finding multiple events.
 */
interface FindManyOptions {
  where: {
    start_date?: {
      gte?: Date; // Greater than or equal to
      lte?: Date; // Less than or equal to
    };
  };
}

/**
 * Repository for managing event-related database operations.
 */
export const eventRepository = {
  /**
   * Retrieves all events from the database.
   *
   * @returns A promise that resolves to an array of Event objects.
   */
  findAll: async (): Promise<Event[]> => {
    return db.event.findMany();
  },

  /**
   * Retrieves a single event by its ID.
   *
   * @param id - The ID of the event to retrieve.
   * @returns A promise that resolves to the Event object or null if not found.
   */
  findById: async (id: number): Promise<Event | null> => {
    return db.event.findUnique({ where: { id } });
  },

  /**
   * Creates a new event in the database.
   *
   * @param data - The data for the event to create.
   * @returns A promise that resolves to the created Event object.
   */
  create: async (data: EventRequest): Promise<Event> => {
    return db.event.create({ data });
  },

  /**
   * Deletes an event by its ID.
   *
   * @param id - The ID of the event to delete.
   * @returns A promise that resolves to the deleted Event object or null if not found.
   */
  deleteById: async (id: number): Promise<Event | null> => {
    return db.event.delete({ where: { id } });
  },

  /**
   * Updates an existing event by its ID.
   *
   * @param id - The ID of the event to update.
   * @param data - The data to update the event with.
   * @returns A promise that resolves to the updated Event object or null if not found.
   */
  update: async (id: number, data: EventRequest): Promise<Event | null> => {
    return db.event.update({ where: { id }, data });
  },

  /**
   * Retrieves multiple events based on the specified criteria.
   *
   * @param where - The criteria for finding events.
   * @returns A promise that resolves to an array of Event objects.
   */
  findMany: async (where: FindManyOptions): Promise<Event[]> => {
    return db.event.findMany(where);
  },
};
