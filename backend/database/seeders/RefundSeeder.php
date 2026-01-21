<?php

namespace Database\Seeders;

use App\Models\Refund;
use App\Models\Ticket;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RefundSeeder extends Seeder
{
    public function run(): void
    {
        $transactions = Transaction::where('status', 'completed')->get();
        $count = $transactions->count();
        $toRefund = $transactions->shuffle()->take(max(0, (int) floor($count * 0.05)));

        foreach ($toRefund as $transaction) {
            $ticket = Ticket::where('user_id', $transaction->user_id)
                ->where('event_id', $transaction->event_id)
                ->first();

            if (! $ticket) {
                continue;
            }

            $statusRoll = rand(1, 100);
            $status = $statusRoll <= 40 ? 'pending' : ($statusRoll <= 75 ? 'approved' : 'rejected');

            Refund::create([
                'refund_id' => 'RF-' . strtoupper(Str::random(10)),
                'user_id' => $transaction->user_id,
                'event_id' => $transaction->event_id,
                'ticket_id' => $ticket->id,
                'transaction_id' => $transaction->id,
                'amount' => $transaction->amount,
                'reason' => 'Customer requested refund',
                'status' => $status,
                'admin_notes' => $status === 'approved' ? 'Approved by admin' : null,
                'requested_at' => now()->subDays(rand(1, 10)),
                'processed_at' => $status === 'approved' ? now()->subDays(rand(0, 5)) : null,
            ]);
        }
    }
}
