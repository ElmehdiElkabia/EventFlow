<?php

namespace App\Http\Controllers\Api;

use App\Models\Review;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Requests\UpdateReviewRequest;
use App\Http\Resources\ReviewResource;

class ReviewController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $reviews = Review::with(['user', 'event'])->paginate(15);
        return $this->successResponse(ReviewResource::collection($reviews)->response()->getData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreReviewRequest $request)
    {
        try {
            $review = Review::create($request->validated());
            return $this->successResponse(new ReviewResource($review), 'Review created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create review', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Review $review)
    {
        $review->load(['user', 'event']);
        return $this->successResponse(new ReviewResource($review));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateReviewRequest $request, Review $review)
    {
        try {
            $review->update($request->validated());
            return $this->successResponse(new ReviewResource($review), 'Review updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update review', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Review $review)
    {
        try {
            $review->delete();
            return $this->successResponse(null, 'Review deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete review', 500, ['error' => $e->getMessage()]);
        }
    }
}
