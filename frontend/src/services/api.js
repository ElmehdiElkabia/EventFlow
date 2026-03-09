import axios from 'axios';
import { authStorage } from './authStorage';

const FALLBACK_API_URL = 'http://localhost:8000/api';

const resolveApiBaseUrl = () => {
  const configuredApiUrl = import.meta.env.VITE_API_URL || FALLBACK_API_URL;

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
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Cache-Control': 'no-store',
    'Pragma': 'no-cache',
  },
  // Use HttpOnly cookie-based auth.
  withCredentials: true,
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
      // Unauthorized - clear token and redirect to login
      authStorage.clearAuth();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(sanitizeAxiosError(error));
  }
);

export default api;
