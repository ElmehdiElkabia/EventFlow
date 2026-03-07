<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\BillingAddress;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class BillingController extends Controller
{
    /**
     * Get billing summary for authenticated user
     */
    public function summary(Request $request)
    {
        $user = $request->user();

        // Current month transactions
        $currentMonthTransactions = $user->transactions()
            ->where('status', 'completed')
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->get();

        // Last month transactions
        $lastMonthTransactions = $user->transactions()
            ->where('status', 'completed')
            ->whereYear('created_at', now()->subMonth()->year)
            ->whereMonth('created_at', now()->subMonth()->month)
            ->get();

        // Total transactions
        $totalTransactions = $user->transactions()
            ->where('status', 'completed')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'current_month' => [
                    'total' => $currentMonthTransactions->sum('amount'),
                    'count' => $currentMonthTransactions->count(),
                ],
                'last_month' => [
                    'total' => $lastMonthTransactions->sum('amount'),
                    'count' => $lastMonthTransactions->count(),
                ],
                'lifetime' => [
                    'total' => $totalTransactions->sum('amount'),
                    'count' => $totalTransactions->count(),
                ],
            ],
        ]);
    }

    /**
     * Get transaction history for authenticated user
     */
    public function transactions(Request $request)
    {
        $perPage = $request->input('per_page', 10);

        $transactions = $request->user()
            ->transactions()
            ->with(['event:id,title', 'event.organizer:id,name'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $transactions->items(),
            'pagination' => [
                'current_page' => $transactions->currentPage(),
                'last_page' => $transactions->lastPage(),
                'per_page' => $transactions->perPage(),
                'total' => $transactions->total(),
            ],
        ]);
    }

    /**
     * Get billing address for authenticated user
     */
    public function getAddress(Request $request)
    {
        $address = $request->user()->billingAddress;

        return response()->json([
            'success' => true,
            'data' => $address,
        ]);
    }

    /**
     * Store or update billing address
     */
    public function updateAddress(Request $request)
    {
        $request->validate([
            'street_address' => 'required|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip_code' => 'required|string|max:20',
            'country' => 'required|string|max:255',
        ]);

        $address = $request->user()->billingAddress()->updateOrCreate(
            ['user_id' => $request->user()->id],
            $request->only(['street_address', 'city', 'state', 'zip_code', 'country'])
        );

        return response()->json([
            'success' => true,
            'message' => 'Billing address updated successfully',
            'data' => $address,
        ]);
    }

    /**
     * Download receipt for a transaction
     */
    public function downloadReceipt(Request $request, $transactionId)
    {
        $transaction = $request->user()
            ->transactions()
            ->with('event')
            ->findOrFail($transactionId);

        // In a real app, you would generate a PDF here
        // For now, return transaction details
        return response()->json([
            'success' => true,
            'data' => [
                'transaction_id' => $transaction->transaction_id,
                'amount' => $transaction->amount,
                'status' => $transaction->status,
                'event' => $transaction->event->title ?? 'N/A',
                'date' => $transaction->created_at->format('M d, Y'),
                'payment_method' => $transaction->payment_method,
            ],
        ]);
    }
}
