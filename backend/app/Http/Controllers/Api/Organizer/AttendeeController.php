<?php

namespace App\Http\Controllers\Api\Organizer;

use App\Http\Controllers\Api\BaseController;
use App\Models\Attendee;
use Illuminate\Http\Request;

/**
 * Organizer Attendee Controller
 * 
 * Handles attendee listing and check-in functionality.
 */
class AttendeeController extends BaseController
{
    /**
     * List event attendees
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        $attendees = Attendee::whereHas('event.organizers', function ($query) {
            $query->where('user_id', auth()->user()->id);
        })
        ->when($request->event_id, fn($q) => $q->where('event_id', $request->event_id))
        ->with('user', 'event', 'ticket')
        ->get()
        ->map(fn($attendee) => [
            'id' => $attendee->id,
            'eventId' => $attendee->event_id,
            'name' => $attendee->user->name,
            'email' => $attendee->user->email,
            'ticketCode' => $attendee->ticket->code,
            'event' => $attendee->event->title,
            'purchaseDate' => $attendee->created_at->format('Y-m-d'),
            'status' => $attendee->status,
            'checkedInAt' => $attendee->checked_in_at?->format('Y-m-d H:i:s'),
        ]);

        return $this->success($attendees->all());
    }

    /**
     * Check-in attendee
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkIn($id)
    {
        $attendee = Attendee::find($id);

        if (!$attendee) {
            return $this->notFound('Attendee not found');
        }

        // Check authorization
        if (!$attendee->event->organizers()->where('user_id', auth()->user()->id)->exists()) {
            return $this->error('Unauthorized', [], 403);
        }

        $attendee->update([
            'status' => 'checked_in',
            'checked_in_at' => now(),
        ]);

        return $this->success([
            'id' => $attendee->id,
            'name' => $attendee->user->name,
            'status' => $attendee->status,
            'checkedInAt' => $attendee->checked_in_at->format('M d, Y h:i A'),
        ], 'Attendee checked in');
    }
}
