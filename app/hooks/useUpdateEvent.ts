'use client'

import { useEffect } from "react";
import { Event } from "../../types/event";
import { formatDateForInput } from '../utils/utils';
import useCreateEvent from "./useCreateEvent";
import useEvents from "./useEvents";

interface UpdateEventProps {
    event: Event,
    isVisible: boolean,
    onClose: () => void,
}

/**
 * Custom hook to manage the update and deletion of an event.
 *
 * @param props - The properties required for the update event functionality.
 * @param props.event - The event object that contains details to update.
 * @param props.isVisible - Boolean indicating if the update modal is visible.
 * @param props.onClose - Function to call when closing the update modal.
 *
 * @returns An object containing methods and state for updating or deleting an event.
 * @returns isLoading - Indicates whether an update or delete operation is in progress.
 * @returns error - Contains error messages if any operation fails.
 * @returns onSend - Function to call to update the event.
 * @returns onDelete - Function to call to delete the event.
 * @returns onClose - Function to call to close the modal.
 * @returns ...hook - Other state and methods from the create event hook.
 */
const useUpdateEvent = (props: UpdateEventProps) => {
    const { event, onClose } = props;
    const { deleteEvent, updateEvent } = useEvents();
    const hook = useCreateEvent({ onClose, isDelete: true });

    const {
        isValidForm,
        title,
        description,
        startDate,
        isAllDay,
        finishDate,
        city,
        weather,
        weatherUrl,
        changeTitle,
        changeDescription,
        changeStartDate,
        setAllDay,
        changeFinishDate,
        changeCity,
        changeWeather,
        changeWeatherUrl,
    } = hook;

    useEffect(() => {
        let isMounted = true;

        if (isMounted) {
            setAllDay(event.is_all_day)
            changeTitle({ target: { value: event.title }});
            changeDescription({ target: { value: event.description }});
            changeStartDate({ target: { value: formatDateForInput(event.start_date) }});
            changeFinishDate({ target: { value: formatDateForInput(event.finish_date) }});
            changeCity({ target: { value: event.city }})

            if (event.weather) {
                changeWeather(event.weather);
            }

            if (event.weather_url) {
                changeWeatherUrl(event.weather_url);
            }

            isMounted = false;
        }

        return () => {
            isMounted = false;
        }
    }, []);

    const onUpdate = async () => {
        try {
            if (isValidForm) {
                await updateEvent({
                    id: event.id,
                    data: {
                        title,
                        description,
                        city,
                        weather,
                        weather_url: weatherUrl,
                        is_all_day: isAllDay,
                        start_date: new Date(startDate + "Z").toISOString(),
                        finish_date: new Date(finishDate + "Z").toISOString(),
                    },
                })

                onClose();
            }
        } catch { }
    };

    const onDelete = async () => {
        try {
            await deleteEvent(event.id);
            onClose();
        } catch { }
    };

    return {
        ...hook,
        isLoading: false,
        error: '',
        onSend: onUpdate,
        onDelete,
        onClose,
    };
};

export default useUpdateEvent;