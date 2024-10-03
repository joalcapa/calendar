import { Event } from "@/types/event";

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

export const getMonthFromDate = (date: Date): string => {
    return [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ][date.getMonth()];
};