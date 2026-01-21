<?php

namespace App\Http\Controllers\Api;

use App\Models\Refund;
use App\Http\Requests\StoreRefundRequest;
use App\Http\Requests\UpdateRefundRequest;
use App\Http\Resources\RefundResource;

class RefundController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $refunds = Refund::with(['user', 'event', 'ticket', 'transaction'])->paginate(15);
        return $this->successResponse(RefundResource::collection($refunds)->response()->getData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRefundRequest $request)
    {
        try {
            $refund = Refund::create($request->validated());
            return $this->successResponse(new RefundResource($refund), 'Refund created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create refund', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Refund $refund)
    {
        $refund->load(['user', 'event', 'ticket', 'transaction']);
        return $this->successResponse(new RefundResource($refund));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRefundRequest $request, Refund $refund)
    {
        try {
            $refund->update($request->validated());
            return $this->successResponse(new RefundResource($refund), 'Refund updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update refund', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Refund $refund)
    {
        try {
            $refund->delete();
            return $this->successResponse(null, 'Refund deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete refund', 500, ['error' => $e->getMessage()]);
        }
    }
}
