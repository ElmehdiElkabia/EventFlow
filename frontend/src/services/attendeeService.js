import api from "./api";

export const attendeeService = {
  /**
   * Get attendees for the authenticated organizer. Optionally filter by eventId.
   */
  getAttendees: async (eventId) => {
    const response = await api.get("/organizer/attendees", {
      params: eventId ? { event_id: eventId } : {},
    });
    return response.data || [];
  },

  /**
   * Check in attendee by attendee ID.
   */
  checkInAttendee: async (attendeeId) => {
    const response = await api.patch(`/organizer/attendees/${attendeeId}/checkin`);
    return response.data;
  },
};
