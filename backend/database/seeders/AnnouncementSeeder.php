<?php

namespace Database\Seeders;

use App\Models\Announcement;
use App\Models\Event;
use Illuminate\Database\Seeder;

class AnnouncementSeeder extends Seeder
{
    public function run(): void
    {
        $events = Event::with('organizers')->get();
        $titles = ['Schedule Update', 'New Speaker Added', 'Important Reminder'];

        foreach ($events as $event) {
            $creator = $event->organizers->first() ?: null;

            for ($i = 0; $i < rand(1, 3); $i++) {
                Announcement::create([
                    'event_id' => $event->id,
                    'user_id' => $creator?->id ?? 1,
                    'title' => $titles[array_rand($titles)],
                    'message' => 'Please check the latest event details.',
                    'sent_at' => now()->subDays(rand(1, 20)),
                ]);
            }
        }
    }
}
