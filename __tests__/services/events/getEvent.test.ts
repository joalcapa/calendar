import GetEvent from '@/services/events/getEvent';
import { eventRepository } from '@/repositories/eventRepository';
import { Event } from '@/types/event';
import { mockEvents } from '../../../__mocks__/eventData';

jest.mock('@/repositories/eventRepository', () => ({
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    eventRepository: require("../../../__mocks__/eventRepository").eventRepository,
}));

describe('GetEvent', () => {
    let getMock: jest.Mock<Promise<Event>>;

    beforeEach(() => {
        getMock = eventRepository.findById as unknown as jest.Mock<Promise<Event>>;
        jest.clearAllMocks();
    });

    describe('Invalid params', () => {
        it('should return error, parameter id is required', async () => {
            const service = new GetEvent(0);
            await service.call();

            expect(service.valid).toBe(false);
            expect(service.error).toBe("El id es requerido")
        });

        it('should return error, event is not exist', async () => {
            const service = new GetEvent(1);
            await service.call();

            expect(service.valid).toBe(false);
            expect(service.error).toBe("El evento no existe")
        });
    });

    describe('Valid params', () => {
        it('should return event', async () => {
            const eventToCreated = mockEvents[0];
            getMock.mockResolvedValue(eventToCreated);

            const service = new GetEvent(1);
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
            expect(event?.createdAt).toBe(eventToCreated.createdAt);
            expect(event?.updatedAt).toBe(eventToCreated.updatedAt);

            expect(getMock).toHaveBeenCalled();
        });
    });
});