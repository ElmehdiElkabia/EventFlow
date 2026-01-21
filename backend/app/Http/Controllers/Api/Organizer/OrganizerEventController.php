<?php

namespace App\Http\Controllers\Api\Organizer;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\Organizer\StoreEventRequest;
use App\Http\Requests\Api\Organizer\UpdateEventRequest;
use App\Models\Event;

/**
 * Organizer Event Controller
 * 
 * Handles event creation, listing, updating, and deletion for organizers.
 */
class OrganizerEventController extends BaseController
{
    /**
     * List organizer's events
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $events = auth()->user()
            ->organizedEvents()
            ->with('category', 'tickets', 'ticketTypes')
            ->latest()
            ->get()
            ->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'date' => $event->start_date->format('M d, Y'),
                'location' => $event->location,
                'capacity' => $event->capacity,
                'ticketsSold' => $event->tickets->count(),
                'price' => $event->ticketTypes->min('price') ?? 0,
                'status' => $event->status,
                'image' => $event->image_url,
            ]);

        return $this->success($events->all());
    }

    /**
     * Create new event
     * 
     * @param StoreEventRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreEventRequest $request)
    {
        $event = Event::create([
            'title' => $request->title,
            'slug' => \Str::slug($request->title),
            'description' => $request->description,
            'start_date' => $request->date,
            'end_date' => $request->end_date,
            'location' => $request->location,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'capacity' => $request->capacity,
            'image_url' => $request->image,
            'category_id' => $request->category_id,
            'status' => 'pending_approval',
        ]);

        // Attach organizer
        $event->organizers()->attach(auth()->user()->id);

        // Create ticket types if provided
        if ($request->has('ticket_types')) {
            foreach ($request->ticket_types as $type) {
                $event->ticketTypes()->create([
                    'name' => $type['name'],
                    'price' => $type['price'],
                    'quantity' => $type['quantity'],
                ]);
            }
        }

        return $this->success([
            'id' => $event->id,
            'title' => $event->title,
            'status' => $event->status,
            'message' => 'Event created successfully. Awaiting admin approval.',
        ], 'Event created', 201);
    }

    /**
     * Update event
     * 
     * @param UpdateEventRequest $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateEventRequest $request, $id)
    {
        $event = Event::find($id);

        if (!$event) {
            return $this->notFound('Event not found');
        }

        // Check authorization
        if (!$event->organizers()->where('user_id', auth()->user()->id)->exists()) {
            return $this->error('Unauthorized', [], 403);
        }

        $event->update($request->validated());

        return $this->success([
            'id' => $event->id,
            'title' => $event->title,
            'status' => $event->status,
        ], 'Event updated');
    }

    /**
     * Delete event
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $event = Event::find($id);

        if (!$event) {
            return $this->notFound('Event not found');
        }

        // Check authorization
        if (!$event->organizers()->where('user_id', auth()->user()->id)->exists()) {
            return $this->error('Unauthorized', [], 403);
        }

        $event->delete();

        return $this->success(null, 'Event deleted');
    }
}
