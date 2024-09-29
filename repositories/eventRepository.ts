import db from '@/libs/db';
import { Event } from '@prisma/client';

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
};