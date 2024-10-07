import { Event } from '@/types/event';

export const eventRepository = {
  findAll: jest.fn() as jest.Mock<Promise<Event[]>>,
  create: jest.fn() as jest.Mock<Promise<Event>>,
  deleteById: jest.fn() as jest.Mock<Promise<void>>,
  findById: jest.fn() as jest.Mock<Promise<Event>>,
  update: jest.fn() as jest.Mock<Promise<Event>>,
  findMany: jest.fn() as jest.Mock<Promise<Event[]>>,
};