/**
 * Represents a location associated with an event.
 */
export interface Location {
  /** The name or description of the location. */
  location: string;

  /** The date and time associated with the location in ISO 8601 format. */
  datetime: string;
}
