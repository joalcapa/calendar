import { Location } from "@/types/location";
import endpoints from "@/app/config/endpoints";

export const getWeather = (params: Location) => {
  const endpoint = endpoints.getWeather;
  const { location, datetime } = params;

  return {
    ...endpoint,
    uri: endpoint.uri.replace(":location", location).replace(":date", datetime),
  }
};