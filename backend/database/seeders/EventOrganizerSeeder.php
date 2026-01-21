<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventOrganizerSeeder extends Seeder
{
    public function run(): void
    {
        $events = Event::all();
        $organizers = User::role('organizer')->get();

        foreach ($events as $event) {
            if ($organizers->count() > 0) {
                // Assign primary organizer
                $primaryOrganizer = $organizers->random();
                $event->organizers()->attach($primaryOrganizer, ['role' => 'primary']);

                // Randomly add 0-1 co-organizers
                if ($organizers->count() > 1 && rand(1, 100) <= 30) {
                    $coOrganizer = $organizers->except($primaryOrganizer->id)->random();
                    $event->organizers()->attach($coOrganizer, ['role' => 'co-organizer']);
                }
            }
        }
    }
}
