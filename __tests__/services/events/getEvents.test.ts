import GetEvents from '@/services/events/getEvents';
import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import { mockEvents } from '../../../__mocks__/eventData';

jest.mock('@/repositories/eventRepository', () => ({
  eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('GetEvents', () => {
  let findAllMock: jest.Mock<Promise<Event[]>>;

  beforeEach(() => {
    findAllMock = eventRepository.findAll as unknown as jest.Mock<Promise<Event[]>>;
    jest.clearAllMocks();
  });

  it('should get all events', async () => {
    findAllMock.mockResolvedValue(mockEvents);

    const service = new GetEvents();
    await service.call();

    expect(service.valid).toBe(true);
    expect(service.getEvents()).toEqual(mockEvents);
    expect(findAllMock).toHaveBeenCalled();
  });
});