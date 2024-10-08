import CreateEvent from '@/services/events/createEvent';
import { eventRepository } from '@/repositories/eventRepository';
import { Event, EventRequest } from '@/types/event';
import { mockRequestData } from '../../../__mocks__/eventRequest';
import { mockEvents } from '../../../__mocks__/eventData';

jest.mock('@/repositories/eventRepository', () => ({
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('CreateEvent', () => {
  let createMock: jest.Mock<Promise<Event>>;

  beforeEach(() => {
    createMock = eventRepository.create as unknown as jest.Mock<Promise<Event>>;
    jest.clearAllMocks();
  });

  describe('Invalid params', () => {
    it('should return error, title is required', async () => {
      const service = new CreateEvent({} as EventRequest);
      await service.call();

      expect(service.valid).toBe(false);
      expect(service.error).toBe("El título es requerido")
    });

    it('should return error, city is required', async () => {
      const service = new CreateEvent({
        title: mockRequestData[0].title,
      } as EventRequest);
      await service.call();

      expect(service.valid).toBe(false);
      expect(service.error).toBe("La ciudad es requerido")
    });

    it('should return error, description is required', async () => {
      const eventToCreated = mockRequestData[0];

      const service = new CreateEvent({
        title: eventToCreated.title,
        city: eventToCreated.city,
        weather: eventToCreated.weather,
        weather_url: eventToCreated.weather_url,
      } as EventRequest);
      await service.call();

      expect(service.valid).toBe(false);
      expect(service.error).toBe("La descripción es requerida")
    });

    it('should return error, start_date is required', async () => {
      const eventToCreated = mockRequestData[0];

      const service = new CreateEvent({
        title: eventToCreated.title,
        city: eventToCreated.city,
        weather: eventToCreated.weather,
        weather_url: eventToCreated.weather_url,
        description: eventToCreated.description,
      } as EventRequest);
      await service.call();

      expect(service.valid).toBe(false);
      expect(service.error).toBe("La Fecha de inicio es requerida")
    });

    it('should return error, finish_date is required', async () => {
      const eventToCreated = mockRequestData[0];

      const service = new CreateEvent({
        title: eventToCreated.title,
        city: eventToCreated.city,
        weather: eventToCreated.weather,
        weather_url: eventToCreated.weather_url,
        description: eventToCreated.description,
        start_date: eventToCreated.start_date,
      } as EventRequest);
      await service.call();

      expect(service.valid).toBe(false);
      expect(service.error).toBe("La Fecha de culminación es requerida")
    });

    it('should return error, finish_date is required', async () => {
      const eventToCreated = mockRequestData[0];

      const service = new CreateEvent({
        title: eventToCreated.title,
        city: eventToCreated.city,
        weather: eventToCreated.weather,
        weather_url: eventToCreated.weather_url,
        description: eventToCreated.description,
        start_date: eventToCreated.start_date,
        is_all_day: false,
      } as EventRequest);
      await service.call();

      expect(service.valid).toBe(false);
      expect(service.error).toBe("La Fecha de culminación es requerida")
    });
  });

  describe('Success Cases', () => {
    it('should create an event with valid data', async () => {
      const eventToCreated = mockEvents[0];
      createMock.mockResolvedValue(eventToCreated);

      const service = new CreateEvent(mockRequestData[0]);
      await service.call();

      expect(service.valid).toBe(true);

      const event = service.getEvent();
      expect(event?.id).toBe(eventToCreated.id);
      expect(event?.title).toBe(eventToCreated.title);
      expect(event?.description).toBe(eventToCreated.description);
      expect(event?.start_date).toBe(eventToCreated.start_date);
      expect(event?.finish_date).toBe(eventToCreated.finish_date);
      expect(event?.is_all_day).toBe(eventToCreated.is_all_day);
      expect(event?.city).toBe(eventToCreated.city);
      expect(event?.weather).toBe(eventToCreated.weather);
      expect(event?.weather_url).toBe(eventToCreated.weather_url);
      expect(event?.created_at).toBe(eventToCreated.created_at);
      expect(event?.updated_at).toBe(eventToCreated.updated_at);

      expect(createMock).toHaveBeenCalled();
    });
  });
});