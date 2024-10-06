import { useState, useEffect } from 'react';
import { Event } from "../../types/event";
import { MonthEvents, Day } from '../../types/month';
import { DateTime } from "luxon";
import useDays from "../../app/hooks/useDays";
import useEvents from "../../app/hooks/useEvents";

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
    const [ isMount, seMount ] = useState<boolean>(false);
    const { updateEvent } = useEvents();
    const [ event, setEvent ] = useState<Event | null>(null);
    const [ day, setDay ] = useState<Day | null>(null);
    const [ isUpdateEvent, setUpdateEvent ] = useState<boolean>(false);
    const [ isCreateEvent, setCreateEvent ] = useState<boolean>(false);

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            seMount(true)
        }

        return () => {
            isMounted = false;
        }
    }, []);

    const onDay = (d: Day): void => {
        setDay(d);
        setCreateEvent(true);
    };

    const onHour = (hour: number): void => {
        const d = days[0];
        d.dayDate = new Date(d.dayDate);
        d.dayDate.setUTCHours(hour, 0, 0);

        setDay(d);
        setCreateEvent(true);
    };

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


    const onEvent = (e: Event): void => {
        setUpdateEvent(true);
        setEvent(e);
    };

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
    }
};

export default useCalendar;