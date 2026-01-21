<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // Admin
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@eventflow.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('admin');

        // Organizers
        $organizers = [
            ['name' => 'Sarah Johnson', 'email' => 'sarah.johnson@eventflow.com'],
            ['name' => 'Michael Chen', 'email' => 'michael.chen@eventflow.com'],
            ['name' => 'Emma Wilson', 'email' => 'emma.wilson@eventflow.com'],
            ['name' => 'David Brown', 'email' => 'david.brown@eventflow.com'],
        ];

        foreach ($organizers as $org) {
            $user = User::create([
                'name' => $org['name'],
                'email' => $org['email'],
                'password' => Hash::make('password'),
            ]);
            $user->assignRole('organizer');
        }

        // Regular Users
        $users = [
            ['name' => 'John Smith', 'email' => 'john.smith@example.com'],
            ['name' => 'Lisa Anderson', 'email' => 'lisa.anderson@example.com'],
            ['name' => 'Robert Taylor', 'email' => 'robert.taylor@example.com'],
            ['name' => 'Jennifer Davis', 'email' => 'jennifer.davis@example.com'],
            ['name' => 'Chris Martin', 'email' => 'chris.martin@example.com'],
            ['name' => 'Amanda White', 'email' => 'amanda.white@example.com'],
            ['name' => 'Kevin Lee', 'email' => 'kevin.lee@example.com'],
            ['name' => 'Michelle Garcia', 'email' => 'michelle.garcia@example.com'],
        ];

        foreach ($users as $user) {
            $newUser = User::create([
                'name' => $user['name'],
                'email' => $user['email'],
                'password' => Hash::make('password'),
            ]);
            $newUser->assignRole('user');
        }
    }
}
