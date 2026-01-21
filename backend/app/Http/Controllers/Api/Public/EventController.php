<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Api\BaseController;
use App\Models\Event;
use App\Models\Review;

/**
 * Public Event Controller
 * 
 * Handles public event browsing (list and detail views).
 * Returns frontend-formatted event data.
 */
class EventController extends BaseController
{
    /**
     * List all approved events
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $events = Event::where('status', 'approved')
            ->with('category', 'organizers', 'tickets', 'reviews')
            ->paginate(15);

        $formatted = $events->map(fn($event) => $this->formatEvent($event))->all();

        return $this->success([
            'data' => $formatted,
            'pagination' => [
                'total' => $events->total(),
                'per_page' => $events->perPage(),
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
            ],
        ]);
    }

    /**
     * Show event detail
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $event = Event::with('category', 'organizers', 'tickets', 'reviews.user', 'ticketTypes', 'announcements')
            ->find($id);

        if (!$event) {
            return $this->notFound('Event not found');
        }

        if ($event->status !== 'approved') {
            return $this->notFound('Event not found');
        }

        $avgRating = $event->reviews()->avg('rating') ?? 0;
        $reviewCount = $event->reviews()->count();

        return $this->success([
            'id' => $event->id,
            'title' => $event->title,
            'description' => $event->description,
            'date' => $event->date->format('M d, Y'),
            'time' => $event->date->format('h:i A'),
            'location' => $event->location,
            'address' => $event->address,
            'latitude' => $event->latitude,
            'longitude' => $event->longitude,
            'capacity' => $event->capacity,
            'image' => $event->image,
            'category' => [
                'id' => $event->category->id,
                'name' => $event->category->name,
            ],
            'organizers' => $event->organizers->map(fn($org) => [
                'id' => $org->id,
                'name' => $org->name,
            ])->all(),
            'highlights' => [
                'capacity' => $event->capacity,
                'attendees' => $event->tickets()->count(),
                'rating' => round($avgRating, 1),
                'reviews' => $reviewCount,
            ],
            'ticketTypes' => $event->ticketTypes->map(fn($type) => [
                'id' => $type->id,
                'name' => $type->name,
                'price' => $type->price,
                'quantity' => $type->quantity,
                'sold' => $event->tickets()->where('ticket_type_id', $type->id)->count(),
            ])->all(),
            'reviews' => $event->reviews->map(fn($review) => [
                'id' => $review->id,
                'author' => $review->user->name,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'date' => $review->created_at->format('M d, Y'),
            ])->all(),
        ]);
    }

    /**
     * Format event for listing
     * 
     * @param Event $event
     * @return array
     */
    private function formatEvent(Event $event): array
    {
        $avgRating = $event->reviews->avg('rating') ?? 0;

        return [
            'id' => $event->id,
            'title' => $event->title,
            'description' => substr($event->description, 0, 100) . '...',
            'date' => $event->date->format('M d, Y'),
            'time' => $event->date->format('h:i A'),
            'location' => $event->location,
            'price' => $event->ticketTypes->min('price') ?? 0,
            'image' => $event->image,
            'category' => [
                'id' => $event->category->id,
                'name' => $event->category->name,
            ],
            'attendees' => $event->tickets->count(),
            'capacity' => $event->capacity,
            'rating' => round($avgRating, 1),
            'featured' => false, // Can be set based on business logic
        ];
    }
}
