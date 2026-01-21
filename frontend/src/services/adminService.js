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
};

export default adminService;
