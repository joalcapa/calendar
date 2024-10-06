import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EVENTS_RQ } from "../config/constants";
import { Event} from "../../types/event";
import { deleteEvent, updateEvent, createEvent } from '../../app/services/event';
import useApi from "../hooks/useApi";

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
}

const useEvents = ({ path, RQTypes, dayNumber } : { path: string, RQTypes: string, dayNumber?: number }) => {
    const queryClient = useQueryClient();
    const { fetch } = useApi();
    const queryType = [ RQTypes || EVENTS_RQ, path ];

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

        queryClient.setQueryData(queryType, (oldData) => ({
            ...oldData,
            days: (dayNumber ? oldData.days[dayNumber] : oldData.days).map((day) => {
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

        return { previousData };
    }

    const onDelete = async (eventId: number) => {
        const previousData = await getQueryClient();

        queryClient.setQueryData(queryType, (oldData) => (
            {
                ...oldData,
                days: (dayNumber ? oldData.days[dayNumber] : oldData.days).map((day) => ({
                    ...day,
                    events: day.events.filter((event) => event.id !== eventId),
                })),
            }
        ));

        return { previousData };
    };

    const onUpdate = async (payload: UpdatePayload) => {
        const previousData = await getQueryClient();

        queryClient.setQueryData(queryType, (oldData) => ({
            ...oldData,
            days: (dayNumber ? oldData.days[dayNumber] : oldData.days).map((day) => ({
                ...day,
                events: day.events.map((event) => {
                    if (event.id === payload.id) {
                        return {
                            ...event,
                            ...payload.data,
                        }
                    }

                    return event;
                }),
            })),
        }));

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