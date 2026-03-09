<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $categories = [
            ['name' => 'Technology', 'slug' => 'technology', 'icon' => 'code'],
            ['name' => 'Music', 'slug' => 'music', 'icon' => 'music'],
            ['name' => 'Business', 'slug' => 'business', 'icon' => 'briefcase'],
            ['name' => 'Arts', 'slug' => 'arts', 'icon' => 'palette'],
            ['name' => 'Food & Drink', 'slug' => 'food-drink', 'icon' => 'utensils'],
            ['name' => 'Health', 'slug' => 'health', 'icon' => 'heart'],
            ['name' => 'Sports', 'slug' => 'sports', 'icon' => 'dumbbell'],
            ['name' => 'Travel', 'slug' => 'travel', 'icon' => 'plane'],
            ['name' => 'Education', 'slug' => 'education', 'icon' => 'graduation'],
            ['name' => 'Entertainment', 'slug' => 'entertainment', 'icon' => 'film'],
            ['name' => 'Fashion', 'slug' => 'fashion', 'icon' => 'shirt'],
            ['name' => 'Gaming', 'slug' => 'gaming', 'icon' => 'gamepad'],
            ['name' => 'Books', 'slug' => 'books', 'icon' => 'book'],
            ['name' => 'Photography', 'slug' => 'photography', 'icon' => 'camera'],
            ['name' => 'Sports & Awards', 'slug' => 'awards', 'icon' => 'trophy'],
            ['name' => 'Podcasts', 'slug' => 'podcasts', 'icon' => 'mic'],
            ['name' => 'Movies & Theater', 'slug' => 'theater', 'icon' => 'theater'],
            ['name' => 'Comedy', 'slug' => 'comedy', 'icon' => 'laugh'],
            ['name' => 'Wine & Spirits', 'slug' => 'wine', 'icon' => 'wine'],
            ['name' => 'Parenting', 'slug' => 'parenting', 'icon' => 'baby'],
            ['name' => 'Automotive', 'slug' => 'automotive', 'icon' => 'car'],
            ['name' => 'Real Estate', 'slug' => 'real-estate', 'icon' => 'home'],
            ['name' => 'Innovation', 'slug' => 'innovation', 'icon' => 'lightbulb'],
            ['name' => 'Lifestyle', 'slug' => 'lifestyle', 'icon' => 'sparkles'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
