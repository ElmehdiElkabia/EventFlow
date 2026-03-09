import api from './api';
import { authStorage } from './authStorage';
import { secureId, securePayload } from './serviceSecurity';
import { encryptAuthCredentials } from './encryption';

/**
 * Authentication Service
 * Handles login, logout, registration, and session management
 */

export const authService = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} API response with user data
   */
  login: async (email, password) => {
    const encrypted = await encryptAuthCredentials({ email, password });
    const response = await api.post('/auth/login', securePayload(encrypted));

    if (response.data?.user) {
      authStorage.setUser(response.data.user);
    }

    return response;
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} API response with user data
   */
  register: async (userData) => {
    const encrypted = await encryptAuthCredentials(userData);
    const response = await api.post('/auth/register', securePayload(encrypted));

    if (response.data?.user) {
      authStorage.setUser(response.data.user);
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
    } catch {
      console.error('Logout request failed');
    } finally {
      authStorage.clearAuth();
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
   * @returns {boolean} True if user cache exists
   */
  isAuthenticated: () => {
    return !!authStorage.getUser();
  },

  /**
   * Get current user from localStorage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: () => {
    return authStorage.getUser();
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
    return await api.post('/auth/forgot-password', securePayload({ email }));
  },

  /**
   * Reset password with token
   * @param {Object} data - Reset data (token, email, password, password_confirmation)
   * @returns {Promise} API response
   */
  resetPassword: async (data) => {
    const encrypted = await encryptAuthCredentials(data);
    return await api.post('/auth/reset-password', securePayload(encrypted));
  },

  /**
   * Verify email with token
   * @param {string} id - User ID
   * @param {string} hash - Verification hash
   * @returns {Promise} API response
   */
  verifyEmail: async (id, hash) => {
    return await api.get(`/auth/verify-email/${secureId(id, 'userId')}/${secureId(hash, 'hash')}`);
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data (name, email)
   * @returns {Promise} API response
   */
  updateProfile: async (data) => {
    return await api.patch('/auth/profile', securePayload(data));
  },

  /**
   * Update user password
   * @param {Object} data - Password data (current_password, new_password, new_password_confirmation)
   * @returns {Promise} API response
   */
  updatePassword: async (data) => {
    const encrypted = await encryptAuthCredentials(data);
    return await api.patch('/auth/password', securePayload(encrypted));
  },
};
