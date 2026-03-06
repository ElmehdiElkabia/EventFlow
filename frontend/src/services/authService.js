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
    
    // Store token and user in localStorage (response already unwrapped by interceptor)
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
    
    // Store token and user in localStorage (response already unwrapped by interceptor)
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

  /**
   * Resend email verification
   * @returns {Promise} API response
   */
  resendVerification: async () => {
    return await api.post('/auth/resend-verification');
  },

  /**
   * Send password reset link
   * @param {string} email - User email
   * @returns {Promise} API response
   */
  forgotPassword: async (email) => {
    return await api.post('/auth/forgot-password', { email });
  },

  /**
   * Reset password with token
   * @param {Object} data - Reset data (token, email, password, password_confirmation)
   * @returns {Promise} API response
   */
  resetPassword: async (data) => {
    return await api.post('/auth/reset-password', data);
  },

  /**
   * Verify email with token
   * @param {string} id - User ID
   * @param {string} hash - Verification hash
   * @returns {Promise} API response
   */
  verifyEmail: async (id, hash) => {
    return await api.get(`/auth/verify-email/${id}/${hash}`);
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data (name, email)
   * @returns {Promise} API response
   */
  updateProfile: async (data) => {
    return await api.patch('/auth/profile', data);
  },

  /**
   * Update user password
   * @param {Object} data - Password data (current_password, new_password, new_password_confirmation)
   * @returns {Promise} API response
   */
  updatePassword: async (data) => {
    return await api.patch('/auth/password', data);
  },
};
