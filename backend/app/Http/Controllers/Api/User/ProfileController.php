<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\User\UpdateProfileRequest;

/**
 * Profile Controller
 * 
 * Handles user profile and settings.
 */
class ProfileController extends BaseController
{
    /**
     * Get user profile
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function show()
    {
        $user = auth()->user();

        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->roles()->pluck('name')->first(),
            'created_at' => $user->created_at->format('M d, Y'),
        ]);
    }

    /**
     * Update user profile
     * 
     * @param UpdateProfileRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(UpdateProfileRequest $request)
    {
        $user = auth()->user();

        $user->update($request->validated());

        return $this->success([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ], 'Profile updated');
    }

    /**
     * Update user settings
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateSettings(\Illuminate\Http\Request $request)
    {
        $user = auth()->user();

        // Update settings (stored in JSON or separate table)
        // For now, just return success

        return $this->success(null, 'Settings updated');
    }
}
