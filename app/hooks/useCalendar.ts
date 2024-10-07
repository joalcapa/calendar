import { useState, useEffect } from 'react';
import { Event } from "../../types/event";
import { MonthEvents, Day } from '../../types/month';
import { DateTime } from "luxon";
import useDays from "../../app/hooks/useDays";
import useEvents from "../../app/hooks/useEvents";

/**
 * Custom hook to manage calendar events and interactions.
 *
 * @param {MonthEvents} props - The properties for the calendar events.
 * @returns {Object} An object containing the month and event management functionality.
 * @returns {Object} month - Contains properties and methods related to the month view.
 * @returns {boolean} month.isHours - Indicates if the calendar displays hours.
 * @returns {string} month.monthName - The name of the current month.
 * @returns {string} month.dayName - The name of the current day.
 * @returns {Date} month.today - The current date.
 * @returns {Date} month.startDayOfMonth - The start date of the current month.
 * @returns {boolean} month.isMount - Indicates if the component is mounted.
 * @returns {Array<Day>} month.days - The array of days in the current month.
 * @returns {Day} month.day - The current day object.
 * @returns {Function} month.onDay - Function to handle day selection.
 * @returns {Function} month.onEvent - Function to handle event selection.
 * @returns {Function} month.onHour - Function to handle hour selection.
 * @returns {Function} month.onDropHour - Function to handle hour drop event.
 * @returns {boolean} month.isSmallHour - Indicates if the hour display is small.
 * @returns {Array<number>} month.hours - The array of hours for the day.
 * @returns {Object} eventForUpdate - Contains properties and methods for updating events.
 * @returns {Event | null} eventForUpdate.event - The event being updated.
 * @returns {boolean} eventForUpdate.isVisible - Indicates if the update event modal is visible.
 * @returns {Function} eventForUpdate.onClose - Function to close the update event modal.
 * @returns {Object} dayForCreateEvent - Contains properties and methods for creating events.
 * @returns {Day | null} dayForCreateEvent.day - The day for creating a new event.
 * @returns {boolean} dayForCreateEvent.isVisible - Indicates if the create event modal is visible.
 * @returns {Function} dayForCreateEvent.onClose - Function to close the create event modal.
 */
const useCalendar = (props: MonthEvents) => {
    const {
        today,
        startDayOfMonth,
        monthName,
        dayName,
        isHours,
        dayNumber,
        isSmallHour = false,
    } = props;

    const { days } = useDays({ dayNumber });
    const [isMount, seMount] = useState<boolean>(false);
    const { updateEvent } = useEvents();
    const [event, setEvent] = useState<Event | null>(null);
    const [day, setDay] = useState<Day | null>(null);
    const [isUpdateEvent, setUpdateEvent] = useState<boolean>(false);
    const [isCreateEvent, setCreateEvent] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            seMount(true);
        }

        return () => {
            isMounted = false;
        };
    }, []);

    /**
     * Handles the selection of a day.
     *
     * @param {Day} d - The selected day.
     */
    const onDay = (d: Day): void => {
        setDay(d);
        setCreateEvent(true);
    };

    /**
     * Handles the selection of an hour.
     *
     * @param {number} hour - The selected hour.
     */
    const onHour = (hour: number): void => {
        const d = days[0];
        d.dayDate = new Date(d.dayDate);
        d.dayDate.setUTCHours(hour, 0, 0);

        setDay(d);
        setCreateEvent(true);
    };

    /**
     * Handles the event when an hour is dropped on a day.
     *
     * @param {Event} event - The event being updated.
     * @param {Day} oldDay - The old day of the event.
     * @param {number | null} hour - The hour to set for the event.
     * @param {Day} day - The new day for the event.
     */
    const onDropHour = async (event: Event, oldDay: Day, hour: number | null, day: Day) => {
        const dayDateTime = DateTime.fromJSDate(day.dayDate);
        const startDateTime = DateTime.fromJSDate(new Date(event.start_date)).toUTC();
        const finishDateTime = DateTime.fromJSDate(new Date(event.finish_date)).toUTC();
        const duration = finishDateTime.diff(startDateTime, 'hours').hours;

        const newStartDateTime = startDateTime.set({
            year: dayDateTime.year,
            month: dayDateTime.month,
            day: dayDateTime.day,
            hour: event.is_all_day ? 7 : hour || startDateTime.hour,
        });

        const newFinishDateTime = newStartDateTime.plus({ hours: event.is_all_day ? 12 : duration }).set({
            year: dayDateTime.year,
            month: dayDateTime.month,
        });

        await updateEvent({
            id: event.id,
            data: {
                title: event.title,
                description: event.description,
                city: event.city,
                weather: event.weather,
                weather_url: event.weather_url,
                is_all_day: event.is_all_day,
                start_date: newStartDateTime.toJSDate(),
                finish_date: newFinishDateTime.toJSDate(),
            },
            oldDay,
            currentDay: day,
        });
    };

    /**
     * Handles the selection of an event.
     *
     * @param {Event} e - The selected event.
     */
    const onEvent = (e: Event): void => {
        setUpdateEvent(true);
        setEvent(e);
    };

    /**
     * Closes the event creation or update modal.
     */
    const onClose = (): void => {
        setUpdateEvent(false);
        setCreateEvent(false);
        setEvent(null);
        setDay(null);
    };

    return {
        month: {
            isHours,
            monthName,
            dayName,
            today,
            startDayOfMonth,
            isMount,
            days,
            day: days[0],
            onDay,
            onEvent,
            onHour,
            onDropHour,
            isSmallHour,
            hours: Array.from({ length: 13 }, (_, i) => i + 7),
        },
        eventForUpdate: {
            event,
            isVisible: isUpdateEvent,
            onClose,
        },
        dayForCreateEvent: {
            day,
            isVisible: isCreateEvent,
            onClose,
        },
    };
};

export default useCalendar;
