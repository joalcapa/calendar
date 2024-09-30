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

export const updateEvent = (id: number, data: Event) => {
  const endpoint = endpoints.updateEvent;

  return {
    ...endpoint,
    uri: endpoint.uri.replace(":id", id.toString()),
    data,
  }
}

export const getEvents = () => {
  return endpoints.getEvents;
};