import api from './api';

/**
 * User Service
 * Handles user-specific operations (tickets, profile, reviews, etc.)
 */

export const ticketService = {
  /**
   * Get user's purchased tickets
   * @returns {Promise} API response
   */
  getMyTickets: () => {
    return api.get('/user/tickets');
  },

  /**
   * Get single ticket details
   * @param {string|number} id - Ticket ID
   * @returns {Promise} API response
   */
  getTicket: (id) => {
    return api.get(`/user/tickets/${id}`);
  },

  /**
   * Buy a ticket
   * @param {Object} data - Ticket purchase data
   * @returns {Promise} API response
   */
  buyTicket: (data) => {
    return api.post('/user/tickets/buy', data);
  },
};

export const userService = {
  /**
   * Get user profile
   * @returns {Promise} API response
   */
  getProfile: () => {
    return api.get('/user/profile');
  },

  /**
   * Update user profile
   * @param {Object} data - Profile data
   * @returns {Promise} API response
   */
  updateProfile: (data) => {
    return api.patch('/user/profile', data);
  },

  /**
   * Get user reviews
   * @returns {Promise} API response
   */
  getReviews: () => {
    return api.get('/user/reviews');
  },

  /**
   * Create a review
   * @param {Object} data - Review data
   * @returns {Promise} API response
   */
  createReview: (data) => {
    return api.post('/user/reviews', data);
  },

  /**
   * Get user notifications
   * @returns {Promise} API response
   */
  getNotifications: () => {
    return api.get('/user/notifications');
  },

  /**
   * Update user settings
   * @param {Object} data - Settings data
   * @returns {Promise} API response
   */
  updateSettings: (data) => {
    return api.patch('/user/settings', data);
  },
};
