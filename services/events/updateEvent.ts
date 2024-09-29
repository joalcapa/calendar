import { eventRepository } from '@/repositories/eventRepository';
import BaseService from '../baseService';
import { Event } from '@/types/event';

export default class UpdateEvent extends BaseService {
  private id: number;
  private event: Event | null;
  private params: Event;

  constructor(id: number, params: Event) {
    super();
    this.id = id;
    this.params = params;
    this.event = null;
  }

  public async call(): Promise<void> {
    try {
      this.event = await eventRepository.findById(this.id);

      if (!this.event) {
        this.setError('El evento no existe')
      }

      this.event = await eventRepository.update(this.id, this.params)
    } catch (error) {
      this.setError('Error al obtener el evento');
    }
  }

  public getEvent(): Event | null {
    return this.event;
  }
}