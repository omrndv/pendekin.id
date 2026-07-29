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

class WebhookVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_webhook_with_invalid_signature_is_rejected(): void
    {
        $response = $this->postJson('/webhooks/midtrans', [
            'order_id' => 'PDK-20260726-000001',
            'status_code' => '200',
            'gross_amount' => '39000.00',
            'signature_key' => 'invalid_signature',
        ]);

        $response->assertStatus(400);
    }

    public function test_valid_webhook_activates_subscription_idempotently(): void
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
            'status' => SubscriptionStatus::PENDING,
        ]);

        $orderId = 'PDK-20260726-000001';
        $transaction = PaymentTransaction::create([
            'user_id' => $user->id,
            'subscription_id' => $subscription->id,
            'invoice_number' => $orderId,
            'gross_amount' => 39000,
            'status' => PaymentStatus::PENDING,
        ]);

        $serverKey = env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-demo');
        $validSignature = hash('sha512', $orderId.'200'.'39000.00'.$serverKey);

        $payload = [
            'order_id' => $orderId,
            'status_code' => '200',
            'gross_amount' => '39000.00',
            'transaction_status' => 'settlement',
            'signature_key' => $validSignature,
        ];

        // First Webhook Call -> Should activate
        $response = $this->postJson('/webhooks/midtrans', $payload);
        $response->assertStatus(200);

        $this->assertDatabaseHas('payment_transactions', [
            'invoice_number' => $orderId,
            'status' => PaymentStatus::SUCCESS->value,
        ]);

        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'status' => SubscriptionStatus::ACTIVE->value,
        ]);

        // Second Webhook Call (Idempotent Test) -> Should return 200 OK without double processing
        $response2 = $this->postJson('/webhooks/midtrans', $payload);
        $response2->assertStatus(200);
    }
}
