import { eventRepository } from '../../repositories/eventRepository';
import BaseService from '../baseService';
import { Event } from '../../types/event';

export default class GetEvent extends BaseService {
  private id: number;
  private event: Event | null;

  constructor(id: number) {
    super();
    this.id = id;
    this.event = null;
  }

  public async call(): Promise<void> {
    try {
      if (!this.id) {
        this.setError("El id es requerido");
        return
      }

      this.event = await eventRepository.findById(this.id);
      if (!this.event) {
        this.setError('El evento no existe')
      }
    } catch (error) {
      this.setError('Error al obtener el evento');
    }
  }

  public getEvent(): Event | null {
    return this.event;
  }
}