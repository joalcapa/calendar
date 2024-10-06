import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Event} from "../../types/event";
import { Day } from '../../types/month';
import { deleteEvent, updateEvent, createEvent } from '../../app/services/event';
import useApi from "../hooks/useApi";
import useEventsPath from "@/app/hooks/useEventsPath";

interface CreatePayload {
    title: string;
    city: string;
    weather: string;
    weather_url: string;
    description: string;
    is_all_day: boolean;
    start_date: string;
    finish_date: string;
}

interface UpdatePayload {
    id: number,
    data: CreatePayload,
    oldDay?: Day,
    currentDay?: Day,
}

const useEvents = () => {
    const { queryKey: queryType, isWeek } = useEventsPath();
    const queryClient = useQueryClient();
    const { fetch } = useApi();

    const onError = (err, eventId, context) => {
        queryClient.setQueryData(queryType, context.previousData);
    };

    const getQueryClient = async () => {
        await queryClient.cancelQueries(queryType);
        return queryClient.getQueryData(queryType);
    };

    const onCreate = async (data: { data: Event }) => {
        const previousData = await getQueryClient();
        const event = data.data;

        if (isWeek) {
            queryClient.setQueryData(queryType, (oldData) => ([
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
            ]));
        } else {
            queryClient.setQueryData(queryType, (oldData) => ({
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
            }));
        }

        return { previousData };
    }

    const onDelete = async (eventId: number) => {
        const previousData = await getQueryClient();

        if (isWeek) {
            queryClient.setQueryData(queryType, (oldData) => ([
                ...oldData.map(weekDay => ({
                    ...weekDay,
                    days: weekDay.days.map((day) => ({
                        ...day,
                        events: day.events.filter((event) => event.id !== eventId),
                    })),
                })),
            ]));
        } else {
            queryClient.setQueryData(queryType, (oldData) => (
                {
                    ...oldData,
                    days: oldData.days.map((day) => ({
                        ...day,
                        events: day.events.filter((event) => event.id !== eventId),
                    })),
                }
            ));
        }

        return { previousData };
    };

    const onUpdate = async (payload: UpdatePayload) => {
        const previousData = await getQueryClient();
        const oldDay = payload.oldDay;
        const currentDay = payload.currentDay;

        console.log("MONTH", payload)
        if (isWeek) {
            if (oldDay && currentDay && oldDay.day !== currentDay.day) {
                queryClient.setQueryData(queryType, (oldData) => {
                    let currentEvent = null;
                    let currentDayFind = null;
                    let oldDayFind = null;

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
                            if (day.day === currentDay.day) {
                                currentDayFind = day;
                                currentDayFind.events.push({
                                    ...currentEvent,
                                    ...payload.data,
                                })
                            }
                        });
                    })

                    return [
                        ...oldData.map(weekDay => ({
                            ...weekDay,
                            days: weekDay.days.map((day) => {
                                if (day.day === currentDayFind.day) {
                                    return currentDayFind;
                                }

                                if (day.day === oldDayFind.day) {
                                    return oldDayFind;
                                }

                                return day;
                            }),
                        })),
                    ]
                })
            } else {
                queryClient.setQueryData(queryType, (oldData) => {
                    let e = null;

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
                                if (day.day === new Date(payload.data.start_date).getDate()) {
                                    day.events.unshift({
                                        ...e,
                                        ...payload.data,
                                    });
                                }

                                return day;
                            }),
                        })),
                    ]
                })
            }
        } else {
            if (oldDay && currentDay && oldDay.day !== currentDay.day) {
                queryClient.setQueryData(queryType, (oldData) => {
                    let currentEvent = null;
                    let currentDayFind = null;
                    let oldDayFind = null;

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
                        if (day.day === currentDay.day) {
                            currentDayFind = day;
                            currentDayFind.events.push({
                                ...currentEvent,
                                ...payload.data,
                            })
                        }
                    });

                    return {
                        ...oldData,
                        days: oldData.days.map((day) => {
                            if (day.day === currentDayFind.day) {
                                return currentDayFind;
                            }

                            if (day.day === oldDayFind.day) {
                                return oldDayFind;
                            }

                            return day;
                        }),
                    }
                })
            } else {
                queryClient.setQueryData(queryType, (oldData) => {
                    let e = null;

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
                            if (day.day === new Date(payload.data.start_date).getDate()) {
                                day.events.unshift({
                                    ...e,
                                    ...payload.data,
                                });
                            }

                            return day;
                        }),
                    }
                });
            }
        }

        return { previousData };
    };

    const {
        mutate: deleteEventHandler,
        isLoading: isDeleting,
    }: {
        mutate: (eventId: number) => void,
        isLoading: boolean,
    } = useMutation({
        mutationFn: (eventId: number) => fetch(deleteEvent(eventId)),
        onMutate: onDelete,
        onError,
    });

    const {
        mutate: updateEventHandler,
        isLoading: isUpdating,
    }: {
        mutate: (eventId: number, payload: UpdatePayload) => void,
        isLoading: boolean,
    } = useMutation({
        mutationFn: (payload: UpdatePayload) => fetch(updateEvent(payload.id, payload.data)),
        onMutate: onUpdate,
        onError,
    });

    const {
        mutate: createEventHandler,
        isLoading: isCreating,
    }: {
        mutate: (data: CreatePayload) => void,
        isLoading: boolean,
    } = useMutation({
        mutationFn: (data: CreatePayload) => fetch(createEvent(data)),
        onSuccess: onCreate,
        onError,
    });

    return {
        onCreate: createEventHandler,
        deleteEvent: deleteEventHandler,
        updateEvent: updateEventHandler,
        isDeleting,
        isUpdating,
        isCreating,
    }
};

export default useEvents;