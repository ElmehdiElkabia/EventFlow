import axios from 'axios';
import { authStorage } from './authStorage';

export const AUTH_UNAUTHORIZED_EVENT = 'auth:unauthorized';

const resolveApiBaseUrl = () => {
  const configuredApiUrl = import.meta.env.VITE_API_URL;

  if (!configuredApiUrl) {
    throw new Error('VITE_API_URL is not defined.');
  }

  if (import.meta.env.PROD && configuredApiUrl.startsWith('http://')) {
    throw new Error('In production, VITE_API_URL must use HTTPS.');
  }

  return configuredApiUrl;
};

const sanitizeAxiosError = (error) => {
  const safeError = new Error(error.response?.data?.message || error.message || 'Request failed');
  safeError.name = 'ApiError';
  safeError.status = error.response?.status || null;
  safeError.code = error.code;

  if (error.response) {
    safeError.response = {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    };
  }

  return safeError;
};

const api = axios.create({
  baseURL: resolveApiBaseUrl(),
  withCredentials: true,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
  },
});

api.interceptors.request.use((config) => {
  // If sending FormData, remove Content-Type to let browser set it with boundary
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear cache and let UI decide if navigation is needed.
      authStorage.clearAuth();
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(AUTH_UNAUTHORIZED_EVENT));
      }
    }
    return Promise.reject(sanitizeAxiosError(error));
  }
);

export default api;
