import CreateEvent from '@/services/events/createEvent';
import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import { mockEvents } from '../../../__mocks__/eventData';

jest.mock('@/repositories/eventRepository', () => ({
  eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('CreateEvent', () => {
  let createMock: jest.Mock<Promise<Event>>;

  beforeEach(() => {
    createMock = eventRepository.create as unknown as jest.Mock<Promise<Event>>;
    jest.clearAllMocks();
  });

  describe('Success Cases', () => {
    it('should create an event with valid data', async () => {
      createMock.mockResolvedValue(mockEvents[0]);

      const service = new CreateEvent(mockEvents[0]);
      await service.call();

      expect(service.valid).toBe(true)
      expect(service.getEvent()).toEqual(mockEvents[0]);
      expect(createMock).toHaveBeenCalled();
    });

    it('should create an event with valid data and all day', async () => {
      createMock.mockResolvedValue(mockEvents[0]);

      const service = new CreateEvent(
        {
          title: 'Test title',
          description: 'Test description',
          start_date: "1990-15-05",
          is_all_day: true,
        } as any
      );

      await service.call();

      expect(service.valid).toBe(true)
      expect(service.getEvent()).toEqual(mockEvents[0]);
      expect(createMock).toHaveBeenCalled();
    });
  });

  describe('Error Cases', () => {
    it('should throw an error if title is missing', async () => {
      const data = {};

      const service = new CreateEvent(data as any);
      await service.call();

      expect(service.valid).toBe(false)
      const error: { message: string } | null = service.error;
      expect((error || { message: '' }).message).toBe("El título es requerido")

      expect(createMock).not.toHaveBeenCalled();
    });

    it('should throw an error if description is missing', async () => {
      const data = { title: 'Test title' };

      const service = new CreateEvent(data as any);
      await service.call();

      expect(service.valid).toBe(false)
      const error: { message: string } | null = service.error;
      expect((error || { message: '' }).message).toBe("La descripción es requerida")
    });

    it('should throw an error if start_date is missing', async () => {
      const data = { title: 'Test title', description: 'Test description' };

      const service = new CreateEvent(data as any);
      await service.call();

      expect(service.valid).toBe(false)
      const error: { message: string } | null = service.error;
      expect((error || { message: '' }).message).toBe("La Fecha de inicio es requerida")
    });

    it('should throw an error if finish_date is missing', async () => {
      const data = { title: 'Test title', description: 'Test description', start_date: "1990-15-05" };

      const service = new CreateEvent(data as any);
      await service.call();

      expect(service.valid).toBe(false)
      const error: { message: string } | null = service.error;
      expect((error || { message: '' }).message).toBe("La Fecha de culminación es requerida")
    });
  });
});