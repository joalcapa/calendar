import { Event } from '@/types/event';

export const eventRepository = {
  findAll: jest.fn() as jest.Mock<Promise<Event[]>>,
};