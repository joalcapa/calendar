import axios from 'axios';
import BaseService from '../baseService';
import { Weather } from '../../types/weather';

export default class GetWeather extends BaseService {
  private wheater: Weather;
  private loc: string | null;
  private date: string | null;

  constructor(params: { location: string, date: string }) {
    super();
    this.wheater = { condition: '', temperature: '', icon: '' };
    this.loc = params.location;
    this.date = params.date;
  }

  public async call(): Promise<void> {
    if (!this.loc || !this.date) {
      this.setError("Faltan parámetros");
      return
    }

    const weatherUrl = process.env.WEATHER_URL;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!weatherUrl || !apiKey) {
      this.setError("Faltan parámetros");
      return
    }

    try {
      const response = await axios.get(weatherUrl, {
        params: {
          key: apiKey,
          q: this.loc,
          dt: this.date,
        },
      });

      const weatherData = response.data;
      const averageTemp = weatherData.forecast.forecastday[0].day.avgtemp_c;
      const condition = weatherData.forecast.forecastday[0].day.condition.text;
      const icon = weatherData.forecast.forecastday[0].day.condition.icon;

      this.wheater = {
        temperature: averageTemp,
        condition: condition,
        icon: icon.replace(/^\/\//, ''),
      };

    } catch (error) {
      console.log("Error en GetWeather:", error);
      this.setError("Error al obtener el clima");
    }
  }

  public getWeather(): Weather {
    return this.wheater;
  }
}