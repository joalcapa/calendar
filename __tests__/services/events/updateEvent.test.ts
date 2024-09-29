import UpdateEvent from '@/services/events/updateEvent';
import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import { mockEvents } from '../../../__mocks__/eventData';

jest.mock('@/repositories/eventRepository', () => ({
  eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('UpdateEvent', () => {
  let updateMock: jest.Mock<Promise<Event | null>>;
  let findByIdMock: jest.Mock<Promise<Event | null>>;

  beforeEach(() => {
    findByIdMock = eventRepository.findById as unknown as jest.Mock<Promise<Event | null>>;
    updateMock = eventRepository.update as unknown as jest.Mock<Promise<Event | null>>;
    jest.clearAllMocks();
  });

  it('should update event', async () => {
    const payload = { ...mockEvents[0] }
    payload.title = "New Title"

    findByIdMock.mockResolvedValue(mockEvents[0]);
    updateMock.mockResolvedValue(payload);

    const service = new UpdateEvent(mockEvents[0].id, payload as any);
    await service.call();

    expect(service.valid).toBe(true);
    expect(service.getEvent()?.title).toBe(payload.title)
    expect(findByIdMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
  });

  it('should error for null event', async () => {
    findByIdMock.mockResolvedValue(null);
    updateMock.mockResolvedValue(null);

    const service = new UpdateEvent(mockEvents[0].id, {} as any);
    await service.call();

    expect(service.valid).toBe(false);
    expect((service.error || { message: "" }).message).toBe("El evento no existe")
    expect(findByIdMock).toHaveBeenCalled();
    expect(updateMock).toHaveBeenCalled();
  });
});