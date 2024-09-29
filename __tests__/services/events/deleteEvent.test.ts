import DeleteEvent from '@/services/events/deleteEvent';
import { eventRepository } from '@/repositories/eventRepository';
import { mockEvents } from '../../../__mocks__/eventData';

jest.mock('@/repositories/eventRepository', () => ({
  eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('DeleteEvent', () => {
  let deleteByIdMock: jest.Mock<Promise<void>>;

  beforeEach(() => {
    deleteByIdMock = eventRepository.deleteById as unknown as jest.Mock<Promise<void>>;
    jest.clearAllMocks();
  });

  it('should delete event', async () => {
    const service = new DeleteEvent(mockEvents[0].id);
    await service.call();

    expect(service.valid).toBe(true)
    expect(deleteByIdMock).toHaveBeenCalled();
  });
});