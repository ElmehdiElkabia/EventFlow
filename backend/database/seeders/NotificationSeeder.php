<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        $users = \App\Models\User::all();
        $types = ['ticket', 'event', 'system'];

        foreach ($users as $user) {
            $count = rand(3, 8);

            for ($i = 0; $i < $count; $i++) {
                $read = rand(1, 100) <= 60;

                DB::table('notifications')->insert([
                    'id' => Str::uuid(),
                    'type' => 'App\\Notifications\\GenericNotification',
                    'notifiable_type' => 'App\\Models\\User',
                    'notifiable_id' => $user->id,
                    'data' => json_encode([
                        'type' => $types[array_rand($types)],
                        'title' => 'Notification ' . ($i + 1),
                        'message' => 'This is a sample notification for testing.',
                    ]),
                    'read_at' => $read ? now()->subDays(rand(0, 15)) : null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}
