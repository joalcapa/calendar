import { eventRepository } from '../../repositories/eventRepository';
import BaseService from '../baseService';
import { Event, EventRequest } from '../../types/event';
import { DateTime } from 'luxon';
import GetWeather from "../../services/weather/getWeather";
import { formatDateYYYYMMDD } from '../../utils/utils';

const setDateTimeLocalValue = (date) => {
  const offset = date.getTimezoneOffset(); // Obtén el desplazamiento en minutos
  const localDate = new Date(date.getTime() - offset * 60000); // Ajusta la fecha a la hora local
  return localDate.toISOString().slice(0, 16); // Formato correcto para input
};

/**
 * A service class for updating an event in the repository.
 * Inherits from BaseService to provide error handling functionality.
 */
export default class UpdateEvent extends BaseService {
  /** The event being updated. */
  private event: Event | null;

  /** The ID of the event to be updated. */
  private id: number;

  /** The parameters for the event update. */
  private params: EventRequest;

  /**
   * Initializes a new instance of the UpdateEvent class.
   *
   * @param id - The ID of the event to be updated.
   * @param params - The parameters containing the updated event data.
   */
  constructor(id: number, params: EventRequest) {
    super();
    this.id = id;
    this.event = null;
    this.params = params;
  }

  /**
   * Updates the event with the provided parameters.
   *
   * @returns A promise that resolves when the update is complete.
   *          Sets an error message if the ID is required, the event does not exist,
   *          or an error occurs during retrieval or update.
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
        return;
      }

      if (!this.params.finish_date || !this.params.start_date) {
        this.setError("Ha ocurrido un error al actualizar el evento");
        return;
      }

      if (this.params.start_date && this.params.city) {
        const service = new GetWeather({ date: formatDateYYYYMMDD(this.params.start_date), location: this.params.city });
        await service.call();

        if (service.valid) {
          const weather = service.getWeather();
          this.params.weather = weather.condition;
          this.params.weather_url = weather.icon;
        }
      }

      this.params.start_date = DateTime.fromISO(this.params.start_date).toUTC().toISO({ suppressMilliseconds: false });
      this.params.finish_date = DateTime.fromISO(this.params.finish_date).toUTC().toISO({ suppressMilliseconds: false });

      await eventRepository.update(this.id, this.params);
      this.event = await eventRepository.findById(this.id);

      if (!this.event) {
        this.setError("El evento no existe");
      }
    } catch {
      this.setError('Error al obtener el evento');
    }
  }

  /**
   * Gets the updated event after the call has been made.
   *
   * @returns The updated event or null if no event has been set.
   */
  public getEvent(): Event | null {
    return this.event;
  }
}

