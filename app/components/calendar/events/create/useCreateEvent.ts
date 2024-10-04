'use client'

import {useState, useMemo, useEffect, useCallback} from 'react';
import { TargetEvent, TargetCheckEvent, CreateEventProps } from "@/app/types/types";
import useCreateEventHook from "../../../../../app/hooks/useCreateEvent";
import { Event } from "../../../../../types/event";
import { Day } from '../../../../../types/month';
import { formatDateForInput, formatDateYYYYMMDD } from '../../../../../app/utils/utils';
import useWeather from "../../../../../app/hooks/useWeather";

const useCreateEvent = (props: CreateEventProps) => {
  const { onClose = () => { }, isDelete = false, onCreateEvent = () => {}, day } = props;
  const [title, setTitle] = useState('');
  const [weather, setWeather] = useState('');
  const [weatherUrl, setWeatherUrl] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(formatDateForInput(day?.dayDate || new Date()));
  const [isAllDay, setAllDay] = useState(false);
  const [finishDate, setFinishDate] = useState(formatDateForInput(day?.dayDate || new Date()));
  const [debouncedCity, setDebouncedCity] = useState(city);
  const [debouncedStartDate, setDebouncedStartDate] = useState(startDate);
  const { createEvent } = useCreateEventHook();
  const { getWeather } = useWeather();

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
          const response = await getWeather({ location: city, datetime: formatDateYYYYMMDD(startDate) });
          if (response) {
            const { condition, icon } = response;
            setWeather(condition);
            setWeatherUrl(icon);
          }
        } catch { }
      })();
    }
  }, [debouncedCity, debouncedStartDate]);

  const onCreate = useCallback(async () => {
    if (isValidForm) {
      try {
        if (isValidForm) {
          const payload = {
            title,
            description,
            city,
            weather,
            weather_url: weatherUrl,
            is_all_day: isAllDay,
            start_date: new Date(startDate + "Z").toISOString(),
            finish_date: new Date(finishDate + "Z").toISOString(),
          };

          const eventUpdated: Event | null = await createEvent(payload);
          if (eventUpdated) {
            onCreateEvent(eventUpdated);
          }
        }
      } catch { }
    }
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
    }
  };

  const isValidForm = useMemo(() => {
    return !!title && !!description && !!city && !!startDate && (isAllDay ? true : !!finishDate);
  }, [title, description, city, startDate, isAllDay, finishDate]);

  return {
    isDelete,
    title,
    city,
    description,
    startDate,
    isAllDay,
    finishDate,
    weather,
    weatherUrl,
    onClose,
    changeTitle,
    changeCity,
    changeDescription,
    changeStartDate,
    changeAllDay,
    changeFinishDate,
    isValidForm,
    setAllDay,
    onCreate,
    changeWeather: setWeather,
    changeWeatherUrl: setWeatherUrl,
  };
};

export default useCreateEvent;