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
                'organizerId' => $event->organizers->first()->id ?? null,
                'date' => $event->start_date->format('Y-m-d'),
                'startDate' => $event->start_date->format('Y-m-d H:i:s'),
                'location' => $event->location,
                'capacity' => $event->capacity,
                'ticketsSold' => $event->tickets->count(),
                'price' => $event->ticketTypes->first()->price ?? 0,
                'status' => $event->status,
                'submittedAt' => $event->created_at->format('Y-m-d'),
                'image' => $event->image_url ?? null,
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

        return $this->success([
            'id' => $event->id,
            'title' => $event->title,
            'status' => $event->status,
        ], 'Event approved successfully');
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

        return $this->success([
            'id' => $event->id,
            'title' => $event->title,
            'status' => $event->status,
        ], 'Event rejected');
    }
}
