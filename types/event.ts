/**
 * Represents an event in the application.
 */
export interface Event {
  /** The unique identifier for the event. */
  id: number;

  /** The title of the event. */
  title: string;

  /** The city where the event takes place. */
  city: string;

  /** The weather conditions for the event. */
  weather: string;

  /** A URL linking to more detailed weather information. */
  weather_url: string;

  /** A description of the event. */
  description: string;

  /** The start date and time of the event. */
  start_date: Date;

  /** The end date and time of the event. */
  finish_date: Date;

  /** Indicates whether the event lasts all day. */
  is_all_day: boolean;

  /** The date and time when the event was created. */
  created_at: Date;

  /** The date and time when the event was last updated. */
  updated_at: Date;
}

/**
 * Represents a request to create or update an event in the application.
 */
export interface EventRequest {
  /** The title of the event. */
  title: string;

  /** The city where the event takes place. */
  city: string;

  /** The weather conditions for the event. */
  weather: string;

  /** A URL linking to more detailed weather information. */
  weather_url: string;

  /** A description of the event. */
  description: string;

  /** The start date and time of the event in ISO 8601 format. */
  start_date: string;

  /** The end date and time of the event in ISO 8601 format. */
  finish_date: string;

  /** Indicates whether the event lasts all day. */
  is_all_day: boolean;
}