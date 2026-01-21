import api from './api';

/**
 * Authentication Service
 * Handles login, logout, registration, and session management
 */

export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} API response with token and user data
   */
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    
    // Store token and user in localStorage
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} API response with token and user data
   */
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
    // Store token and user in localStorage
    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  /**
   * Logout current user
   * @returns {Promise} API response
   */
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user');
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise} API response with user data
   */
  me: async () => {
    return await api.get('/auth/me');
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if user has token
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },
};
