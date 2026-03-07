<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\Event;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Transaction;
use App\Models\Category;
use Illuminate\Support\Facades\DB;

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
        // Calculate stats
        $totalRevenue = Transaction::where('status', 'completed')->sum('amount');
        $totalUsers = User::count();
        $activeEvents = Event::where('status', 'approved')->count();
        $ticketsSold = Ticket::count();

        // Calculate growth percentages (compared to last month)
        $lastMonthRevenue = Transaction::where('status', 'completed')
            ->whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->sum('amount');
        $currentMonthRevenue = Transaction::where('status', 'completed')
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->sum('amount');
        $revenueGrowth = $lastMonthRevenue > 0 ? (($currentMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100 : 0;

        $lastMonthUsers = User::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        $currentMonthUsers = User::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $userGrowth = $lastMonthUsers > 0 ? (($currentMonthUsers - $lastMonthUsers) / $lastMonthUsers) * 100 : 0;

        $lastMonthEvents = Event::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        $currentMonthEvents = Event::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $eventGrowth = $currentMonthEvents - $lastMonthEvents;

        $lastMonthTickets = Ticket::whereMonth('created_at', now()->subMonth()->month)
            ->whereYear('created_at', now()->subMonth()->year)
            ->count();
        $currentMonthTickets = Ticket::whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();
        $ticketGrowth = $lastMonthTickets > 0 ? (($currentMonthTickets - $lastMonthTickets) / $lastMonthTickets) * 100 : 0;

        // Monthly revenue data (last 12 months)
        $monthlyRevenue = [];
        for ($i = 11; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $revenue = Transaction::where('status', 'completed')
                ->whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->sum('amount');
            $tickets = Ticket::whereMonth('created_at', $date->month)
                ->whereYear('created_at', $date->year)
                ->count();
            
            $monthlyRevenue[] = [
                'month' => $date->format('M'),
                'revenue' => (float) $revenue,
                'tickets' => $tickets,
            ];
        }

        // Category breakdown
        $categoryData = Category::withCount('events')
            ->having('events_count', '>', 0)
            ->get()
            ->map(function($category) use ($activeEvents) {
                $percentage = $activeEvents > 0 ? round(($category->events_count / $activeEvents) * 100, 1) : 0;
                return [
                    'name' => $category->name,
                    'value' => $percentage,
                    'count' => $category->events_count,
                ];
            })
            ->sortByDesc('value')
            ->take(5)
            ->values();

        // Top performing events
        $topEvents = Event::select('events.*')
            ->withCount('tickets')
            ->leftJoin('transactions', 'events.id', '=', 'transactions.event_id')
            ->selectRaw('COALESCE(SUM(CASE WHEN transactions.status = "completed" THEN transactions.amount ELSE 0 END), 0) as revenue')
            ->groupBy('events.id')
            ->orderByDesc('tickets_count')
            ->limit(5)
            ->get()
            ->map(fn($event) => [
                'name' => $event->title,
                'tickets' => $event->tickets_count,
                'revenue' => (float) $event->revenue,
            ]);

        return $this->success([
            'stats' => [
                'totalRevenue' => [
                    'value' => '$' . number_format($totalRevenue, 0),
                    'change' => ($revenueGrowth >= 0 ? '+' : '') . number_format($revenueGrowth, 1) . '%',
                    'trend' => $revenueGrowth >= 0 ? 'up' : 'down',
                ],
                'totalUsers' => [
                    'value' => number_format($totalUsers, 0),
                    'change' => ($userGrowth >= 0 ? '+' : '') . number_format($userGrowth, 1) . '%',
                    'trend' => $userGrowth >= 0 ? 'up' : 'down',
                ],
                'activeEvents' => [
                    'value' => number_format($activeEvents, 0),
                    'change' => ($eventGrowth >= 0 ? '+' : '') . $eventGrowth,
                    'trend' => $eventGrowth >= 0 ? 'up' : 'down',
                ],
                'ticketsSold' => [
                    'value' => number_format($ticketsSold, 0),
                    'change' => ($ticketGrowth >= 0 ? '+' : '') . number_format($ticketGrowth, 1) . '%',
                    'trend' => $ticketGrowth >= 0 ? 'up' : 'down',
                ],
            ],
            'monthlyRevenue' => $monthlyRevenue,
            'categoryData' => $categoryData,
            'topEvents' => $topEvents,
        ]);
    }
}
