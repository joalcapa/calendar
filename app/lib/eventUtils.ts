import { Event, EventRequest } from "../../types/event";
import { Day } from "../../types/month";
import { UpdatePayload } from '../hooks/useEvents';

/**
 * Represents the data for a month in a calendar.
 */
export interface MonthData {
    /**
     * The starting day of the month (1-31).
     */
    startDayOfMonth: number;

    /**
     * The current day of the month (1-31).
     */
    today: number;

    /**
     * The name of the day (e.g., "Monday", "Tuesday").
     */
    dayName: string;

    /**
     * An array of day objects representing each day in the month.
     */
    days: {
        /**
         * Indicates whether the day is the current day.
         */
        isCurrent: boolean;

        /**
         * The date object representing the specific day.
         */
        dayDate: Date;

        /**
         * Indicates whether the day is today.
         */
        isToday: boolean;

        /**
         * The day of the month (1-31).
         */
        day: number;

        /**
         * Indicates whether the day is part of the current month.
         */
        isCurrentMonth: boolean;

        /**
         * An array of events scheduled for the day.
         */
        events: Event[];
    }[];
}


/**
 * Creates a new event for a specific day of the week.
 *
 * This function updates the existing week data by adding the new event to the
 * corresponding day based on the event's start date.
 *
 * @param event - The event to be added. It should contain the start_date property
 *                indicating when the event occurs.
 * @returns A function that takes the current week data and returns a new week
 *          data array with the event added to the appropriate day.
 */
export const createEventOnWeek = (event: EventRequest) => (oldData: Array<MonthData>): Array<MonthData> => [
    ...oldData.map(weekDay => ({
        ...weekDay,
        days: weekDay.days.map((day) => {
            // Check if the current day matches the event's start date
            if (day.day === new Date(event.start_date).getDate()) {
                return {
                    ...day,
                    events: [
                        event, // Add the new event to the start of the events array
                        ...day.events,
                    ],
                };
            }

            return day; // Return the day unchanged if it doesn't match
        }),
    })),
];

/**
 * Creates a new event for a specific day in the month.
 *
 * This function updates the existing month data by adding the new event
 * to the corresponding day based on the event's start date.
 *
 * @param event - The event to be added. It should contain the start_date property
 *                indicating when the event occurs.
 * @returns A function that takes the current month data and returns a new
 *          month data object with the event added to the appropriate day.
 */
export const createEvent = (event: EventRequest) => (oldData: MonthData): MonthData => ({
    ...oldData,
    days: oldData.days.map((day) => {
        // Check if the current day matches the event's start date
        if (day.day === new Date(event.start_date).getDate()) {
            return {
                ...day,
                events: [
                    event, // Add the new event to the start of the events array
                    ...day.events,
                ],
            };
        }

        return { ...day }; // Return the day unchanged if it doesn't match
    }),
});

/**
 * Deletes an event from the week by its ID.
 *
 * This function takes the event ID and removes it from the events list
 * of the corresponding day within each week in the provided month data.
 *
 * @param eventId - The ID of the event to be deleted.
 * @returns A function that takes the current week data and returns a new
 *          array of week data with the specified event removed from its
 *          corresponding day.
 */
export const deleteEventOnWeek = (eventId: number) => (oldData: Array<MonthData>): Array<MonthData> => ([
    ...oldData.map(weekDay => ({
        ...weekDay,
        days: weekDay.days.map((day) => ({
            ...day,
            events: day.events.filter((event) => event.id !== eventId), // Remove the event by ID
        })),
    })),
]);

/**
 * Deletes an event from a specific day in the month data by its ID.
 *
 * This function takes the event ID and removes it from the events list
 * of the corresponding day within the provided month data.
 *
 * @param eventId - The ID of the event to be deleted.
 * @returns A function that takes the current month data and returns a
 *          new month data object with the specified event removed from
 *          its corresponding day.
 */
export const deleteEvent = (eventId: number) => (oldData: MonthData): MonthData => (
    {
        ...oldData,
        days: oldData.days.map((day) => ({
            ...day,
            events: day.events.filter((event) => event.id !== eventId), // Remove the event by ID
        })),
    }
);

/**
 * Updates an event in the month data with new information while preserving its ID.
 *
 * This function takes an `UpdatePayload`, which contains the ID of the event to be updated
 * and the new data for that event. It removes the old event from the day's events and
 * adds a new event with the updated information.
 *
 * @param payload - The payload containing the ID of the event to be updated
 *                  and the new event data.
 * @returns A function that takes the current month data and returns a new
 *          month data object with the specified event updated with the new data.
 */
export const updateEvent = (payload: UpdatePayload) => (oldData: MonthData): MonthData => {
    let e: Event | null = null;

    const newData = {
        ...oldData,
        days: oldData.days.map((day) => ({
            ...day,
            events: day.events.filter((event) => {
                e = event; // Store the event being removed
                return event.id !== payload.id; // Filter out the event to be updated
            }),
        })),
    };

    return {
        ...newData,
        days: newData.days.map((day) => {
            if (e && day.day === new Date(payload.data.start_date).getDate()) {
                // Insert the updated event at the beginning of the events array
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
    };
};

/**
 * Updates an event in the week data with new information while preserving its ID.
 *
 * This function takes an `UpdatePayload`, which contains the ID of the event to be updated
 * and the new data for that event. It removes the old event from the week's events and
 * adds a new event with the updated information to the appropriate day.
 *
 * @param payload - The payload containing the ID of the event to be updated
 *                  and the new event data.
 * @returns A function that takes the current week data and returns a new
 *          week data array with the specified event updated with the new data.
 */
export const updateEventOnWeek = (payload: UpdatePayload) => (oldData: Array<MonthData>): Array<MonthData> => {
    let e: Event | null = null;

    const newData = [
        ...oldData.map(weekDay => ({
            ...weekDay,
            days: weekDay.days.map((day) => ({
                ...day,
                events: day.events.filter((event) => {
                    e = event; // Store the event being removed
                    return (event.id !== payload.id); // Filter out the event to be updated
                })
            })),
        })),
    ];

    return [
        ...newData.map(weekDay => ({
            ...weekDay,
            days: weekDay.days.map((day) => {
                if (e && day.day === new Date(payload.data.start_date).getDate()) {
                    // Insert the updated event at the beginning of the events array
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
    ];
};

/**
 * Updates an event that is being moved from one day to another within a month.
 *
 * This function takes two `Day` objects representing the old day and the current day
 * for the event, along with an `UpdatePayload` that contains the new data for the event.
 * It removes the event from the old day and adds the updated event to the current day.
 *
 * @param oldDay - The day object representing the day the event is being moved from.
 * @param currentDay - The day object representing the day the event is being moved to.
 * @param payload - The payload containing the ID of the event to be updated
 *                  and the new event data.
 * @returns A function that takes the current month data and returns a new month data
 *          object with the specified event updated and moved to the new day.
 */
export const updateEventWithDifferentDays = (oldDay: Day, currentDay: Day, payload: UpdatePayload) => (oldData: MonthData) => {
    let currentEvent: Event | null = null;
    let currentDayFind: Day | null = null;
    let oldDayFind: Day | null = null;

    // Find and remove the event from the old day
    oldData.days.forEach((day) => {
        if (day.day === oldDay.day) {
            oldDayFind = day;
            oldDayFind.events = oldDayFind.events.filter((event) => {
                currentEvent = event; // Store the current event
                return event.id !== payload.id; // Filter out the event to be updated
            });
        }
    });

    // Find the current day and add the updated event to it
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
            });
        }
    });

    // Return the updated month data with the changes applied
    return {
        ...oldData,
        days: oldData.days.map((day) => {
            if (currentDayFind && day.day === currentDayFind.day) {
                return currentDayFind; // Return the updated current day
            }

            if (oldDayFind && day.day === oldDayFind.day) {
                return oldDayFind; // Return the updated old day
            }

            return day; // Return the unmodified day
        }),
    };
};

/**
 * Updates an event that is being moved from one day to another within a week.
 *
 * This function takes two `Day` objects representing the old day and the current day
 * for the event, along with an `UpdatePayload` that contains the new data for the event.
 * It removes the event from the old day and adds the updated event to the current day.
 *
 * @param oldDay - The day object representing the day the event is being moved from.
 * @param currentDay - The day object representing the day the event is being moved to.
 * @param payload - The payload containing the ID of the event to be updated
 *                  and the new event data.
 * @returns A function that takes an array of month data (representing the week)
 *          and returns a new array of month data with the specified event updated
 *          and moved to the new day.
 */
export const updateEventWithDifferentDaysOnWeek = (oldDay: Day, currentDay: Day, payload: UpdatePayload) => (oldData: Array<MonthData>) => {
    let currentEvent: Event | null = null;
    let currentDayFind: Day | null = null;
    let oldDayFind: Day | null = null;

    // Find and remove the event from the old day
    oldData.forEach((weekDay) => {
        weekDay.days.forEach((day) => {
            if (day.day === oldDay.day) {
                oldDayFind = day;
                oldDayFind.events = oldDayFind.events.filter((event) => {
                    currentEvent = event; // Store the current event
                    return event.id !== payload.id; // Filter out the event to be updated
                });
            }
        });
    });

    // Find the current day and add the updated event to it
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
                });
            }
        });
    });

    // Return the updated week data with the changes applied
    return [
        ...oldData.map(weekDay => ({
            ...weekDay,
            days: weekDay.days.map((day) => {
                if (currentDayFind && day.day === currentDayFind.day) {
                    return currentDayFind; // Return the updated current day
                }

                if (oldDayFind && day.day === oldDayFind.day) {
                    return oldDayFind; // Return the updated old day
                }

                return day; // Return the unmodified day
            }),
        })),
    ];
};
