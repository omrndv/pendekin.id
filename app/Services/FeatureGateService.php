<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Models\BillingPlan;
use App\Models\Subscription;
use App\Models\User;

class FeatureGateService
{
    public function __construct(
        protected UsageTrackerService $usageTracker
    ) {}

    /**
     * Get validated active subscription for user.
     * Returns null if subscription is invalid, expired, or lacking verified payment.
     */
    public function getActiveSubscription(User $user): ?Subscription
    {
        $subscription = Subscription::where('user_id', $user->id)
            ->whereIn('status', [SubscriptionStatus::ACTIVE, SubscriptionStatus::TRIALING, SubscriptionStatus::GRACE_PERIOD])
            ->latest('starts_at')
            ->first();

        if (! $subscription) {
            return null;
        }

        // Hardening Check: ACTIVE paid subscription MUST have a successful payment transaction
        if ($subscription->status === SubscriptionStatus::ACTIVE) {
            $hasSuccessPayment = $subscription->transactions()
                ->where('status', PaymentStatus::SUCCESS)
                ->exists();

            if (! $hasSuccessPayment && ! $user->isAdmin()) {
                // Subscription is invalid/corrupt -> treat as inactive
                return null;
            }
        }

        // Expiry check
        if ($subscription->ends_at && $subscription->ends_at->isPast() && $subscription->status !== SubscriptionStatus::GRACE_PERIOD) {
            return null;
        }

        return $subscription;
    }

    /**
     * Get active plan snapshot or default Free plan details.
     */
    public function getPlanDetails(User $user): array
    {
        $subscription = $this->getActiveSubscription($user);

        if ($subscription && ! empty($subscription->plan_snapshot)) {
            return [
                'type' => $subscription->isTrial() ? 'trial' : 'paid',
                'name' => $subscription->plan_snapshot['name'] ?? 'Pro',
                'slug' => $subscription->plan_snapshot['slug'] ?? 'pro',
                'status' => $subscription->status->value,
                'status_label' => $subscription->status->label(),
                'cycle' => $subscription->cycle?->value ?? 'monthly',
                'ends_at' => $subscription->ends_at?->toIso8601String(),
                'cancels_at' => $subscription->cancels_at?->toIso8601String(),
                'features' => $subscription->plan_snapshot['features'] ?? [],
            ];
        }

        // Default Free Plan fallback
        $freePlan = BillingPlan::where('slug', 'free')->first();
        $defaultFreeLimit = (int) \App\Models\SystemSetting::get('free_link_limit', 50);

        $features = $freePlan->features ?? [
            'short_link' => true,
            'dashboard_analytics' => true,
            'qr_code_generator' => true,
            'custom_slug' => true,
            'monthly_link_limit' => $defaultFreeLimit,
            'analytics_retention_days' => 7,
            'password' => false,
            'expires_at' => false,
            'qr_customization' => false,
            'api_access' => false,
            'custom_domain' => false,
            'priority_support' => false,
        ];
        $features['monthly_link_limit'] = $defaultFreeLimit;

        return [
            'type' => 'free',
            'name' => $freePlan->name ?? 'Free',
            'slug' => 'free',
            'status' => 'free',
            'status_label' => 'Paket Gratis',
            'cycle' => 'monthly',
            'ends_at' => null,
            'cancels_at' => null,
            'features' => $features,
        ];
    }

    /**
     * Check if user has reached their monthly link quota based on entitlement snapshot.
     */
    public function hasReachedLinkQuota(User $user): bool
    {
        if (config('pendekin.free_mode', true)) {
            return false;
        }

        if ($user->isAdmin()) {
            return false;
        }

        $subscription = $this->getActiveSubscription($user);
        $defaultFreeQuota = (int) \App\Models\SystemSetting::get('free_link_limit', 50);
        $linkLimit = $subscription ? (int) $subscription->getEntitlement('monthly_link_limit', $defaultFreeQuota) : $defaultFreeQuota;

        if ($linkLimit === 0) {
            return false; // Unlimited
        }

        $currentUsage = \App\Models\ShortLink::where('user_id', $user->id)
            ->where('created_at', '>=', now()->startOfMonth())
            ->count();

        return $currentUsage >= $linkLimit;
    }

    /**
     * Check if user is entitled to custom domain.
     */
    public function canUseCustomDomain(User $user): bool
    {
        if (config('pendekin.free_mode', true)) {
            return true;
        }

        if ($user->isAdmin()) {
            return true;
        }

        $subscription = $this->getActiveSubscription($user);

        return $subscription ? (bool) $subscription->getEntitlement('custom_domain', false) : false;
    }

    /**
     * Check if user is entitled to custom slug.
     */
    public function canUseCustomSlug(User $user): bool
    {
        if (config('pendekin.free_mode', true)) {
            return true;
        }

        if ($user->isAdmin()) {
            return true;
        }

        $subscription = $this->getActiveSubscription($user);

        return $subscription ? (bool) $subscription->getEntitlement('custom_slug', true) : true;
    }

    /**
     * Check if user is entitled to use link password.
     */
    public function canUsePassword(User $user): bool
    {
        if (config('pendekin.free_mode', true)) {
            return true;
        }

        if ($user->isAdmin()) {
            return true;
        }

        $subscription = $this->getActiveSubscription($user);

        return $subscription ? (bool) $subscription->getEntitlement('password', false) : false;
    }

    /**
     * Check if user is entitled to use link expiration.
     */
    public function canUseExpiration(User $user): bool
    {
        if (config('pendekin.free_mode', true)) {
            return true;
        }

        if ($user->isAdmin()) {
            return true;
        }

        $subscription = $this->getActiveSubscription($user);

        return $subscription ? (bool) $subscription->getEntitlement('expires_at', false) : false;
    }

    /**
     * Check if user is entitled to customize QR codes.
     */
    public function canUseQrCustomization(User $user): bool
    {
        if (config('pendekin.free_mode', true)) {
            return true;
        }

        if ($user->isAdmin()) {
            return true;
        }

        $subscription = $this->getActiveSubscription($user);

        return $subscription ? (bool) $subscription->getEntitlement('qr_customization', false) : false;
    }

    /**
     * Check if user is entitled to full API access.
     */
    public function canAccessApi(User $user): bool
    {
        if (config('pendekin.free_mode', true)) {
            return true;
        }

        if ($user->isAdmin()) {
            return true;
        }

        $subscription = $this->getActiveSubscription($user);

        return $subscription ? (bool) $subscription->getEntitlement('api_access', false) : false;
    }

    /**
     * Get analytics retention days.
     */
    public function getAnalyticsRetentionDays(User $user): int
    {
        if (config('pendekin.free_mode', true)) {
            return 0; // Unlimited
        }

        if ($user->isAdmin()) {
            return 0; // Admin basically unlimited
        }

        $subscription = $this->getActiveSubscription($user);

        return $subscription ? (int) $subscription->getEntitlement('analytics_retention_days', 7) : 7;
    }
}
