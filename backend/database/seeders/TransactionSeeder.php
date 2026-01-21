<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\Transaction;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        $tickets = Ticket::where('price', '>', 0)->get();

        foreach ($tickets as $ticket) {
            $roll = rand(1, 100);
            $status = $roll <= 70 ? 'completed' : ($roll <= 90 ? 'pending' : 'failed');
            $paymentMethod = collect(['card', 'paypal', 'bank_transfer', 'cash'])->random();

            Transaction::create([
                'transaction_id' => 'TX-' . strtoupper(Str::random(10)),
                'user_id' => $ticket->user_id,
                'event_id' => $ticket->event_id,
                'amount' => $ticket->price,
                'status' => $status,
                'payment_method' => $paymentMethod,
                'payment_gateway' => in_array($paymentMethod, ['card', 'paypal']) ? 'stripe' : null,
                'gateway_transaction_id' => in_array($paymentMethod, ['card', 'paypal']) ? strtoupper(Str::random(12)) : null,
                'description' => 'Ticket purchase',
            ]);
        }
    }
}
