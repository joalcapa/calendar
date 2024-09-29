import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';


export default async function getAllEvents(): Promise<Event[]> {
  return eventRepository.findAll();
}