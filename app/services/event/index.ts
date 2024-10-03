import endpoints from "@/app/config/endpoints";
import { Event } from "@/types/event";

export const getEvent = (id: number) => {
  const endpoint = endpoints.getEvent;

  return {
    ...endpoint,
    uri: endpoint.uri.replace(":id", id.toString()),
  }
};

export const deleteEvent = (id: number) => {
  const endpoint = endpoints.deleteEvent;

  return {
    ...endpoint,
    uri: endpoint.uri.replace(":id", id.toString()),
  }
};

export const updateEvent = (id: number, data: {
  title: string,
  city: string;
  weather: string;
  weather_url: string;
  description: string,
  is_all_day: boolean,
  start_date: string,
  finish_date: string,
}) => {
  const endpoint = endpoints.updateEvent;

  return {
    ...endpoint,
    uri: endpoint.uri.replace(":id", id.toString()),
    data,
  }
};

export const getEvents = () => {
  return endpoints.getEvents;
};

export const createEvent = (data: {
  title: string,
  city: string;
  weather: string;
  weather_url: string;
  description: string,
  is_all_day: boolean,
  start_date: string,
  finish_date: string,
}) => {
  return {
    ...endpoints.createEvent,
    data,
  }
};