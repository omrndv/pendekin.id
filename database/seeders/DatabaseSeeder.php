<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed Billing Plans
        $this->call(BillingPlanSeeder::class);

        // 2. Seed Default Admin User (Dev environment only)
        User::updateOrCreate(
            ['email' => 'admin@pendekin.test'],
            [
                'name' => 'System Administrator',
                'password' => Hash::make('password'),
                'role' => UserRole::ADMIN,
                'email_verified_at' => now(),
            ]
        );

        // 3. Seed Default Test User (FREE Plan, No Fake Pro Subscription!)
        User::updateOrCreate(
            ['email' => 'user@pendekin.test'],
            [
                'name' => 'Demian User',
                'password' => Hash::make('password'),
                'role' => UserRole::USER,
                'email_verified_at' => now(),
            ]
        );
    }
}
