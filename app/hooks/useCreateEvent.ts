'use client'

import { useState, useMemo, useEffect, useCallback } from 'react';
import { TargetEvent, TargetCheckEvent, CreateEventProps } from "../types/types";
import { formatDateForInput, formatDateYYYYMMDD } from '../utils/utils';
import useWeather from "./useWeather";
import useEvents from "./useEvents";

/**
 * Custom hook to manage the creation of an event.
 *
 * @param props - The properties for creating an event.
 * @param props.onClose - Callback function to be called when the event creation is closed. Defaults to a no-op function.
 * @param props.isDelete - Boolean indicating if the event is being deleted. Defaults to false.
 * @param props.day - An object representing the day for which the event is being created.
 *
 * @returns The current state and functions to create an event.
 * @returns isLoading - Boolean indicating if the weather data is being loaded.
 * @returns isDelete - Boolean indicating if the event is being deleted.
 * @returns isCreating - Boolean indicating if the event is currently being created.
 * @returns title - The title of the event.
 * @returns city - The city associated with the event.
 * @returns description - The description of the event.
 * @returns startDate - The start date of the event in ISO format.
 * @returns isAllDay - Boolean indicating if the event is an all-day event.
 * @returns finishDate - The finish date of the event in ISO format.
 * @returns weather - The weather condition for the specified date and location.
 * @returns weatherUrl - The URL of the weather icon.
 * @returns isValidForm - Boolean indicating if the form is valid for submission.
 * @returns onClose - Function to close the event creation dialog.
 * @returns changeTitle - Function to handle changes to the event title.
 * @returns changeCity - Function to handle changes to the city input.
 * @returns changeDescription - Function to handle changes to the event description.
 * @returns changeStartDate - Function to handle changes to the start date.
 * @returns changeAllDay - Function to handle changes to the all-day checkbox.
 * @returns changeFinishDate - Function to handle changes to the finish date.
 * @returns setAllDay - Function to directly set the all-day status.
 * @returns onSend - Function to send the event creation request.
 * @returns changeWeather - Function to update the weather condition.
 * @returns changeWeatherUrl - Function to update the weather icon URL.
 */
const useCreateEvent = (props: CreateEventProps) => {
    const { onClose = () => { }, isDelete = false, day } = props;
    const [ isLoading, setLoading ] = useState(false);
    const [ title, setTitle ] = useState('');
    const [ weather, setWeather ] = useState('');
    const [ weatherUrl, setWeatherUrl ] = useState('');
    const [ city, setCity ] = useState('');
    const [ description, setDescription ] = useState('');
    const [ startDate, setStartDate ] = useState(formatDateForInput(day?.dayDate || new Date()));
    const [ isAllDay, setAllDay ] = useState(false);
    const [ finishDate, setFinishDate ] = useState(formatDateForInput(day?.dayDate || new Date()));
    const [ debouncedCity, setDebouncedCity ] = useState(city);
    const [ debouncedStartDate, setDebouncedStartDate ] = useState(startDate);
    const { getWeather } = useWeather();
    const { onCreate, isCreating, isSuccessCreate } = useEvents();

    useEffect(() => {
        if (isSuccessCreate) {
            setLoading(false);
            onClose();
        }
    }, [ isSuccessCreate ]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedCity(city);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [city]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedStartDate(startDate);
        }, 500);

        return () => {
            clearTimeout(handler);
        };
    }, [startDate]);

    useEffect(() => {
        if (debouncedCity && debouncedStartDate) {
            (async () => {
                try {
                    setLoading(true);

                    const response = await getWeather({ location: city, datetime: formatDateYYYYMMDD(startDate) });

                    if (response) {
                        const { condition, icon } = response;
                        setWeather(condition);
                        setWeatherUrl(icon);
                    }
                } catch { }

                setLoading(false);
            })();
        }
    }, [ debouncedCity, debouncedStartDate ]);

    const onSend = useCallback(async () => {
        try {
            if (isValidForm) {
                setLoading(true)

                await onCreate({
                    title,
                    description,
                    city,
                    weather,
                    weather_url: weatherUrl,
                    is_all_day: isAllDay,
                    start_date: new Date(startDate + "Z").toISOString(),
                    finish_date: new Date(finishDate + "Z").toISOString(),
                });
            }
        } catch { }
    }, [
        title,
        description,
        city,
        weather,
        weatherUrl,
        isAllDay,
        startDate,
        finishDate,
    ]);

    const changeTitle = (event: TargetEvent) => {
        setTitle(event.target.value);
    };

    const changeCity = (event: TargetEvent) => {
        setCity(event.target.value);
    };

    const changeDescription = (event: TargetEvent) => {
        setDescription(event.target.value);
    };

    const changeStartDate = (event: TargetEvent) => {
        if (isAllDay) {
            const originalDateString = event.target.value;
            const originalDate = new Date(originalDateString);
            originalDate.setUTCHours(7, 0);
            setStartDate(originalDate.toISOString().slice(0, 16));
        } else {
            setStartDate(event.target.value);
        }
    };

    const changeFinishDate = (event: TargetEvent) => {
        setFinishDate(event.target.value);
    };

    const changeAllDay = (event: TargetCheckEvent) => {
        setAllDay(event.target.checked);

        if (event.target.checked) {
            const originalDate = new Date(startDate);
            originalDate.setUTCHours(7, 0);
            setStartDate(originalDate.toISOString().slice(0, 16));

            const originalFinishDate = new Date(finishDate);
            originalFinishDate.setUTCHours(19, 0);
            setFinishDate(originalFinishDate.toISOString().slice(0, 16));
        }
    };

    const isValidForm = useMemo(() => {
        return !!title && !!description && !!city && !!startDate && (isAllDay ? true : !!finishDate);
    }, [title, description, city, startDate, isAllDay, finishDate]);

    return {
        isLoading,
        isDelete,
        isCreating,
        title,
        city,
        description,
        startDate,
        isAllDay,
        finishDate,
        weather,
        weatherUrl,
        isValidForm: isValidForm && !isLoading,
        onClose,
        changeTitle,
        changeCity,
        changeDescription,
        changeStartDate,
        changeAllDay,
        changeFinishDate,
        setAllDay,
        onSend,
        changeWeather: setWeather,
        changeWeatherUrl: setWeatherUrl,
    };
};

export default useCreateEvent;