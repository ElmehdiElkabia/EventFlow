<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $techCat = Category::where('slug', 'technology')->first();
        $musicCat = Category::where('slug', 'music')->first();
        $bizCat = Category::where('slug', 'business')->first();
        $artsCat = Category::where('slug', 'arts')->first();
        $foodCat = Category::where('slug', 'food-drink')->first();

        $events = [
            [
                'title' => 'Web Development Workshop',
                'slug' => 'web-dev-workshop',
                'description' => 'Learn modern web development with React and Laravel',
                'category_id' => $techCat->id,
                'start_date' => now()->addDays(30),
                'end_date' => now()->addDays(30)->addHours(4),
                'location' => 'San Francisco, CA',
                'latitude' => 37.7749,
                'longitude' => -122.4194,
                'capacity' => 100,
                'attendees_count' => 85,
                'image_url' => 'https://images.unsplash.com/photo-1633356122544-f134ef2944f0?w=500',
                'status' => 'live',
                'featured' => true,
                'average_rating' => 4.5,
            ],
            [
                'title' => 'Jazz Night',
                'slug' => 'jazz-night',
                'description' => 'An evening of live jazz performances',
                'category_id' => $musicCat->id,
                'start_date' => now()->addDays(15),
                'end_date' => now()->addDays(15)->addHours(3),
                'location' => 'New York, NY',
                'latitude' => 40.7128,
                'longitude' => -74.0060,
                'capacity' => 150,
                'attendees_count' => 142,
                'image_url' => 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500',
                'status' => 'live',
                'featured' => true,
                'average_rating' => 4.8,
            ],
            [
                'title' => 'Startup Summit 2026',
                'slug' => 'startup-summit-2026',
                'description' => 'Connect with entrepreneurs and investors',
                'category_id' => $bizCat->id,
                'start_date' => now()->addDays(45),
                'end_date' => now()->addDays(46),
                'location' => 'Austin, TX',
                'latitude' => 30.2672,
                'longitude' => -97.7431,
                'capacity' => 500,
                'attendees_count' => 450,
                'image_url' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
                'status' => 'pending_approval',
                'featured' => false,
                'average_rating' => null,
            ],
            [
                'title' => 'Digital Art Expo',
                'slug' => 'digital-art-expo',
                'description' => 'Showcase of digital and virtual art installations',
                'category_id' => $artsCat->id,
                'start_date' => now()->addDays(60),
                'end_date' => now()->addDays(65),
                'location' => 'Los Angeles, CA',
                'latitude' => 34.0522,
                'longitude' => -118.2437,
                'capacity' => 200,
                'attendees_count' => 175,
                'image_url' => 'https://images.unsplash.com/photo-1578926078328-123c4e38d288?w=500',
                'status' => 'live',
                'featured' => false,
                'average_rating' => 4.2,
            ],
            [
                'title' => 'Gourmet Food Festival',
                'slug' => 'gourmet-food-festival',
                'description' => 'Taste culinary delights from top chefs',
                'category_id' => $foodCat->id,
                'start_date' => now()->addDays(20),
                'end_date' => now()->addDays(20)->addHours(6),
                'location' => 'Chicago, IL',
                'latitude' => 41.8781,
                'longitude' => -87.6298,
                'capacity' => 300,
                'attendees_count' => 280,
                'image_url' => 'https://images.unsplash.com/photo-1555939594-58d7cb561282?w=500',
                'status' => 'live',
                'featured' => true,
                'average_rating' => 4.6,
            ],
            [
                'title' => 'AI Conference 2026',
                'slug' => 'ai-conference-2026',
                'description' => 'Latest advancements in artificial intelligence',
                'category_id' => $techCat->id,
                'start_date' => now()->addDays(90),
                'end_date' => now()->addDays(92),
                'location' => 'Seattle, WA',
                'latitude' => 47.6062,
                'longitude' => -122.3321,
                'capacity' => 800,
                'attendees_count' => 650,
                'image_url' => 'https://images.unsplash.com/photo-1485579149c0-123123cc54cb?w=500',
                'status' => 'approved',
                'featured' => true,
                'average_rating' => null,
            ],
            [
                'title' => 'Comedy Night',
                'slug' => 'comedy-night',
                'description' => 'Stand-up comedy from top comedians',
                'category_id' => $musicCat->id,
                'start_date' => now()->addDays(10),
                'end_date' => now()->addDays(10)->addHours(3),
                'location' => 'Boston, MA',
                'latitude' => 42.3601,
                'longitude' => -71.0589,
                'capacity' => 250,
                'attendees_count' => 230,
                'image_url' => 'https://images.unsplash.com/photo-1540575467063-178f50002328?w=500',
                'status' => 'live',
                'featured' => false,
                'average_rating' => 4.4,
            ],
            [
                'title' => 'Leadership Workshop',
                'slug' => 'leadership-workshop',
                'description' => 'Develop your leadership skills with industry experts',
                'category_id' => $bizCat->id,
                'start_date' => now()->addDays(25),
                'end_date' => now()->addDays(25)->addHours(5),
                'location' => 'Miami, FL',
                'latitude' => 25.7617,
                'longitude' => -80.1918,
                'capacity' => 100,
                'attendees_count' => 95,
                'image_url' => 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500',
                'status' => 'approved',
                'featured' => false,
                'average_rating' => null,
            ],
            [
                'title' => 'Photography Masterclass',
                'slug' => 'photography-masterclass',
                'description' => 'Learn professional photography techniques',
                'category_id' => $artsCat->id,
                'start_date' => now()->addDays(35),
                'end_date' => now()->addDays(35)->addHours(4),
                'location' => 'Denver, CO',
                'latitude' => 39.7392,
                'longitude' => -104.9903,
                'capacity' => 50,
                'attendees_count' => 48,
                'image_url' => 'https://images.unsplash.com/photo-1516035069371-29a08b8b2af1?w=500',
                'status' => 'live',
                'featured' => false,
                'average_rating' => 4.7,
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
