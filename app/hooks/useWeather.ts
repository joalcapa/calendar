import { Location } from '../../types/location';
import { getWeather } from '../../app/services/weather';
import useApi from '../../app/hooks/useApi';

const useWeather = () => {
  const { fetch } = useApi();

  const getWeatherHandler = async (props: Location) => {
    try {
      const response = await fetch(getWeather(props));
      console.log(response);
      return response?.data;
    } catch { }
  };

  return {
    getWeather: getWeatherHandler,
  }
};

export default useWeather;