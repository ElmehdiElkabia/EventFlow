import api from "./api";
import { secureId, securePayload } from './serviceSecurity';

const adminService = {
  /**
   * Get all events (for admin review)
   * @returns {Promise<Array>} Array of events with admin details
   */
  getEvents: async () => {
    try {
      const response = await api.get(`/admin/events`);
      return response?.data || [];
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Approve an event
   * @param {number} id - Event ID
   * @returns {Promise<Object>} Success response with event data
   */
  approveEvent: async (id) => {
    try {
      const response = await api.patch(`/admin/events/${secureId(id, 'eventId')}/approve`, {});
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Reject an event
   * @param {number} id - Event ID
   * @param {string} reason - Rejection reason (optional)
   * @returns {Promise<Object>} Success response with event data
   */
  rejectEvent: async (id, reason = "") => {
    try {
      const response = await api.patch(
        `/admin/events/${secureId(id, 'eventId')}/reject`,
        securePayload({ reason })
      );
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Get all categories
   * @returns {Promise<Array>} Array of categories
   */
  getCategories: async () => {
    try {
      const response = await api.get('/admin/categories');
      return response?.data || [];
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Create a new category
   * @param {Object} data - Category data (name, icon, description)
   * @returns {Promise<Object>} Created category
   */
  createCategory: async (data) => {
    try {
      const response = await api.post('/admin/categories', securePayload(data));
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Update a category
   * @param {number} id - Category ID
   * @param {Object} data - Category data to update
   * @returns {Promise<Object>} Updated category
   */
  updateCategory: async (id, data) => {
    try {
      const response = await api.patch(
        `/admin/categories/${secureId(id, 'categoryId')}`,
        securePayload(data)
      );
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Delete a category
   * @param {number} id - Category ID
   * @returns {Promise<Object>} Success response
   */
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/admin/categories/${secureId(id, 'categoryId')}`);
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Get all users
   * @returns {Promise<Array>} Array of users
   */
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response?.data || [];
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Update user role
   * @param {number} id - User ID
   * @param {string} role - New role (admin, organizer, attendee)
   * @returns {Promise<Object>} Updated user
   */
  updateUserRole: async (id, role) => {
    try {
      const response = await api.patch(
        `/admin/users/${secureId(id, 'userId')}/role`,
        securePayload({ role })
      );
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Suspend a user
   * @param {number} id - User ID
   * @param {string} reason - Suspension reason (optional)
   * @returns {Promise<Object>} Updated user
   */
  suspendUser: async (id, reason = null) => {
    try {
      const response = await api.patch(
        `/admin/users/${secureId(id, 'userId')}/suspend`,
        securePayload({ reason })
      );
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Activate a suspended user
   * @param {number} id - User ID
   * @returns {Promise<Object>} Updated user
   */
  activateUser: async (id) => {
    try {
      const response = await api.patch(`/admin/users/${secureId(id, 'userId')}/activate`);
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Send email to a user
   * @param {number} id - User ID
   * @param {Object} emailData - Email data (subject, message)
   * @returns {Promise<Object>} Success response
   */
  sendEmailToUser: async (id, emailData) => {
    try {
      const response = await api.post(
        `/admin/users/${secureId(id, 'userId')}/send-email`,
        securePayload(emailData)
      );
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Get all transactions
   * @returns {Promise<Array>} Array of transactions
   */
  getTransactions: async () => {
    try {
      const response = await api.get('/admin/transactions');
      return response?.data || [];
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Get transaction statistics
   * @returns {Promise<Object>} Transaction stats (totalRevenue, totalTransactions, avgOrderValue)
   */
  getTransactionStats: async () => {
    try {
      const response = await api.get('/admin/transactions/stats');
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Get all refund requests
   * @returns {Promise<Array>} Array of refund requests
   */
  getRefunds: async () => {
    try {
      const response = await api.get('/admin/refunds');
      return response?.data || [];
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Get refund statistics
   * @returns {Promise<Object>} Refund stats (pending, approved, rejected, totalAmount)
   */
  getRefundStats: async () => {
    try {
      const response = await api.get('/admin/refunds/stats');
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Approve a refund request
   * @param {string} id - Refund ID
   * @param {string} adminNotes - Admin notes (optional)
   * @returns {Promise<Object>} Updated refund
   */
  approveRefund: async (id, adminNotes = null) => {
    try {
      const response = await api.patch(
        `/admin/refunds/${secureId(id, 'refundId')}/approve`,
        securePayload({ admin_notes: adminNotes })
      );
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Reject a refund request
   * @param {string} id - Refund ID
   * @param {string} adminNotes - Rejection reason (required)
   * @returns {Promise<Object>} Updated refund
   */
  rejectRefund: async (id, adminNotes) => {
    try {
      const response = await api.patch(
        `/admin/refunds/${secureId(id, 'refundId')}/reject`,
        securePayload({ admin_notes: adminNotes })
      );
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },

  /**
   * Get analytics data
   * @returns {Promise<Object>} Analytics data (stats, charts, top events)
   */
  getAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response?.data || {};
    } catch (error) {
      console.error('Request failed');
      throw error;
    }
  },
};

export default adminService;
