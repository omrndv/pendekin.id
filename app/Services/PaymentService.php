<?php

namespace App\Services;

use App\Enums\BillingCycle;
use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Models\BillingPlan;
use App\Models\CouponCode;
use App\Models\PaymentTransaction;
use App\Models\Subscription;
use App\Models\User;
use App\Services\Payment\PaymentGatewayManager;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function __construct(
        protected PaymentGatewayManager $gatewayManager,
        protected SubscriptionService $subscriptionService,
        protected InvoiceService $invoiceService
    ) {}

    /**
     * Initiate checkout transaction and generate payment token/URL.
     */
    public function checkout(User $user, BillingPlan $plan, BillingCycle $cycle = BillingCycle::MONTHLY, ?CouponCode $coupon = null): array
    {
        return DB::transaction(function () use ($user, $plan, $cycle, $coupon) {
            $baseAmount = $cycle === BillingCycle::YEARLY ? $plan->price_yearly : $plan->price_monthly;
            $discountAmount = 0;

            if ($coupon && $coupon->isValid()) {
                if ($coupon->discount_percent > 0) {
                    $discountAmount = $baseAmount * ($coupon->discount_percent / 100);
                } elseif ($coupon->discount_amount > 0) {
                    $discountAmount = $coupon->discount_amount;
                }

                // Ensure discount doesn't exceed base amount
                $discountAmount = min($discountAmount, $baseAmount);
                $coupon->increment('used_count');
            }

            $amount = max(0, $baseAmount - $discountAmount);
            $taxAmount = $amount * 0.11; // Example 11% VAT
            $grossAmount = $amount + $taxAmount;

            $invoiceNumber = $this->invoiceService->generateInvoiceNumber();

            // 1. Create or get existing subscription
            $subscription = Subscription::firstOrCreate(
                ['user_id' => $user->id, 'billing_plan_id' => $plan->id],
                [
                    'cycle' => $cycle,
                    'status' => SubscriptionStatus::PENDING,
                    'plan_snapshot' => $this->subscriptionService->makePlanSnapshot($plan),
                    'starts_at' => now(),
                ]
            );

            // 2. Create pending transaction
            $transaction = PaymentTransaction::create([
                'user_id' => $user->id,
                'subscription_id' => $subscription->id,
                'invoice_number' => $invoiceNumber,
                'gateway_provider' => config('pendekin.payment_gateway', 'midtrans'),
                'coupon_id' => $coupon?->id,
                'gross_amount' => $grossAmount,
                'discount_amount' => $discountAmount,
                'tax_amount' => $taxAmount,
                'currency' => 'IDR',
                'status' => PaymentStatus::PENDING,
            ]);

            // 3. Create internal invoice
            $this->invoiceService->createInvoice($transaction, $subscription);

            // 4. Request Gateway Checkout Session
            $gateway = $this->gatewayManager->driver();
            $checkoutData = $gateway->createCheckoutSession($transaction, [
                'name' => $user->name,
                'email' => $user->email,
            ]);

            return [
                'transaction' => $transaction,
                'invoice_number' => $invoiceNumber,
                'snap_token' => $checkoutData['snap_token'],
                'redirect_url' => $checkoutData['redirect_url'],
            ];
        });
    }

    /**
     * Process incoming webhook safely & idempotently.
     */
    public function handleWebhook(array $payload): bool
    {
        $gateway = $this->gatewayManager->driver();

        // 1. Signature Verification
        if (! $gateway->verifyWebhookSignature($payload)) {
            return false;
        }

        $parsed = $gateway->parseWebhookPayload($payload);
        $invoiceNumber = $parsed['order_id'];

        $transaction = PaymentTransaction::where('invoice_number', $invoiceNumber)->first();
        if (! $transaction) {
            return false;
        }

        // 2. Idempotency check: if already processed, return true
        if ($transaction->status === PaymentStatus::SUCCESS) {
            return true;
        }

        return DB::transaction(function () use ($transaction, $parsed, $payload) {
            $status = $parsed['transaction_status'];

            if ($status === 'settlement' || $status === 'capture' || $status === 'success') {
                $transaction->update([
                    'status' => PaymentStatus::SUCCESS,
                    'gateway_reference' => $parsed['reference_id'],
                    'payment_method' => $parsed['payment_type'],
                    'payload_webhook' => $payload,
                    'paid_at' => now(),
                ]);

                if ($transaction->subscription) {
                    $this->subscriptionService->activateSubscription($transaction->subscription, $transaction->subscription->cycle);
                }
            } elseif ($status === 'deny' || $status === 'expire' || $status === 'cancel') {
                $transaction->update([
                    'status' => PaymentStatus::FAILED,
                    'payload_webhook' => $payload,
                ]);

                if ($transaction->subscription) {
                    $transaction->subscription->increment('failed_attempts');
                    $this->subscriptionService->markGracePeriod($transaction->subscription);
                }
            }

            return true;
        });
    }
}
