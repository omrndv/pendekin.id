<?php

namespace Tests\Feature;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Models\BillingPlan;
use App\Models\PaymentTransaction;
use App\Models\Subscription;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FeatureGateTest extends TestCase
{
    use RefreshDatabase;

    public function test_free_user_without_pro_subscription_sees_upgrade_banner_on_api_keys_page(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->get('/dashboard/api-keys');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard/ApiKeys')
            ->where('isEntitled', false)
        );
    }

    public function test_free_user_cannot_create_api_key(): void
    {
        $user = User::factory()->create(['role' => 'user']);

        $response = $this->actingAs($user)->post('/dashboard/api-keys', [
            'name' => 'Unauthorized Key',
        ]);
        $response->assertStatus(403);
    }

    public function test_active_pro_user_can_access_protected_feature(): void
    {
        $user = User::factory()->create(['role' => 'user']);
        $plan = BillingPlan::create([
            'name' => 'Pro Plan',
            'slug' => 'pro',
            'price_monthly' => 39000,
            'price_yearly' => 390000,
            'link_quota' => 10000,
        ]);

        $subscription = Subscription::create([
            'user_id' => $user->id,
            'billing_plan_id' => $plan->id,
            'status' => SubscriptionStatus::ACTIVE,
            'plan_snapshot' => [
                'name' => 'Pro Plan',
                'features' => [
                    'api_access' => true,
                    'custom_domain' => true,
                    'monthly_link_limit' => 10000,
                ],
            ],
            'starts_at' => now(),
            'ends_at' => now()->addDays(30),
        ]);

        PaymentTransaction::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'invoice_number' => 'PDK-TEST-000001',
            'gross_amount' => 39000,
            'status' => PaymentStatus::SUCCESS,
        ]);

        $response = $this->actingAs($user)->get('/dashboard/api-keys');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Dashboard/ApiKeys')
            ->where('isEntitled', true)
        );
    }
}
