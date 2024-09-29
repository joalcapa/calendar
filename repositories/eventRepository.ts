import db from '@/libs/db';
import { Event } from '@/types/event';

export const eventRepository = {
  findAll: async (): Promise<Event[]> => {
    return db.event.findMany();
  },
  findById: async (id: number): Promise<Event | null> => {
    return db.event.findUnique({ where: { id } });
  },
  create: async (data: Omit<Event, 'id'>): Promise<Event> => {
    return db.event.create({ data });
  },
  deleteById: async (id: number): Promise<Event | null> => {
    return db.event.delete({ where: { id } });
  },
  update: async (id: number, data: Event): Promise<Event | null> => {
    return db.event.update({ where: { id }, data });
  },
};