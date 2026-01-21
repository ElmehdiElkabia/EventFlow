<?php

namespace App\Http\Controllers\Api;

use App\Models\Event;
use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Http\Resources\EventResource;

class EventController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::with('category')->paginate(15);
        return $this->successResponse(EventResource::collection($events)->response()->getData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEventRequest $request)
    {
        try {
            $event = Event::create($request->validated());
            return $this->successResponse(new EventResource($event), 'Event created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create event', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event)
    {
        $event->load('category');
        return $this->successResponse(new EventResource($event));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEventRequest $request, Event $event)
    {
        try {
            $event->update($request->validated());
            return $this->successResponse(new EventResource($event), 'Event updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update event', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event)
    {
        try {
            $event->delete();
            return $this->successResponse(null, 'Event deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete event', 500, ['error' => $e->getMessage()]);
        }
    }
}
