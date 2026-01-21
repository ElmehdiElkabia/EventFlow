<?php

namespace App\Http\Controllers\Api\Organizer;

use App\Http\Controllers\Api\BaseController;
use App\Models\Attendee;

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
    public function index()
    {
        $attendees = Attendee::whereHas('event.organizers', function ($query) {
            $query->where('user_id', auth()->user()->id);
        })
        ->with('user', 'event', 'ticket')
        ->get()
        ->map(fn($attendee) => [
            'id' => $attendee->id,
            'name' => $attendee->user->name,
            'email' => $attendee->user->email,
            'ticketCode' => $attendee->ticket->code,
            'event' => $attendee->event->title,
            'purchaseDate' => $attendee->created_at->format('M d, Y'),
            'status' => $attendee->status,
            'checkedInAt' => $attendee->checked_in_at?->format('M d, Y h:i A'),
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
