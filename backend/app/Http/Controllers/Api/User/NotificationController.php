<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\BaseController;
use App\Models\Notification;

/**
 * Notification Controller
 * 
 * Handles user notifications.
 */
class NotificationController extends BaseController
{
    /**
     * Get user's notifications
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->get()
            ->map(fn($notification) => [
                'id' => $notification->id,
                'type' => $notification->type,
                'data' => $notification->data,
                'read' => !is_null($notification->read_at),
                'created_at' => $notification->created_at->format('M d, Y h:i A'),
            ]);

        return $this->success($notifications->all());
    }
}
