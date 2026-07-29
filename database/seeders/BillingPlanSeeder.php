<?php

namespace Database\Seeders;

use App\Models\BillingPlan;
use Illuminate\Database\Seeder;

class BillingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        BillingPlan::updateOrCreate(
            ['slug' => 'free'],
            [
                'name' => 'Free',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'link_quota' => 50,
                'features' => [
                    'short_link' => true,
                    'dashboard_analytics' => true,
                    'qr_code_generator' => true,
                    'custom_slug' => true,
                    'monthly_link_limit' => 50,
                    'analytics_retention_days' => 7,
                    'password' => false,
                    'expires_at' => false,
                    'qr_customization' => false,
                    'api_access' => false,
                    'custom_domain' => false,
                    'priority_support' => false,
                ],
                'is_active' => true,
            ]
        );

        BillingPlan::updateOrCreate(
            ['slug' => 'pro'],
            [
                'name' => 'Pro',
                'price_monthly' => 24900,
                'price_yearly' => 249000,
                'link_quota' => 500,
                'features' => [
                    'short_link' => true,
                    'dashboard_analytics' => true,
                    'qr_code_generator' => true,
                    'custom_slug' => true,
                    'monthly_link_limit' => 500,
                    'analytics_retention_days' => 365,
                    'password' => true,
                    'expires_at' => true,
                    'qr_customization' => true,
                    'api_access' => false,
                    'custom_domain' => false,
                    'priority_support' => true,
                ],
                'is_active' => true,
            ]
        );

        BillingPlan::updateOrCreate(
            ['slug' => 'business'],
            [
                'name' => 'Business',
                'price_monthly' => 54900,
                'price_yearly' => 549000,
                'link_quota' => 0, // Unlimited
                'features' => [
                    'short_link' => true,
                    'dashboard_analytics' => true,
                    'qr_code_generator' => true,
                    'custom_slug' => true,
                    'monthly_link_limit' => 0, // Unlimited
                    'analytics_retention_days' => 0, // Unlimited
                    'password' => true,
                    'expires_at' => true,
                    'qr_customization' => true,
                    'api_access' => true,
                    'custom_domain' => true,
                    'priority_support' => true,
                ],
                'is_active' => true,
            ]
        );
    }
}
