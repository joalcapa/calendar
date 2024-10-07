import { ENV, API_URLS } from "./env";

/**
 * The base API URL based on the current environment.
 *
 * This URL is selected from the `API_URLS` object based on the `ENV` variable,
 * which indicates the current environment (development, production, etc.).
 */
export const API_URL = API_URLS[ENV];

/**
 * The request type string for fetching events.
 *
 * This constant is used to identify the type of request when interacting with
 * the events API endpoint.
 */
export const EVENTS_RQ = "events";

/**
 * The request type string for fetching events for a week.
 *
 * This constant is used to specify that the request pertains to week-long events.
 */
export const EVENTS_WEEK_RQ = "week";
