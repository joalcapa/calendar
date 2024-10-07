/**
 * API configuration for event and weather endpoints.
 *
 * @module apiConfig
 */

export default {
  /**
   * Configuration for fetching all events.
   *
   * @type {Object}
   * @property {string} uri - The endpoint URI to fetch all events.
   * @property {string} method - The HTTP method used for the request.
   */
  getEvents: {
    uri: '/events',
    method: 'get',
  },

  /**
   * Configuration for fetching weather by location and date.
   *
   * @type {Object}
   * @property {string} uri - The endpoint URI to fetch weather.
   * @property {string} method - The HTTP method used for the request.
   */
  getWeather: {
    uri: '/weather?location=:location&date=:date',
    method: 'get',
  },

  /**
   * Configuration for fetching a specific event by ID.
   *
   * @type {Object}
   * @property {string} uri - The endpoint URI to fetch an event by ID.
   * @property {string} method - The HTTP method used for the request.
   */
  getEvent: {
    uri: '/events/:id',
    method: 'get',
  },

  /**
   * Configuration for deleting an event by ID.
   *
   * @type {Object}
   * @property {string} uri - The endpoint URI to delete an event by ID.
   * @property {string} method - The HTTP method used for the request.
   */
  deleteEvent: {
    uri: '/events/:id',
    method: 'delete',
  },

  /**
   * Configuration for updating an event by ID.
   *
   * @type {Object}
   * @property {string} uri - The endpoint URI to update an event by ID.
   * @property {string} method - The HTTP method used for the request.
   */
  updateEvent: {
    uri: '/events/:id',
    method: 'put',
  },

  /**
   * Configuration for creating a new event.
   *
   * @type {Object}
   * @property {string} uri - The endpoint URI to create a new event.
   * @property {string} method - The HTTP method used for the request.
   */
  createEvent: {
    uri: '/events',
    method: 'post',
  },
};
