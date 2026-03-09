import api from './api';
import { secureId, secureParams } from './serviceSecurity';

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
    return api.get('/events', { params: secureParams(params) });
  },

  /**
   * Get single event details
   * @param {string|number} id - Event ID
   * @returns {Promise} API response
   */
  getEvent: (id) => {
    return api.get(`/events/${secureId(id, 'eventId')}`);
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
