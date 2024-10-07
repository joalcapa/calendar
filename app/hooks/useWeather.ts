import { Location } from '../../types/location';
import { getWeather } from '../../app/services/weather';
import useApi from '../../app/hooks/useApi';

/**
 * Custom hook to fetch weather data based on a given location.
 *
 * @returns An object containing a function to get weather data.
 * @returns getWeather - Function that accepts a location and retrieves the weather data.
 */
const useWeather = () => {
  const { fetch } = useApi();

  const getWeatherHandler = async (props: Location) => {
    try {
      const response = await fetch(getWeather(props));
      return response?.data;
    } catch { }
  };

  return {
    getWeather: getWeatherHandler,
  }
};

export default useWeather;