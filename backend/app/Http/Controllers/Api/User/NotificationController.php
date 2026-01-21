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
        $notifications = Notification::query()
            ->where('user_id', auth()->id())
            ->latest()
            ->get()
            ->map(fn($notification) => [
                'id' => $notification->id,
                'type' => $notification->type ?? 'default',
                'data' => [
                    'title' => $notification->title,
                    'message' => $notification->message,
                    'related_model' => $notification->related_model,
                    'related_id' => $notification->related_id,
                ],
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ]);

        return $this->success($notifications->all());
    }
}
