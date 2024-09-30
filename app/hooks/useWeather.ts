import { useState } from 'react';
import { Location } from '@/types/location';
import { Weather } from '@/types/weather';
import { getWeather } from '@/app/services/weather';
import useApi from '@/app/hooks/useApi';

const useWeather = () => {
  const { fetch } = useApi();
  const [weather, setWeather] = useState<Weather | null>(null)

  const getWeatherHandler = async (props: Location) => {
    try {
      const response = await fetch(getWeather(props));
      const data: Weather = response?.data;
      if (data) { setWeather(data); }
    } catch { }
  };

  return {
    weather,
    getWeather: getWeatherHandler,
  }
};

export default useWeather;