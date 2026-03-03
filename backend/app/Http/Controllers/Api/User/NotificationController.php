<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\BaseController;

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
                'type' => $notification->data['type'] ?? 'default',
                'data' => [
                    'title' => $notification->data['title'] ?? '',
                    'message' => $notification->data['message'] ?? '',
                ],
                'read_at' => $notification->read_at,
                'created_at' => $notification->created_at,
            ]);

        return $this->success($notifications->all());
    }

    /**
     * Mark notification as read
     * 
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAsRead($id)
    {
        $notification = auth()->user()
            ->notifications()
            ->where('id', $id)
            ->first();

        if (!$notification) {
            return $this->notFound('Notification not found');
        }

        $notification->markAsRead();

        return $this->success(null, 'Notification marked as read');
    }

    /**
     * Mark all notifications as read
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAllAsRead()
    {
        auth()->user()
            ->unreadNotifications
            ->markAsRead();

        return $this->success(null, 'All notifications marked as read');
    }
}
