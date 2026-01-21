<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\TicketType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class TicketTypeSeeder extends Seeder
{
    public function run(): void
    {
        $events = Event::all();

        foreach ($events as $event) {
            $isFreeEvent = $event->capacity <= 120; // treat smaller events as free/community

            if ($isFreeEvent) {
                TicketType::create([
                    'event_id' => $event->id,
                    'name' => 'Free Admission',
                    'quantity' => $event->capacity,
                    'sold' => 0,
                    'price' => 0,
                    'description' => 'General admission ticket',
                    'sale_start_date' => now()->subDays(rand(5, 20)),
                    'sale_end_date' => $event->start_date,
                ]);
                continue;
            }

            $base = rand(25, 65);
            $vip = $base + rand(30, 70);
            $earlyBird = max(10, $base - rand(5, 15));

            $quantities = [
                'standard' => max(30, (int) ($event->capacity * 0.6)),
                'vip' => max(10, (int) ($event->capacity * 0.2)),
                'early' => max(10, (int) ($event->capacity * 0.2)),
            ];

            TicketType::create([
                'event_id' => $event->id,
                'name' => 'Standard',
                'quantity' => $quantities['standard'],
                'sold' => 0,
                'price' => $base,
                'description' => 'Standard admission',
                'sale_start_date' => now()->subDays(rand(10, 30)),
                'sale_end_date' => $event->start_date,
            ]);

            TicketType::create([
                'event_id' => $event->id,
                'name' => 'VIP',
                'quantity' => $quantities['vip'],
                'sold' => 0,
                'price' => $vip,
                'description' => 'VIP access with perks',
                'sale_start_date' => now()->subDays(rand(5, 20)),
                'sale_end_date' => $event->start_date,
            ]);

            TicketType::create([
                'event_id' => $event->id,
                'name' => 'Early Bird',
                'quantity' => $quantities['early'],
                'sold' => 0,
                'price' => $earlyBird,
                'description' => 'Discounted early bird ticket',
                'sale_start_date' => now()->subDays(rand(15, 45)),
                'sale_end_date' => $event->start_date->subDays(5),
            ]);
        }
    }
}
