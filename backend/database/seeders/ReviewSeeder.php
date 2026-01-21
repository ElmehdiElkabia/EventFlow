<?php

namespace Database\Seeders;

use App\Models\Attendee;
use App\Models\Review;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $checkedIn = Attendee::where('status', 'checked_in')->get();
        $comments = [
            'Amazing experience!',
            'Great content and organization.',
            'Loved the speakers and venue.',
            'Solid event, would attend again.',
            'Good value for money.',
        ];

        foreach ($checkedIn as $attendee) {
            if (rand(1, 100) > 30) {
                continue; // 30% leave a review
            }

            Review::create([
                'user_id' => $attendee->user_id,
                'event_id' => $attendee->event_id,
                'rating' => rand(4, 5),
                'comment' => $comments[array_rand($comments)],
                'helpful_count' => rand(0, 20),
                'reviewed_at' => now()->subDays(rand(0, 15)),
            ]);
        }
    }
}
