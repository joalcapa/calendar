import { useState, useEffect } from 'react';
import { Event} from "@/types/event";
import { MonthEvents, Day } from '@/types/month';
import useGetEvent from "@/app/hooks/useGetEvent";

const useMonth = (props: MonthEvents) => {
    const { today, startDayOfMonth } = props;
    const [ isMount, seMount ] = useState<boolean>(false);
    const [ days, setDays ] = useState<Day[]>(props.days);
    const [ event, setEvent ] = useState<Event | null>(null);
    const [ day, setDay ] = useState<Day | null>(null);
    const [ isUpdateEvent, setUpdateEvent ] = useState<boolean>(false);
    const [ isCreateEvent, setCreateEvent ] = useState<boolean>(false);
    const { updateEvent } = useGetEvent();

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            seMount(true)
        }

        return () => {
            isMounted = false;
        }
    }, []);

    const onDrop = async (eventUpdated: Event, targetDay: Day): void => {
        const startDate: Date = new Date(eventUpdated.start_date);
        startDate.setDate(targetDay.day);

        const finishDate: Date = new Date(eventUpdated.finish_date);
        finishDate.setDate(targetDay.day);

        eventUpdated.start_date = startDate;
        eventUpdated.finish_date = finishDate;

        const payload = {
            title: eventUpdated.title,
            description: eventUpdated.description,
            is_all_day: eventUpdated.is_all_day,
            start_date: startDate.toISOString(),
            finish_date: finishDate.toISOString(),
        };

        setDays((prevDays) =>
            prevDays
                .map((d) => ({
                    ...d,
                    events: d.events.filter((e) => e.id !== eventUpdated.id),
                }))
                .map((d) => {
                    if (d.day === targetDay.day) {
                        return {
                            ...d,
                            events: [...d.events, eventUpdated],
                        };
                    }
                    return d;
                })
        );

        try {
            await updateEvent(eventUpdated.id, payload);
        } catch {

        }
    };

    const onDay = (d: Day): void => {
        setDay(d);
        setCreateEvent(true);
    };

    const onDrag = (eventDeleted: Event): void => {
        setDays((prevDays) =>
            prevDays.map((d) => ({
                ...d,
                events: d.events.filter((e) => e.id !== eventDeleted.id),
            }))
        );
    };

    const onEvent = (e: Event): void => {
        setUpdateEvent(true);
        setEvent(e);
    };

    const onDeleteEvent = (eventDeleted: Event): void => {
        setDays((prevDays) =>
            prevDays.map((d) => ({
                ...d,
                events: d.events.filter((e) => e.id !== eventDeleted.id),
            }))
        );

        onClose();
    };

    const onUpdateEvent = (eventUpdated: Event): void => {
        setDays((prevDays) =>
            prevDays
                .map((d) => ({
                    ...d,
                    events: d.events.filter((e) => e.id !== eventUpdated.id),
                }))
                .map((d) => {
                    if (d.day === new Date(eventUpdated.start_date).getDate()) {
                        return {
                            ...d,
                            events: [...d.events, eventUpdated],
                        };
                    }
                    return d;
                })
        );

        onClose();
    };

    const onClose = (): void => {
        setUpdateEvent(false);
        setCreateEvent(false);
        setEvent(null);
        setDay(null);
    };

    const onCreateEvent = (e: Event) => {
        onClose();

        setDays((prevDays) =>
            prevDays.map((d) => {
                if (d === day) {
                    return {
                        ...d,
                        events: [...d.events, e],
                    };
                }
                return d;
            })
        );
    }

    return {
        month: {
            today,
            startDayOfMonth,
            isMount,
            days,
            onDrop,
            onDay,
            onDrag,
            onEvent,
        },
        eventForUpdate: {
            event,
            isVisible: isUpdateEvent,
            onDeleteEvent,
            onUpdateEvent,
            onClose,
        },
        dayForCreateEvent: {
            day,
            isVisible: isCreateEvent,
            onClose,
            onCreateEvent,
        },
    }
};

export default useMonth;