<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        $roles = [
            ['name' => 'admin', 'guard_name' => 'web'],
            ['name' => 'organizer', 'guard_name' => 'web'],
            ['name' => 'attendee', 'guard_name' => 'web'],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }

        // Create permissions
        $permissions = [
            ['name' => 'create events', 'guard_name' => 'web'],
            ['name' => 'edit events', 'guard_name' => 'web'],
            ['name' => 'delete events', 'guard_name' => 'web'],
            ['name' => 'view reports', 'guard_name' => 'web'],
            ['name' => 'manage users', 'guard_name' => 'web'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }

        // Assign permissions to roles
        $adminRole = Role::findByName('admin');
        $adminRole->givePermissionTo(Permission::all());

        $organizerRole = Role::findByName('organizer');
        $organizerRole->givePermissionTo(['create events', 'edit events', 'view reports']);

        $attendeeRole = Role::findByName('attendee');
        // Attendee role might not have any special permissions
    }
}
