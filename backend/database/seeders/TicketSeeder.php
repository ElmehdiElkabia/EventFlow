<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Ticket;
use App\Models\TicketType;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $events = Event::with('ticketTypes')->get();
        $users = User::role('attendee')->get();

        foreach ($events as $event) {
            if ($users->isEmpty() || $event->ticketTypes->isEmpty()) {
                continue;
            }

            $participants = $users->shuffle()->take(min($users->count(), rand(6, $users->count())));
            $typeCounts = [];

            foreach ($participants as $user) {
                $ticketType = $event->ticketTypes->random();
                $ticket = Ticket::create([
                    'user_id' => $user->id,
                    'event_id' => $event->id,
                    'ticket_type_id' => $ticketType->id,
                    'ticket_code' => Str::upper(Str::random(10)),
                    'qr_code' => null,
                    'price' => $ticketType->price,
                    'status' => 'valid',
                    'purchased_at' => now()->subDays(rand(1, 60)),
                ]);

                $typeCounts[$ticketType->id] = ($typeCounts[$ticketType->id] ?? 0) + 1;
            }

            // update sold counts
            foreach ($event->ticketTypes as $ticketType) {
                $sold = $typeCounts[$ticketType->id] ?? 0;
                if ($sold > 0) {
                    $ticketType->increment('sold', $sold);
                }
            }

            $event->attendees_count = $participants->count();
            $event->save();
        }
    }
}
