<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use App\Http\Requests\UpdateNotificationRequest;
use App\Http\Resources\NotificationResource;

class NotificationController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notifications = Notification::with('user')->paginate(15);
        return $this->successResponse(NotificationResource::collection($notifications)->response()->getData());
    }

    /**
     * Display the specified resource.
     */
    public function show(Notification $notification)
    {
        $notification->load('user');
        return $this->successResponse(new NotificationResource($notification));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNotificationRequest $request, Notification $notification)
    {
        try {
            $notification->update($request->validated());
            return $this->successResponse(new NotificationResource($notification), 'Notification updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update notification', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Mark notification as read.
     */
    public function markAsRead(Notification $notification)
    {
        try {
            $notification->markAsRead();
            return $this->successResponse(new NotificationResource($notification), 'Notification marked as read');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to mark as read', 500, ['error' => $e->getMessage()]);
        }
    }
}
