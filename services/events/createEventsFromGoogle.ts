import { eventRepository } from '../../repositories/eventRepository';
import { EventRequest, Event } from '../../types/event';
import { DateTime } from 'luxon';
import BaseService from '../baseService';

export default class CreateEvent extends BaseService {
    private data: EventRequest;

    private event: Event | null;

    constructor(data: Array<{}>) {
        super();
        this.data = data;
    }

    public async call(): Promise<void> {
        await Promise.all(this.data.map(item => this.createEvent(item)));
        this.event = await eventRepository.create(this.data) as Event;
    }

    private async createEvent(item) {
        if (item.sequence === 0) {
            console.log("Vamos a crear", item)

            try {
                let startDate = "";
                let endDate = "";

                if (item.start.dateTime && item.end.dateTime) {
                    startDate = DateTime.fromISO(item.start.dateTime).toUTC().toISO({ suppressMilliseconds: false });
                    endDate = DateTime.fromISO(item.end.dateTime).toUTC().toISO({ suppressMilliseconds: false });
                }


                console.log("startUTC: ", startDate)
                console.log("endUTC: ", endDate)

                const payload = {
                    title: item.summary,
                    description: item.description || "",
                    weather: "",
                    weather_url: "",
                    city: "",
                    start_date: startDate,
                    finish_date: endDate,
                    is_all_day: false,
                }

                await eventRepository.create(payload);
            } catch (error) {
                console.log(error);
            }
        }
    }
}