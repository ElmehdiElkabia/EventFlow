import api from "./api";

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
      console.error("Failed to fetch events:", error);
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
      const response = await api.patch(`/admin/events/${id}/approve`, {});
      return response?.data || {};
    } catch (error) {
      console.error("Failed to approve event:", error);
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
      const response = await api.patch(`/admin/events/${id}/reject`, { reason });
      return response?.data || {};
    } catch (error) {
      console.error("Failed to reject event:", error);
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
      console.error("Failed to fetch categories:", error);
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
      const response = await api.post('/admin/categories', data);
      return response?.data || {};
    } catch (error) {
      console.error("Failed to create category:", error);
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
      const response = await api.patch(`/admin/categories/${id}`, data);
      return response?.data || {};
    } catch (error) {
      console.error("Failed to update category:", error);
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
      const response = await api.delete(`/admin/categories/${id}`);
      return response?.data || {};
    } catch (error) {
      console.error("Failed to delete category:", error);
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
      console.error("Failed to fetch users:", error);
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
      const response = await api.patch(`/admin/users/${id}/role`, { role });
      return response?.data || {};
    } catch (error) {
      console.error("Failed to update user role:", error);
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
      console.error("Failed to fetch transactions:", error);
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
      console.error("Failed to fetch transaction stats:", error);
      throw error;
    }
  },
};

export default adminService;
