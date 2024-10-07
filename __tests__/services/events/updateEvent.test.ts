import UpdateEvent from '@/services/events/updateEvent';
import { eventRepository } from '@/repositories/eventRepository';
import { Event, EventRequest } from '@/types/event';
import { mockEvents } from '../../../__mocks__/eventData';
import { mockRequestData } from '../../../__mocks__/eventRequest';

jest.mock('@/repositories/eventRepository', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('UpdateEvent', () => {
    let findByIdMock: jest.Mock<Promise<Event>>;
    let updateMock: jest.Mock<Promise<void>>;

    beforeEach(() => {
        findByIdMock = eventRepository.findById as unknown as jest.Mock<Promise<Event>>;
        updateMock = eventRepository.update as unknown as jest.Mock<Promise<void>>;

        jest.clearAllMocks();
    });

    describe('Invalid params', () => {
        it('should return error, parameter id is required', async () => {
            const service = new UpdateEvent(0, { } as EventRequest);
            await service.call();

            expect(service.valid).toBe(false);
            expect(service.error).toBe("El id es requerido")
        });

        it('should return error, event is not exist', async () => {
            const service = new UpdateEvent(1, { } as EventRequest);
            await service.call();

            expect(service.valid).toBe(false);
            expect(service.error).toBe("El evento no existe")
        });
    });

    describe('Valid params', () => {
        it('should return event updated', async () => {
            const eventToUpdated = mockEvents[0];
            findByIdMock.mockResolvedValue(eventToUpdated);

            const service = new UpdateEvent(eventToUpdated.id, mockRequestData[0]);
            await service.call();

            expect(service.valid).toBe(true);

            const event = service.getEvent();
            expect(event).toBe(eventToUpdated)

            expect(findByIdMock).toHaveBeenCalled();
            expect(updateMock).toHaveBeenCalled();
        });
    });
});