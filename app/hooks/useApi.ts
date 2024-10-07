import axios from 'axios';
import { useState } from 'react';
import { API_URL } from '../config/constants';

/**
 * Custom hook for handling API requests.
 *
 * @returns {Object} An object containing the loading state, error message, and fetch function.
 * @returns {boolean} isLoading - Indicates if the API request is in progress.
 * @returns {string | null} error - Error message if the request fails, otherwise null.
 * @returns {Function} fetch - Function to initiate an API request.
 */
const useApi = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches data from the API.
   *
   * @param {Object} params - The parameters for the API request.
   * @param {string} params.uri - The API endpoint URI.
   * @param {string} params.method - The HTTP method (GET, POST, etc.).
   * @param {unknown} [params.data] - Optional payload for the request.
   * @returns {Promise<AxiosResponse<any>>} The Axios response.
   */
  const fetch = async ({ uri, method, data }: { uri: string; method: string; data?: unknown }) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_URL}${uri}`;
      const headers = { 'Content-Type': 'application/json' };
      const payload = { method, url, data, headers };
      const response = await axios(payload);
      return response;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles errors that occur during the API request.
   *
   * @param {unknown} error - The error object.
   */
  const handleError = (error: unknown) => {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const errorMessage =
        axiosError.response?.data?.message || "Error desconocido";
    setError(errorMessage);
  };

  return {
    isLoading,
    error,
    fetch,
  };
};

export default useApi;
