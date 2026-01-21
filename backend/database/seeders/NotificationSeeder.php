<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $types = ['ticket', 'event', 'system'];

        foreach ($users as $user) {
            $count = rand(3, 8);

            for ($i = 0; $i < $count; $i++) {
                $read = rand(1, 100) <= 60;

                Notification::create([
                    'user_id' => $user->id,
                    'type' => $types[array_rand($types)],
                    'title' => 'Notification ' . ($i + 1),
                    'message' => 'This is a sample notification for testing.',
                    'related_model' => null,
                    'related_id' => null,
                    'read_at' => $read ? now()->subDays(rand(0, 15)) : null,
                ]);
            }
        }
    }
}
