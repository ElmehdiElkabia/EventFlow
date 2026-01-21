<?php

namespace Database\Seeders;

use App\Models\Attendee;
use App\Models\Ticket;
use Illuminate\Database\Seeder;

class AttendeeSeeder extends Seeder
{
    public function run(): void
    {
        $tickets = Ticket::with(['event', 'user'])->get();

        foreach ($tickets as $ticket) {
            $roll = rand(1, 100);
            $status = $roll <= 70 ? 'checked_in' : ($roll <= 90 ? 'pending' : 'no_show');

            Attendee::create([
                'user_id' => $ticket->user_id,
                'event_id' => $ticket->event_id,
                'ticket_id' => $ticket->id,
                'status' => $status,
                'checked_in_at' => $status === 'checked_in' ? now()->subDays(rand(0, 5)) : null,
            ]);
        }
    }
}
