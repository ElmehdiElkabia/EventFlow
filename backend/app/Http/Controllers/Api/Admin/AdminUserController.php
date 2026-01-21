<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\User;

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
}
