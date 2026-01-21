<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\Event;

/**
 * Admin Event Controller
 * 
 * Handles event approval and rejection by admins.
 */
class AdminEventController extends BaseController
{
    /**
     * List all events (for admin)
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $events = Event::with('category', 'organizers', 'tickets')
            ->latest()
            ->get()
            ->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'organizer' => $event->organizers->first()->name ?? 'N/A',
                'date' => $event->date->format('M d, Y'),
                'location' => $event->location,
                'capacity' => $event->capacity,
                'ticketsSold' => $event->tickets->count(),
                'status' => $event->status,
                'created_at' => $event->created_at->format('M d, Y'),
            ]);

        return $this->success($events->all());
    }

    /**
     * Approve event
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return $this->notFound('Event not found');
        }

        $event->update(['status' => 'approved']);

        // Notify organizers
        foreach ($event->organizers as $organizer) {
            $organizer->notify(new \App\Notifications\EventApprovedNotification($event));
        }

        return $this->success([
            'id' => $event->id,
            'title' => $event->title,
            'status' => $event->status,
        ], 'Event approved');
    }

    /**
     * Reject event
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function reject($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return $this->notFound('Event not found');
        }

        $event->update(['status' => 'rejected']);

        // Notify organizers
        foreach ($event->organizers as $organizer) {
            $organizer->notify(new \App\Notifications\EventRejectedNotification($event));
        }

        return $this->success([
            'id' => $event->id,
            'title' => $event->title,
            'status' => $event->status,
        ], 'Event rejected');
    }
}
