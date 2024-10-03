export interface Event {
  id: number;
  title: string;
  city: string;
  weather: string;
  weather_url: string;
  description: string;
  start_date: Date;
  finish_date: Date;
  is_all_day: boolean;
  createdAt: Date;
  updatedAt: Date;
}