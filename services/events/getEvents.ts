import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import BaseService from '../baseService';

export default class GetEvents extends BaseService {
  private events: Event[] | null;

  constructor() {
    super();
    this.events = null;
  }

  public async call(): Promise<void> {
    try {
      this.events = await eventRepository.findAll();
    } catch (error) {
      this.setError('Error al obtener los eventos');
    }
  }

  public getEvents(): Event[] | null {
    return this.events;
  }
}