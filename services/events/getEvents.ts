import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@prisma/client';

export default async function getAllEvents(): Promise<Event[]> {
  return eventRepository.findAll();
}