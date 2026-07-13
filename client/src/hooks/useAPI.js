import { useState, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : '/api';

export const useAPI = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (endpoint, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: 'include',
        ...options,
        headers,
      });

      const contentType = response.headers.get('content-type');
      let data = {};

      if (contentType && contentType.includes('application/json')) {
        const text = await response.text();
        data = text ? JSON.parse(text) : {};
      } else {
        const text = await response.text();
        data = { message: text || 'Empty or non-JSON response received' };
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || 'API Request Failed');
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { request, loading, error, setError };
};
