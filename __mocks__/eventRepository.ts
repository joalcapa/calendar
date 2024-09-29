import { Event } from '@/types/event';

export const eventRepository = {
  findAll: jest.fn() as jest.Mock<Promise<Event[]>>,
  create: jest.fn() as jest.Mock<Promise<Event>>,
};