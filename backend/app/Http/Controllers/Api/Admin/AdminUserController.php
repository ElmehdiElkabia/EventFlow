<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\User;
use App\Notifications\UserSuspendedNotification;
use App\Notifications\UserActivatedNotification;
use App\Notifications\AdminEmailNotification;

/**
 * Admin User Controller
 * 
 * Handles user management by admins.
 */
class AdminUserController extends BaseController
{
    /**
     * List all users
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $users = User::with('roles')
            ->get()
            ->map(fn($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->roles()->pluck('name')->first(),
                'status' => $user->status ?? 'active',
                'suspended_at' => $user->suspended_at,
                'created_at' => $user->created_at->format('M d, Y'),
            ]);

        return $this->success($users->all());
    }

    /**
     * Update user role
     * 
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateRole(\Illuminate\Http\Request $request, $id)
    {
        $request->validate([
            'role' => ['required', 'in:admin,organizer,attendee'],
        ]);

        $user = User::find($id);

        if (!$user) {
            return $this->notFound('User not found');
        }

        $user->syncRoles([$request->role]);

        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'role' => $request->role,
        ], 'User role updated');
    }

    /**
     * Suspend a user
     * 
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function suspend(\Illuminate\Http\Request $request, $id)
    {
        $request->validate([
            'reason' => ['nullable', 'string', 'max:500'],
        ]);

        $user = User::find($id);

        if (!$user) {
            return $this->notFound('User not found');
        }

        if ($user->status === 'suspended') {
            return $this->error('User is already suspended', 400);
        }

        $user->status = 'suspended';
        $user->suspended_at = now();
        $user->suspension_reason = $request->reason;
        $user->save();

        // Revoke all tokens to log out the user
        $user->tokens()->delete();

        // Send email notification
        $user->notify(new UserSuspendedNotification($request->reason));

        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'status' => $user->status,
        ], 'User suspended successfully');
    }

    /**
     * Activate a suspended user
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function activate($id)
    {
        $user = User::find($id);

        if (!$user) {
            return $this->notFound('User not found');
        }

        if ($user->status === 'active') {
            return $this->error('User is already active', 400);
        }

        $user->status = 'active';
        $user->suspended_at = null;
        $user->suspension_reason = null;
        $user->save();

        // Send email notification
        $user->notify(new UserActivatedNotification());

        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'status' => $user->status,
        ], 'User activated successfully');
    }

    /**
     * Send email to a user
     * 
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function sendEmail(\Illuminate\Http\Request $request, $id)
    {
        $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string', 'max:2000'],
        ]);

        $user = User::find($id);

        if (!$user) {
            return $this->notFound('User not found');
        }

        // Send email notification
        $user->notify(new AdminEmailNotification($request->subject, $request->message));

        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ], 'Email sent successfully');
    }
}
