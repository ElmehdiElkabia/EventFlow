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
            ['name' => 'Technology', 'slug' => 'technology', 'icon' => '💻'],
            ['name' => 'Music', 'slug' => 'music', 'icon' => '🎵'],
            ['name' => 'Business', 'slug' => 'business', 'icon' => '💼'],
            ['name' => 'Arts', 'slug' => 'arts', 'icon' => '🎨'],
            ['name' => 'Food & Drink', 'slug' => 'food-drink', 'icon' => '🍽️'],
            ['name' => 'Health', 'slug' => 'health', 'icon' => '❤️'],
            ['name' => 'Sports', 'slug' => 'sports', 'icon' => '⚽'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
