<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;

class UserController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::paginate(15);
        return $this->successResponse(UserResource::collection($users)->response()->getData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        try {
            $user = User::create($request->validated());
            return $this->successResponse(new UserResource($user), 'User created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create user', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return $this->successResponse(new UserResource($user));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        try {
            $user->update($request->validated());
            return $this->successResponse(new UserResource($user), 'User updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update user', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        try {
            $user->delete();
            return $this->successResponse(null, 'User deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete user', 500, ['error' => $e->getMessage()]);
        }
    }
}
