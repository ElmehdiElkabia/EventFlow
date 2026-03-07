<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Api\BaseController;
use App\Models\Refund;
use App\Notifications\RefundApprovedNotification;
use App\Notifications\RefundRejectedNotification;
use Illuminate\Http\Request;

/**
 * Admin Refund Controller
 * 
 * Handles refund request management by admins.
 */
class AdminRefundController extends BaseController
{
    /**
     * List all refund requests
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $refunds = Refund::with(['user', 'event', 'ticket', 'transaction'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($refund) => [
                'id' => $refund->refund_id,
                'user' => $refund->user->name,
                'email' => $refund->user->email,
                'event' => $refund->event->title,
                'amount' => (float) $refund->amount,
                'reason' => $refund->reason,
                'status' => $refund->status,
                'requestedAt' => $refund->requested_at?->toIso8601String() ?? $refund->created_at->toIso8601String(),
                'ticketCode' => $refund->ticket->ticket_code ?? 'N/A',
                'adminNotes' => $refund->admin_notes,
            ]);

        return $this->success($refunds->all());
    }

    /**
     * Get refund statistics
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function stats()
    {
        $pending = Refund::where('status', 'pending')->count();
        $approved = Refund::where('status', 'approved')->count();
        $rejected = Refund::where('status', 'rejected')->count();
        $totalAmount = Refund::whereIn('status', ['approved', 'processed'])->sum('amount');

        return $this->success([
            'pending' => $pending,
            'approved' => $approved,
            'rejected' => $rejected,
            'totalAmount' => number_format((float) $totalAmount, 2, '.', ''),
        ]);
    }

    /**
     * Approve a refund request
     * 
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function approve(Request $request, $id)
    {
        $request->validate([
            'admin_notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $refund = Refund::where('refund_id', $id)->first();

        if (!$refund) {
            return $this->notFound('Refund not found');
        }

        if ($refund->status !== 'pending') {
            return $this->error('Only pending refunds can be approved', 400);
        }

        $refund->status = 'approved';
        $refund->admin_notes = $request->admin_notes;
        $refund->processed_at = now();
        $refund->save();

        // Send email notification
        $refund->user->notify(new RefundApprovedNotification($refund));

        return $this->success([
            'id' => $refund->refund_id,
            'status' => $refund->status,
        ], 'Refund approved successfully');
    }

    /**
     * Reject a refund request
     * 
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function reject(Request $request, $id)
    {
        $request->validate([
            'admin_notes' => ['required', 'string', 'max:1000'],
        ]);

        $refund = Refund::where('refund_id', $id)->first();

        if (!$refund) {
            return $this->notFound('Refund not found');
        }

        if ($refund->status !== 'pending') {
            return $this->error('Only pending refunds can be rejected', 400);
        }

        $refund->status = 'rejected';
        $refund->admin_notes = $request->admin_notes;
        $refund->processed_at = now();
        $refund->save();

        // Send email notification
        $refund->user->notify(new RefundRejectedNotification($refund));

        return $this->success([
            'id' => $refund->refund_id,
            'status' => $refund->status,
        ], 'Refund rejected');
    }
}
