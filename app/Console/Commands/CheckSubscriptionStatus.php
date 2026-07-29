<?php

namespace App\Console\Commands;

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use App\Services\SubscriptionService;
use Illuminate\Console\Command;

class CheckSubscriptionStatus extends Command
{
    protected $signature = 'subscription:check-status';

    protected $description = 'Check and update expired or grace-period subscriptions daily.';

    public function handle(SubscriptionService $subscriptionService): int
    {
        $this->info('Checking subscription statuses...');

        // 1. Check trials that have ended -> mark expired
        $expiredTrials = Subscription::where('status', SubscriptionStatus::TRIALING)
            ->where('trial_ends_at', '<', now())
            ->get();

        foreach ($expiredTrials as $sub) {
            $subscriptionService->expireSubscription($sub);
            $this->info("Trial expired for user #{$sub->user_id}");
        }

        // 2. Check active subscriptions that have passed ends_at -> move to grace_period
        $passedActive = Subscription::where('status', SubscriptionStatus::ACTIVE)
            ->where('ends_at', '<', now())
            ->get();

        foreach ($passedActive as $sub) {
            $subscriptionService->markGracePeriod($sub);
            $this->info("Subscription #{$sub->id} moved to grace period");
        }

        // 3. Check grace period subscriptions that have passed 3-day grace period -> mark expired
        $expiredGrace = Subscription::where('status', SubscriptionStatus::GRACE_PERIOD)
            ->where('ends_at', '<', now()->subDays(3))
            ->get();

        foreach ($expiredGrace as $sub) {
            $subscriptionService->expireSubscription($sub);
            $this->info("Subscription #{$sub->id} fully expired after grace period");
        }

        $this->info('Subscription check completed.');

        return Command::SUCCESS;
    }
}
