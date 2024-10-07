import axios from 'axios';
import BaseService from '../baseService';
import { Weather } from '../../types/weather';

/**
 * A service class to fetch weather information based on a specified location and date.
 */
export default class GetWeather extends BaseService {
  /** The weather information fetched from the API. */
  private wheater: Weather;

  /** The location for which the weather is requested. */
  private loc: string | null;

  /** The date for which the weather is requested. */
  private date: string | null;

  /**
   * Creates an instance of the GetWeather service.
   *
   * @param params - The parameters required for the weather request.
   * @param params.location - The location for which to get the weather.
   * @param params.date - The date for which to get the weather (in YYYY-MM-DD format).
   */
  constructor(params: { location: string, date: string }) {
    super();
    this.wheater = { condition: '', temperature: '', icon: '' };
    this.loc = params.location;
    this.date = params.date;
  }

  /**
   * Fetches the weather information from the weather API.
   *
   * @returns A promise that resolves when the weather data is fetched or an error is set.
   */
  public async call(): Promise<void> {
    if (!this.loc || !this.date) {
      this.setError("Faltan parámetros");
      return;
    }

    const weatherUrl = process.env.WEATHER_URL;
    const apiKey = process.env.WEATHER_API_KEY;

    if (!weatherUrl || !apiKey) {
      this.setError("Faltan parámetros");
      return;
    }

    try {
      const dataWeather = {
        params: {
          key: apiKey,
          q: this.loc,
          dt: this.date,
        },
      };

      const response = await axios.get(weatherUrl, dataWeather);

      const weatherData = response.data;
      const averageTemp = weatherData.forecast.forecastday[0].day.avgtemp_c;
      const condition = weatherData.forecast.forecastday[0].day.condition.text;
      const icon = weatherData.forecast.forecastday[0].day.condition.icon;

      this.wheater = {
        temperature: averageTemp,
        condition: condition,
        icon: icon.replace(/^\/\//, ''),
      };

    } catch {
      this.setError("Error al obtener el clima");
    }
  }

  /**
   * Gets the fetched weather information.
   *
   * @returns The weather information as a Weather object.
   */
  public getWeather(): Weather {
    return this.wheater;
  }
}
