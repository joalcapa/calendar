import { eventRepository } from '../../repositories/eventRepository';
import BaseService from '../baseService';
import { Event } from '../../types/event';

/**
 * A service class for retrieving an event by its ID.
 * Inherits from BaseService to provide error handling functionality.
 */
export default class GetEvent extends BaseService {
  /** The ID of the event to be retrieved. */
  private id: number;

  /** The event object retrieved from the repository. */
  private event: Event | null;

  /**
   * Initializes a new instance of the GetEvent class.
   *
   * @param id - The ID of the event to retrieve.
   */
  constructor(id: number) {
    super();
    this.id = id;
    this.event = null;
  }

  /**
   * Retrieves the event with the specified ID.
   *
   * @returns A promise that resolves when the retrieval is complete.
   *          Sets an error message if the retrieval fails or if the event does not exist.
   */
  public async call(): Promise<void> {
    try {
      if (!this.id) {
        this.setError("El id es requerido");
        return;
      }

      this.event = await eventRepository.findById(this.id);
      if (!this.event) {
        this.setError('El evento no existe');
      }
    } catch {
      this.setError('Error al obtener el evento');
    }
  }

  /**
   * Gets the retrieved event.
   *
   * @returns The event object if found, or null if not.
   */
  public getEvent(): Event | null {
    return this.event;
  }
}
