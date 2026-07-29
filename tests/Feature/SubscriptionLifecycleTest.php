<?php

namespace Tests\Feature;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Enums\UserRole;
use App\Models\BillingPlan;
use App\Models\PaymentTransaction;
use App\Models\Subscription;
use App\Models\User;
use App\Services\FeatureGateService;
use App\Services\SubscriptionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SubscriptionLifecycleTest extends TestCase
{
    use RefreshDatabase;

    public function test_new_user_defaults_to_free_plan_without_pro_subscription(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        /** @var FeatureGateService $featureGate */
        $featureGate = app(FeatureGateService::class);

        $planDetails = $featureGate->getPlanDetails($user);

        $this->assertEquals('free', $planDetails['slug']);
        $this->assertFalse($featureGate->canAccessApi($user));
        $this->assertTrue($featureGate->canUseCustomSlug($user));
    }

    public function test_user_can_start_trial_subscription(): void
    {
        $user = User::factory()->create();
        $plan = BillingPlan::create([
            'name' => 'Pro Plan',
            'slug' => 'pro',
            'price_monthly' => 39000,
            'price_yearly' => 390000,
            'link_quota' => 10000,
        ]);

        /** @var SubscriptionService $service */
        $service = app(SubscriptionService::class);
        $subscription = $service->startTrial($user, $plan);

        $this->assertEquals(SubscriptionStatus::TRIALING, $subscription->status);
        $this->assertNotNull($subscription->trial_ends_at);
        $this->assertDatabaseHas('subscription_events', [
            'subscription_id' => $subscription->id,
            'event_type' => 'trial_started',
        ]);
    }

    public function test_user_can_initiate_checkout(): void
    {
        $user = User::factory()->create();
        $plan = BillingPlan::create([
            'name' => 'Pro Plan',
            'slug' => 'pro',
            'price_monthly' => 39000,
            'price_yearly' => 390000,
            'link_quota' => 10000,
        ]);

        \Illuminate\Support\Facades\Http::fake([
            '*' => \Illuminate\Support\Facades\Http::response([
                'token' => 'mock_snap_token_123',
                'redirect_url' => 'https://mock.midtrans.url',
            ], 200),
        ]);

        $response = $this->actingAs($user)->post('/dashboard/billing/checkout', [
            'plan_id' => $plan->id,
            'cycle' => 'monthly',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('payment_transactions', [
            'user_id' => $user->id,
            'gross_amount' => 43290, // 39000 + 11% tax
        ]);
    }

    public function test_cancel_renewal_sets_cancels_at_without_expiring_immediately(): void
    {
        $user = User::factory()->create();
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
            'starts_at' => now(),
            'ends_at' => now()->addDays(30),
        ]);

        PaymentTransaction::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'invoice_number' => 'PDK-TEST-000002',
            'gross_amount' => 39000,
            'status' => PaymentStatus::SUCCESS,
        ]);

        $response = $this->actingAs($user)->post('/dashboard/billing/cancel-renewal');
        $response->assertStatus(302);

        $subscription->refresh();
        $this->assertNotNull($subscription->cancels_at);
        $this->assertEquals(SubscriptionStatus::ACTIVE, $subscription->status);
    }
}
