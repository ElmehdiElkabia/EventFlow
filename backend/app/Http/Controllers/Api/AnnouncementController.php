<?php

namespace App\Http\Controllers\Api;

use App\Models\Announcement;
use App\Http\Requests\StoreAnnouncementRequest;
use App\Http\Requests\UpdateAnnouncementRequest;
use App\Http\Resources\AnnouncementResource;

class AnnouncementController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $announcements = Announcement::with(['event', 'creator'])->paginate(15);
        return $this->successResponse(AnnouncementResource::collection($announcements)->response()->getData());
    }
k
    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAnnouncementRequest $request)
    {
        try {
            $announcement = Announcement::create($request->validated());
            return $this->successResponse(new AnnouncementResource($announcement), 'Announcement created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create announcement', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Announcement $announcement)
    {
        $announcement->load(['event', 'creator']);
        return $this->successResponse(new AnnouncementResource($announcement));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnnouncementRequest $request, Announcement $announcement)
    {
        try {
            $announcement->update($request->validated());
            return $this->successResponse(new AnnouncementResource($announcement), 'Announcement updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update announcement', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Announcement $announcement)
    {
        try {
            $announcement->delete();
            return $this->successResponse(null, 'Announcement deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete announcement', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Send announcement to all event attendees.
     */
    public function send(Announcement $announcement)
    {
        try {
            // Mark as sent
            $announcement->update(['sent_at' => now()]);
            
            // TODO: Implement sending notifications to attendees
            // For now, just mark as sent
            
            return $this->successResponse(new AnnouncementResource($announcement), 'Announcement sent successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to send announcement', 500, ['error' => $e->getMessage()]);
        }
    }
}
