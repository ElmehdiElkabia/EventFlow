<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\Event;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Transaction;

/**
 * Admin Analytics Controller
 * 
 * Provides platform-wide analytics.
 */
class AdminAnalyticsController extends BaseController
{
    /**
     * Get platform analytics
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $totalRevenue = Transaction::where('status', 'completed')->sum('amount');
        $totalEvents = Event::count();
        $activeEvents = Event::where('status', 'approved')->count();
        $totalUsers = User::count();
        $ticketsSold = Ticket::count();

        // Recent transactions
        $recentTransactions = Transaction::with('buyer', 'event')
            ->latest()
            ->limit(10)
            ->get()
            ->map(fn($txn) => [
                'id' => $txn->id,
                'buyer' => $txn->buyer->name,
                'event' => $txn->event->title,
                'amount' => $txn->amount,
                'date' => $txn->created_at->format('M d, Y'),
                'status' => $txn->status,
            ]);

        // Top events by tickets sold
        $topEvents = Event::withCount('tickets')
            ->orderBy('tickets_count', 'desc')
            ->limit(10)
            ->get()
            ->map(fn($event) => [
                'id' => $event->id,
                'title' => $event->title,
                'ticketsSold' => $event->tickets_count,
            ]);

        return $this->success([
            'totalRevenue' => $totalRevenue,
            'totalEvents' => $totalEvents,
            'activeEvents' => $activeEvents,
            'totalUsers' => $totalUsers,
            'ticketsSold' => $ticketsSold,
            'recentTransactions' => $recentTransactions,
            'topEvents' => $topEvents,
        ]);
    }
}
