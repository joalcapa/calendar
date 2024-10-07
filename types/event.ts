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
  created_at: Date;
  updated_at: Date;
}

export interface EventRequest {
  title: string;
  city: string;
  weather: string;
  weather_url: string;
  description: string;
  start_date: string;
  finish_date: string;
  is_all_day: boolean;
}