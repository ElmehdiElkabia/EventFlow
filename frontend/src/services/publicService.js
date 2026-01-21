import api from './api';

/**
 * Public Event Service
 * Handles event listing and details for public pages
 */

export const eventService = {
  /**
   * Get all events (public)
   * @param {Object} params - Query parameters (page, category, limit)
   * @returns {Promise} API response
   */
  getEvents: (params = {}) => {
    return api.get('/events', { params });
  },

  /**
   * Get single event details
   * @param {string|number} id - Event ID
   * @returns {Promise} API response
   */
  getEvent: (id) => {
    return api.get(`/events/${id}`);
  },
};

export const categoryService = {
  /**
   * Get all categories with event counts
   * @returns {Promise} API response
   */
  getCategories: () => {
    return api.get('/categories');
  },
};
