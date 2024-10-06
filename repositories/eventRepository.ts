import db from '../libs/db';
import { Event, EventRequest } from '../types/event';

interface FindManyOptions {
  where: {
    start_date?: {
      gte?: Date;
      lte?: Date;
    };
  };
}

export const eventRepository = {
  findAll: async (): Promise<Event[]> => {
    return db.event.findMany();
  },
  findById: async (id: number): Promise<Event | null> => {
    return db.event.findUnique({ where: { id } });
  },
  create: async (data: EventRequest): Promise<Event> => {
    return db.event.create({ data });
  },
  deleteById: async (id: number): Promise<Event | null> => {
    return db.event.delete({ where: { id } });
  },
  update: async (id: number, data: EventRequest): Promise<Event | null> => {
    return db.event.update({ where: { id }, data });
  },
  findMany: async (where: FindManyOptions): Promise<Event[]> => {
    return db.event.findMany(where);
  },
};