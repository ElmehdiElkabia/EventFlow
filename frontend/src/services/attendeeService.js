import api from "./api";
import { secureId, secureParams } from './serviceSecurity';

export const attendeeService = {
  /**
   * Get attendees for the authenticated organizer. Optionally filter by eventId.
   */
  getAttendees: async (eventId) => {
    const response = await api.get("/organizer/attendees", {
      params: eventId ? secureParams({ event_id: eventId }) : {},
    });
    return response.data || [];
  },

  /**
   * Check in attendee by attendee ID.
   */
  checkInAttendee: async (attendeeId) => {
    const response = await api.patch(`/organizer/attendees/${secureId(attendeeId, 'attendeeId')}/checkin`);
    return response.data;
  },
};
