import getEvents from '@/services/events/getEvents';
import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import { mockEvents } from '../../../__mocks__/eventData';

jest.mock('@/repositories/eventRepository', () => ({
  eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('getEvents', () => {
  let findAllMock: jest.Mock<Promise<Event[]>>;

  beforeEach(() => {
    findAllMock = eventRepository.findAll as unknown as jest.Mock<Promise<Event[]>>;
  });

  it('debería obtener todos los eventos', async () => {
    findAllMock.mockResolvedValue(mockEvents);

    const events = await getEvents();
    expect(events).toEqual(mockEvents);
    expect(findAllMock).toHaveBeenCalled();
  });
});