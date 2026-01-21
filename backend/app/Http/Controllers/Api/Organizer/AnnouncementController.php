<?php

namespace App\Http\Controllers\Api\Organizer;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\Organizer\StoreAnnouncementRequest;
use App\Models\Announcement;

/**
 * Announcement Controller
 * 
 * Handles announcement creation and sending.
 */
class AnnouncementController extends BaseController
{
    /**
     * Create and send announcement
     * 
     * @param StoreAnnouncementRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreAnnouncementRequest $request)
    {
        $announcement = Announcement::create([
            'title' => $request->title,
            'message' => $request->message,
            'event_id' => $request->event_id,
        ]);

        // Send to all event attendees
        $event = $announcement->event;
        $attendees = $event->attendees;

        foreach ($attendees as $attendee) {
            $attendee->user->notify(new \App\Notifications\AnnouncementNotification($announcement));
        }

        return $this->success([
            'id' => $announcement->id,
            'title' => $announcement->title,
            'message' => $announcement->message,
            'sent_at' => now()->format('M d, Y h:i A'),
        ], 'Announcement sent successfully', 201);
    }
}
