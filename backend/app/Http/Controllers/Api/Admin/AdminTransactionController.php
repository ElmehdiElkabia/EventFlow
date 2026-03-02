<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\Transaction;

/**
 * Admin Transaction Controller
 * 
 * Handles platform-wide transaction management for admins.
 */
class AdminTransactionController extends BaseController
{
    /**
     * Get all transactions
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $transactions = Transaction::with(['user', 'event'])
            ->latest()
            ->get()
            ->map(fn($txn) => [
                'id' => $txn->transaction_id,
                'user' => $txn->user->name,
                'email' => $txn->user->email,
                'event' => $txn->event->title,
                'amount' => $txn->amount,
                'status' => $txn->status,
                'date' => $txn->created_at->toISOString(),
                'method' => ucfirst(str_replace('_', ' ', $txn->payment_method)),
            ]);

        return $this->success($transactions);
    }

    /**
     * Get transaction statistics
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats()
    {
        $totalRevenue = Transaction::where('status', 'completed')->sum('amount');
        $totalTransactions = Transaction::count();
        $completedTransactions = Transaction::where('status', 'completed')->count();
        
        $avgOrderValue = $completedTransactions > 0 
            ? $totalRevenue / $completedTransactions 
            : 0;

        return $this->success([
            'totalRevenue' => $totalRevenue,
            'totalTransactions' => $totalTransactions,
            'avgOrderValue' => round($avgOrderValue, 2),
        ]);
    }
}
