<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\User\StoreReviewRequest;
use App\Models\Review;

/**
 * Review Controller
 * 
 * Handles event reviews by users.
 */
class ReviewController extends BaseController
{
    /**
     * Get user's reviews
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $reviews = Review::where('user_id', auth()->user()->id)
            ->with('event')
            ->get()
            ->map(fn($review) => [
                'id' => $review->id,
                'event' => $review->event->title,
                'rating' => $review->rating,
                'comment' => $review->comment,
                'date' => $review->created_at->format('M d, Y'),
            ]);

        return $this->success($reviews->all());
    }

    /**
     * Create event review
     * 
     * @param StoreReviewRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreReviewRequest $request)
    {
        // Check if user attended the event
        $attended = \App\Models\Attendee::where('user_id', auth()->user()->id)
            ->where('event_id', $request->event_id)
            ->exists();

        if (!$attended) {
            return $this->error('You can only review events you attended', [], 403);
        }

        $review = Review::create([
            'user_id' => auth()->user()->id,
            'event_id' => $request->event_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return $this->success([
            'id' => $review->id,
            'rating' => $review->rating,
            'comment' => $review->comment,
        ], 'Review created successfully', 201);
    }
}
