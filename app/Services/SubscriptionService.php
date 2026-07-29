<?php

namespace App\Services;

use App\Enums\BillingCycle;
use App\Enums\SubscriptionStatus;
use App\Models\BillingPlan;
use App\Models\Subscription;
use App\Models\SubscriptionEvent;
use App\Models\User;
use App\Notifications\SubscriptionCancelledNotification;

class SubscriptionService
{
    /**
     * Start a 14-day Pro trial for new user.
     */
    public function startTrial(User $user, BillingPlan $plan): Subscription
    {
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'billing_plan_id' => $plan->id,
            'cycle' => BillingCycle::MONTHLY,
            'status' => SubscriptionStatus::TRIALING,
            'plan_snapshot' => $this->makePlanSnapshot($plan),
            'trial_started_at' => now(),
            'trial_ends_at' => now()->addDays(14),
            'starts_at' => now(),
            'ends_at' => now()->addDays(14),
        ]);

        $this->logEvent($subscription, 'trial_started', null, SubscriptionStatus::TRIALING->value, [
            'actor' => 'system',
            'plan' => $plan->name,
        ]);

        return $subscription;
    }

    /**
     * Activate or renew paid subscription.
     */
    public function activateSubscription(Subscription $subscription, BillingCycle $cycle): void
    {
        $prevStatus = $subscription->status->value;

        $durationDays = $cycle === BillingCycle::YEARLY ? 365 : 30;
        $newEndsAt = now()->addDays($durationDays);

        $subscription->update([
            'status' => SubscriptionStatus::ACTIVE,
            'cycle' => $cycle,
            'starts_at' => now(),
            'ends_at' => $newEndsAt,
            'cancels_at' => null,
            'failed_attempts' => 0,
        ]);

        $this->logEvent($subscription, 'payment_success', $prevStatus, SubscriptionStatus::ACTIVE->value, [
            'cycle' => $cycle->value,
            'ends_at' => $newEndsAt->toIso8601String(),
        ]);
    }

    /**
     * Cancel auto-renewal at end of period. User retains features until ends_at.
     */
    public function cancelRenewal(Subscription $subscription): void
    {
        $cancelsAt = $subscription->ends_at ?? now();

        $subscription->update([
            'cancels_at' => $cancelsAt,
        ]);

        $this->logEvent($subscription, 'cancelled', $subscription->status->value, $subscription->status->value, [
            'cancels_at' => $cancelsAt->toIso8601String(),
            'actor' => 'user',
        ]);

        if ($subscription->user) {
            $subscription->user->notify(new SubscriptionCancelledNotification($subscription));
        }
    }

    /**
     * Move subscription to grace period.
     */
    public function markGracePeriod(Subscription $subscription): void
    {
        $prevStatus = $subscription->status->value;
        $subscription->update(['status' => SubscriptionStatus::GRACE_PERIOD]);

        $this->logEvent($subscription, 'grace_period_started', $prevStatus, SubscriptionStatus::GRACE_PERIOD->value);
    }

    /**
     * Expire subscription after grace period.
     */
    public function expireSubscription(Subscription $subscription): void
    {
        $prevStatus = $subscription->status->value;
        $subscription->update(['status' => SubscriptionStatus::EXPIRED]);

        $this->logEvent($subscription, 'expired', $prevStatus, SubscriptionStatus::EXPIRED->value);
    }

    /**
     * Snapshot plan attributes into JSON structure.
     */
    public function makePlanSnapshot(BillingPlan $plan): array
    {
        return [
            'id' => $plan->id,
            'name' => $plan->name,
            'slug' => $plan->slug,
            'price_monthly' => (float) $plan->price_monthly,
            'price_yearly' => (float) $plan->price_yearly,
            'features' => array_merge([
                'custom_domain' => true,
                'api_access' => true,
                'monthly_link_limit' => $plan->link_quota,
                'analytics_retention_days' => 90,
            ], $plan->features ?? []),
        ];
    }

    /**
     * Record subscription lifecycle audit event.
     */
    public function logEvent(Subscription $subscription, string $eventType, ?string $prevStatus, string $newStatus, array $metadata = []): void
    {
        SubscriptionEvent::create([
            'subscription_id' => $subscription->id,
            'user_id' => $subscription->user_id,
            'event_type' => $eventType,
            'previous_status' => $prevStatus,
            'new_status' => $newStatus,
            'metadata' => $metadata,
        ]);
    }
}
