import { Event } from "../types/event";

export const getDaysInMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    return new Date(year, month, 0).getDate();
};

export const getDateFromNumberDay = (date: Date, i: number): Date => {
    const newDate = new Date(date);
    newDate.setUTCDate(i);
    newDate.setUTCHours(7, 0, 0, 0);
    return newDate;
};

export const getEventsFromDay = (events: Event[], day: number): Event[] => {
    return events
        .filter(
            (event) =>
                (event.start_date.getDate() === day)
        );
};

export const getMonthAndYearFromDate = (date: Date): string => {
    const month = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ][date.getMonth()];
    return `${month} del ${date.getFullYear()}`;
};

export const formatDateYYYYMMDD = (d: Date | string) => {
    const startDate = new Date(d);
    return `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`;
};