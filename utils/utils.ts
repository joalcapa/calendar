import { Event } from "../types/event";
import { DateTime } from 'luxon';

/**
 * Gets the number of days in a specific month from a given date.
 *
 * @param date - The date from which the month and year will be extracted.
 * @returns The number of days in the month of the provided date.
 *
 * @example
 * const date = new Date(2024, 0); // January 2024
 * const daysInJanuary = getDaysInMonth(date); // Returns 31
 */
export const getDaysInMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
};

/**
 * Gets a new date by setting the day of the month for a given date.
 *
 * @param date - The original date from which to derive the new date.
 * @param i - The day of the month to set (1-31).
 * @returns A new Date object with the specified day set and time adjusted to UTC.
 *
 * @example
 * const originalDate = new Date(2024, 0, 15); // January 15, 2024
 * const newDate = getDateFromNumberDay(originalDate, 10); // Returns January 10, 2024, 07:00:00 UTC
 */
export const getDateFromNumberDay = (date: Date, i: number): Date => {
    const newDate = new Date(date);
    newDate.setUTCDate(i);
    newDate.setUTCHours(7, 0, 0, 0);
    return newDate;
};


/**
 * Retrieves events that occur on a specific day of the month.
 *
 * @param events - An array of Event objects to filter.
 * @param day - The day of the month to filter events by (1-31).
 * @returns An array of Event objects that occur on the specified day.
 *
 * @example
 * const events = [
 *     { start_date: new Date(2024, 0, 10), title: 'Event 1', ... },
 *     { start_date: new Date(2024, 0, 15), title: 'Event 2', ... },
 *     { start_date: new Date(2024, 0, 10), title: 'Event 3', ... }
 * ];
 * const eventsOnDay = getEventsFromDay(events, 10); // Returns [{ start_date: January 10, 2024, title: 'Event 1', ... }, { start_date: January 10, 2024, title: 'Event 3', ... }]
 */
export const getEventsFromDay = (events: Event[], day: number): Event[] => {
    return events.filter(
        (event) => event.start_date.getDate() === day
    );
};

/**
 * Retrieves the month and year from a given date in a formatted string.
 *
 * @param date - The date from which to extract the month and year.
 * @returns A string representing the month and year in the format "Month del Year".
 *
 * @example
 * const date = new Date(2024, 0); // January 1, 2024
 * const formattedDate = getMonthAndYearFromDate(date); // Returns "Enero del 2024"
 */
export const getMonthAndYearFromDate = (date: Date): string => {
    const month = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ][date.getMonth()];
    return `${month} del ${date.getFullYear()}`;
};

/**
 * Formats a date into a string in the format "YYYY-MM-DD".
 *
 * @param d - The date to format, which can be a Date object or a string representing a date.
 * @returns A string representing the date in the format "YYYY-MM-DD".
 *
 * @example
 * const date = new Date(2024, 0, 15); // January 15, 2024
 * const formattedDate = formatDateYYYYMMDD(date); // Returns "2024-01-15"
 *
 * @example
 * const dateString = "2024-01-15";
 * const formattedDateFromString = formatDateYYYYMMDD(dateString); // Returns "2024-01-15"
 */
export const formatDateYYYYMMDD = (d: Date | string) => {
    const startDate = new Date(d);
    return `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
};

/**
 * Retrieves a formatted label for a given date, including the day of the week and the day of the month.
 *
 * @param d - The date to format, which should be a Date object.
 * @returns A string representing the formatted label in the format "Day - DayOfMonth".
 *
 * @example
 * const date = new Date(2024, 0, 15); // January 15, 2024
 * const dayLabel = getDayLabel(date); // Returns "Lunes - 15" (assuming the date falls on a Monday)
 */
export const getDayLabel = (d: Date) => {
    const date = DateTime.fromJSDate(d).setLocale('es');
    const dia = date.toFormat('cccc');
    return `${dia.charAt(0).toUpperCase() + dia.slice(1)} - ${date.day}`;
};
