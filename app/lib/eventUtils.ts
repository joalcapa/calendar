import { Event, EventRequest } from "../../types/event";
import { Day } from "../../types/month";
import { UpdatePayload } from '../hooks/useEvents';

export interface MonthData {
    startDayOfMonth: number;
    today: number;
    dayName: string;
    days: {
        isCurrent: boolean;
        dayDate: Date;
        isToday: boolean;
        day: number;
        isCurrentMonth: boolean;
        events: Event[]
    }[]
}

export const createEventOnWeek = (event: EventRequest) => (oldData: Array<MonthData>) => [
    ...oldData.map(weekDay => ({
        ...weekDay,
        days: weekDay.days.map((day) => {
            if (day.day === new Date(event.start_date).getDate()) {
                return {
                    ...day,
                    events: [
                        event,
                        ...day.events,
                    ],
                }
            }

            return day;
        }),
    })),
];

export const createEvent = (event: EventRequest) => (oldData: MonthData) => ({
    ...oldData,
    days: oldData.days.map((day) => {
        if (day.day === new Date(event.start_date).getDate()) {
            return {
                ...day,
                events: [
                    event,
                    ...day.events,
                ],
            }
        }

        return { ...day };
    }),
});

export const deleteEventOnWeek = (eventId: number) => (oldData: Array<MonthData>) => ([
    ...oldData.map(weekDay => ({
        ...weekDay,
        days: weekDay.days.map((day) => ({
            ...day,
            events: day.events.filter((event) => event.id !== eventId),
        })),
    })),
]);

export const deleteEvent = (eventId: number) => (oldData: MonthData) => (
    {
        ...oldData,
        days: oldData.days.map((day) => ({
            ...day,
            events: day.events.filter((event) => event.id !== eventId),
        })),
    }
);

export const updateEvent = (payload: UpdatePayload) => (oldData: MonthData) => {
    let e: Event | null = null;

    const newData = {
        ...oldData,
        days: oldData.days.map((day) => ({
            ...day,
            events: day.events.filter((event) => {
                e = event;
                return event.id !== payload.id;
            }),
        })),
    };

    return {
        ...newData,
        days: newData.days.map((day) => {
            if (e && day.day === new Date(payload.data.start_date).getDate()) {
                day.events.unshift({
                    ...e,
                    title: payload.data.title,
                    city: payload.data.city,
                    weather: payload.data.weather,
                    weather_url: payload.data.weather_url,
                    description: payload.data.description,
                    is_all_day: payload.data.is_all_day,
                    start_date: new Date(payload.data.start_date),
                    finish_date: new Date(payload.data.finish_date),
                });
            }

            return day;
        }),
    }
};

export const updateEventOnWeek = (payload: UpdatePayload) => (oldData: Array<MonthData>) => {
    let e: Event | null = null;

    const newData = [
        ...oldData.map(weekDay => ({
            ...weekDay,
            days: weekDay.days.map((day) => ({
                ...day,
                events: day.events.filter((event) => {
                    e = event;
                    return (event.id !== payload.id);
                })
            })),
        })),
    ];

    return [
        ...newData.map(weekDay => ({
            ...weekDay,
            days: weekDay.days.map((day) => {
                if (e && day.day === new Date(payload.data.start_date).getDate()) {
                    day.events.unshift({
                        ...e,
                        title: payload.data.title,
                        city: payload.data.city,
                        weather: payload.data.weather,
                        weather_url: payload.data.weather_url,
                        description: payload.data.description,
                        is_all_day: payload.data.is_all_day,
                        start_date: new Date(payload.data.start_date),
                        finish_date: new Date(payload.data.finish_date),
                    });
                }

                return day;
            }),
        })),
    ]
};

export const updateEventWithDifferentDays = (oldDay: Day, currentDay: Day, payload: UpdatePayload) => (oldData: MonthData) => {
    let currentEvent: Event | null = null;
    let currentDayFind: Day | null = null;
    let oldDayFind: Day | null = null;

    oldData.days.forEach((day) => {
        if (day.day === oldDay.day) {
            oldDayFind = day;
            oldDayFind.events = oldDayFind.events.filter((event) => {
                currentEvent = event;
                return event.id !== payload.id
            });
        }
    });

    oldData.days.forEach((day) => {
        if (currentEvent && day.day === currentDay.day) {
            currentDayFind = day;
            currentDayFind.events.push({
                ...currentEvent,
                title: payload.data.title,
                city: payload.data.city,
                weather: payload.data.weather,
                weather_url: payload.data.weather_url,
                description: payload.data.description,
                is_all_day: payload.data.is_all_day,
                start_date: new Date(payload.data.start_date),
                finish_date: new Date(payload.data.finish_date),
            })
        }
    });

    return {
        ...oldData,
        days: oldData.days.map((day) => {
            if (currentDayFind && day.day === currentDayFind.day) {
                return currentDayFind;
            }

            if (oldDayFind && day.day === oldDayFind.day) {
                return oldDayFind;
            }

            return day;
        }),
    }
};

export const updateEventWithDifferentDaysOnWeek = (oldDay: Day, currentDay: Day, payload: UpdatePayload) => (oldData: Array<MonthData>) => {
    let currentEvent: Event | null = null;
    let currentDayFind: Day | null = null;
    let oldDayFind: Day | null = null;

    oldData.forEach((weekDay) => {
        weekDay.days.forEach((day) => {
            if (day.day === oldDay.day) {
                oldDayFind = day;
                oldDayFind.events = oldDayFind.events.filter((event) => {
                    currentEvent = event;
                    return event.id !== payload.id
                });
            }
        });
    })

    oldData.forEach((weekDay) => {
        weekDay.days.forEach((day) => {
            if (currentEvent && day.day === currentDay.day) {
                currentDayFind = day;
                currentDayFind.events.push({
                    ...currentEvent,
                    title: payload.data.title,
                    city: payload.data.city,
                    weather: payload.data.weather,
                    weather_url: payload.data.weather_url,
                    description: payload.data.description,
                    is_all_day: payload.data.is_all_day,
                    start_date: new Date(payload.data.start_date),
                    finish_date: new Date(payload.data.finish_date),
                })
            }
        });
    })

    return [
        ...oldData.map(weekDay => ({
            ...weekDay,
            days: weekDay.days.map((day) => {
                if (currentDayFind && day.day === currentDayFind.day) {
                    return currentDayFind;
                }

                if (oldDayFind && day.day === oldDayFind.day) {
                    return oldDayFind;
                }

                return day;
            }),
        })),
    ]
};