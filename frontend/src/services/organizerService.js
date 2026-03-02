import api from './api';

/**
 * Organizer Service
 * Handles organizer-specific event operations.
 */
export const organizerService = {
  /**
   * List events for the authenticated organizer.
   */
  getMyEvents: () => api.get('/organizer/events'),

  /**
   * Get a single event by ID.
   */
  getEvent: (id) => api.get(`/organizer/events/${id}`),

  /**
   * Create a new event.
   */
  createEvent: (data) => api.post('/organizer/events', data),

  /**
   * Update an existing event.
   */
  updateEvent: (id, data) => api.patch(`/organizer/events/${id}`, data),

  /**
   * Delete an event.
   */
  deleteEvent: (id) => api.delete(`/organizer/events/${id}`),

  /**
   * Send announcement to event attendees.
   */
  sendAnnouncement: (data) => api.post('/organizer/announcements', data),

  /**
   * Get sales overview for organizer.
   */
  getSalesOverview: () => api.get('/organizer/sales'),

  /**
   * Get transactions for organizer.
   */
  getTransactions: () => api.get('/organizer/transactions'),
};
