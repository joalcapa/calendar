import { eventRepository } from '@/repositories/eventRepository';
import BaseService from '../baseService';

export default class DeleteEvent extends BaseService {
  private id: number;

  constructor(id: number) {
    super();
    this.id = id;
  }

  public async call(): Promise<void> {
    try {
      await eventRepository.deleteById(this.id);
    } catch (error) {
      this.setError('Error al borrar el evento');
    }
  }
}