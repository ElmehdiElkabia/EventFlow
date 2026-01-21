<?php

namespace App\Http\Controllers\Api;

use App\Models\Attendee;
use App\Http\Requests\StoreAttendeeRequest;
use App\Http\Requests\UpdateAttendeeRequest;
use App\Http\Resources\AttendeeResource;

class AttendeeController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $attendees = Attendee::with(['user', 'event', 'ticket'])->paginate(15);
        return $this->successResponse(AttendeeResource::collection($attendees)->response()->getData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendeeRequest $request)
    {
        try {
            $attendee = Attendee::create($request->validated());
            return $this->successResponse(new AttendeeResource($attendee), 'Attendee created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create attendee', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendee $attendee)
    {
        $attendee->load(['user', 'event', 'ticket']);
        return $this->successResponse(new AttendeeResource($attendee));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendeeRequest $request, Attendee $attendee)
    {
        try {
            $attendee->update($request->validated());
            return $this->successResponse(new AttendeeResource($attendee), 'Attendee updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update attendee', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendee $attendee)
    {
        try {
            $attendee->delete();
            return $this->successResponse(null, 'Attendee deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete attendee', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Check in an attendee.
     */
    public function checkIn(Attendee $attendee)
    {
        try {
            $attendee->update([
                'status' => 'checked_in',
                'checked_in_at' => now(),
            ]);
            return $this->successResponse(new AttendeeResource($attendee), 'Attendee checked in successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to check in attendee', 500, ['error' => $e->getMessage()]);
        }
    }
}
