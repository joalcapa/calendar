import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Event } from "../../types/event";
import { Day } from '../../types/month';
import useApi from "../hooks/useApi";
import useEventsPath from "@/app/hooks/useEventsPath";
import {
    deleteEvent as deleteEventService,
    updateEvent as updateEventService,
    createEvent as createEventService,
} from '../../app/services/event';
import {
    createEventOnWeek,
    createEvent,
    deleteEventOnWeek,
    deleteEvent,
    updateEvent,
    updateEventOnWeek,
    updateEventWithDifferentDays,
    updateEventWithDifferentDaysOnWeek,
} from '../lib/eventUtils';

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

export interface UpdatePayload {
    id: number,
    data: CreatePayload,
    oldDay?: Day,
    currentDay?: Day,
}

/**
 * Custom hook to manage events, including creation, update, and deletion.
 *
 * @returns An object containing event management functions and their loading states.
 * @returns onCreate - Function to create a new event.
 * @returns deleteEvent - Function to delete an existing event.
 * @returns updateEvent - Function to update an existing event.
 * @returns isDeleting - Boolean indicating if a delete operation is in progress.
 * @returns isUpdating - Boolean indicating if an update operation is in progress.
 * @returns isCreating - Boolean indicating if a create operation is in progress.
 */
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

        queryClient.setQueryData(queryType, isWeek ? createEventOnWeek(event) : createEvent(event));

        return { previousData };
    }

    const onDelete = async (eventId: number) => {
        const previousData = await getQueryClient();

        queryClient.setQueryData(queryType, isWeek ? deleteEventOnWeek(eventId) : deleteEvent(eventId));

        return { previousData };
    };

    const onUpdate = async (payload: UpdatePayload) => {
        const previousData = await getQueryClient();
        const oldDay = payload.oldDay;
        const currentDay = payload.currentDay;

        if (isWeek) {
            if (oldDay && currentDay && oldDay.day !== currentDay.day) {
                queryClient.setQueryData(queryType, updateEventWithDifferentDaysOnWeek(oldDay, currentDay, payload));
            } else {
                queryClient.setQueryData(queryType, updateEventOnWeek(payload))
            }
        } else {
            if (oldDay && currentDay && oldDay.day !== currentDay.day) {
                queryClient.setQueryData(queryType, updateEventWithDifferentDays(oldDay, currentDay, payload))
            } else {
                queryClient.setQueryData(queryType, updateEvent(payload));
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
        mutationFn: (eventId: number) => fetch(deleteEventService(eventId)),
        onMutate: onDelete,
        onError,
    });

    const {
        mutate: updateEventHandler,
        isLoading: isUpdating,
    }: {
        mutate: (payload: UpdatePayload) => void,
        isLoading: boolean,
    } = useMutation({
        mutationFn: (payload: UpdatePayload) => fetch(updateEventService(payload.id, payload.data)),
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
        mutationFn: (data: CreatePayload) => fetch(createEventService(data)),
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