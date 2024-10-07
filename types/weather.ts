/**
 * Represents the weather conditions.
 */
export interface Weather {
  /** The temperature, typically represented as a string (e.g., "25°C" or "77°F"). */
  temperature: string;

  /** The current weather condition (e.g., "Sunny", "Rainy", "Cloudy"). */
  condition: string;

  /** The URL or path to an icon representing the weather condition. */
  icon: string;
}
