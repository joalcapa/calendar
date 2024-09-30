import axios from 'axios';
import { useState } from 'react';
import { API_URL } from '../config/constants';

export default () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = async ({ uri, method, data }: { uri: string; method: string; data?: any }) => {
    setLoading(true);
    setError(null);

    try {
      const url = `${API_URL}${uri}`;
      const response = await axios({ method, url, data });
      return response;
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false)
    }
  };

  const handleError = (error: any) => {
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