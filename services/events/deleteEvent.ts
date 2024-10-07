import { eventRepository } from '../../repositories/eventRepository';
import BaseService from '../baseService';

/**
 * A service class for deleting an event.
 * Inherits from BaseService to provide error handling functionality.
 */
export default class DeleteEvent extends BaseService {
  /** The ID of the event to be deleted. */
  private id: number;

  /**
   * Initializes a new instance of the DeleteEvent class.
   *
   * @param id - The ID of the event to delete.
   */
  constructor(id: number) {
    super();
    this.id = id;
  }

  /**
   * Deletes the event with the specified ID.
   *
   * @returns A promise that resolves when the deletion is complete.
   *          Sets an error message if the deletion fails.
   */
  public async call(): Promise<void> {
    try {
      await eventRepository.deleteById(this.id);
    } catch {
      this.setError('Error al borrar el evento');
    }
  }
}
