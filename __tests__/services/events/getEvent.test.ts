import GetEvent from '@/services/events/getEvent';
import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import { mockEvents } from '../../../__mocks__/eventData';

jest.mock('@/repositories/eventRepository', () => ({
  eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('GetEvent', () => {
  let findByIdMock: jest.Mock<Promise<Event | null>>;

  beforeEach(() => {
    findByIdMock = eventRepository.findById as unknown as jest.Mock<Promise<Event | null>>;
    jest.clearAllMocks();
  });

  it('should get event', async () => {
    findByIdMock.mockResolvedValue(mockEvents[0]);

    const service = new GetEvent(mockEvents[0].id);
    await service.call();

    expect(service.valid).toBe(true);
    expect(service.getEvent()?.id).toBe(mockEvents[0].id)
    expect(findByIdMock).toHaveBeenCalled();
  });

  it('should error for null event', async () => {
    findByIdMock.mockResolvedValue(null);

    const service = new GetEvent(mockEvents[0].id);
    await service.call();

    expect(service.valid).toBe(false);
    expect((service.error || { message: "" }).message).toBe("El evento no existe")
    expect(findByIdMock).toHaveBeenCalled();
  });
});