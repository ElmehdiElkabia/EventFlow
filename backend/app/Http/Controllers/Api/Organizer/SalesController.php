<?php

namespace App\Http\Controllers\Api\Organizer;

use App\Http\Controllers\Api\BaseController;

/**
 * Sales Controller
 * 
 * Handles sales overview and transaction data for organizers.
 */
class SalesController extends BaseController
{
    /**
     * Get sales overview
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function overview()
    {
        $user = auth()->user();
        $organizedEvents = $user->organizedEvents;

        $totalRevenue = $organizedEvents->sum(function ($event) {
            return $event->transactions()->where('status', 'completed')->sum('amount');
        });

        $activeEvents = $organizedEvents->where('status', 'approved')->count();
        $ticketsSold = $organizedEvents->sum(fn($e) => $e->tickets->count());
        $totalAttendees = $organizedEvents->sum(fn($e) => $e->attendees->count());

        return $this->success([
            'totalRevenue' => $totalRevenue,
            'activeEvents' => $activeEvents,
            'ticketsSold' => $ticketsSold,
            'totalAttendees' => $totalAttendees,
        ]);
    }

    /**
     * Get transaction history
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function transactions()
    {
        $transactions = auth()->user()
            ->organizedEvents()
            ->with('transactions.buyer')
            ->get()
            ->flatMap(function ($event) {
                return $event->transactions->map(fn($txn) => [
                    'id' => $txn->id,
                    'buyer' => $txn->buyer->name,
                    'event' => $event->title,
                    'tickets' => $txn->tickets,
                    'amount' => $txn->amount,
                    'date' => $txn->created_at->format('M d, Y'),
                    'status' => $txn->status,
                ]);
            });

        return $this->success($transactions->all());
    }
}
