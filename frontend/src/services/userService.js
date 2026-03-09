import api from './api';
import { secureId, securePayload } from './serviceSecurity';

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
    return api.get(`/user/tickets/${secureId(id, 'ticketId')}`);
  },

  /**
   * Buy a ticket
   * @param {Object} data - Ticket purchase data
   * @returns {Promise} API response
   */
  buyTicket: (data) => {
    return api.post('/user/tickets/buy', securePayload(data));
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
    return api.patch('/user/profile', securePayload(data));
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
    return api.post('/user/reviews', securePayload(data));
  },

  /**
   * Get user notifications
   * @returns {Promise} API response
   */
  getNotifications: () => {
    return api.get('/user/notifications');
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise} API response
   */
  markNotificationAsRead: (id) => {
    return api.post(`/user/notifications/${secureId(id, 'notificationId')}/read`);
  },

  /**
   * Mark all notifications as read
   * @returns {Promise} API response
   */
  markAllNotificationsAsRead: () => {
    return api.post('/user/notifications/read-all');
  },

  /**
   * Update user settings
   * @param {Object} data - Settings data
   * @returns {Promise} API response
   */
  updateSettings: (data) => {
    return api.patch('/user/settings', securePayload(data));
  },
};
