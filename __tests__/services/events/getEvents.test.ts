import GetEvents, { GetEventsParams } from '@/services/events/getEvents';
import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import { mockEvents } from '../../../__mocks__/eventData';

jest.mock('@/repositories/eventRepository', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('GetEvents', () => {
    let findManyMock: jest.Mock<Promise<Event[]>>;
    let findAllMock: jest.Mock<Promise<Event[]>>;

    beforeEach(() => {
        findManyMock = eventRepository.findMany as unknown as jest.Mock<Promise<Event[]>>;
        findAllMock = eventRepository.findAll as unknown as jest.Mock<Promise<Event[]>>;

        jest.clearAllMocks();
    });

    describe('Invalid params', () => {
        it('should return error, query type is invalid', async () => {
            const service = new GetEvents({ queryType: 'other' } as unknown as GetEventsParams);
            await service.call();

            expect(service.valid).toBe(false);
            expect(service.error).toBe("Tipo de busqueda no soportada")
        });
    });

    describe('Valid params', () => {
        it('should return empty events from date empty', async () => {
            const service = new GetEvents({ queryType: 'month' } as GetEventsParams);
            await service.call();

            expect(service.valid).toBe(true);
            expect(service.getEvents().length).toBe(0)
        });

        it('should return all events from date empty', async () => {
            findAllMock.mockResolvedValue(mockEvents);

            const service = new GetEvents({ queryType: 'month' } as GetEventsParams);
            await service.call();

            expect(service.valid).toBe(true);
            expect(service.getEvents()).toBe(mockEvents)
        });

        it('should return event from date and month query', async () => {
            const event = { ...mockEvents[0], title: 'Other event' };
            findManyMock.mockResolvedValue([ event ]);

            const service = new GetEvents({ queryType: 'month', date: new Date() } as GetEventsParams);
            await service.call();

            expect(service.valid).toBe(true);
            expect(service.getEvents()[0].title).toBe(event.title);
        });

        it('should return event from date and day query', async () => {
            const event = { ...mockEvents[0], title: 'Other event' };
            findManyMock.mockResolvedValue([ event ]);

            const service = new GetEvents({ queryType: 'day', date: new Date() } as GetEventsParams);
            await service.call();

            expect(service.valid).toBe(true);
            expect(service.getEvents()[0].title).toBe(event.title);
        });

        it('should return event from date and week query', async () => {
            const event = { ...mockEvents[0], title: 'Other event' };
            findManyMock.mockResolvedValue([ event ]);

            const service = new GetEvents({ queryType: 'week', date: new Date() } as GetEventsParams);
            await service.call();

            expect(service.valid).toBe(true);
            expect(service.getEvents()[0].title).toBe(event.title);

            expect(findManyMock).toHaveBeenCalled();
        });
    });
});