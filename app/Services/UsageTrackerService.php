<?php

namespace App\Services;

use App\Models\UsageRecord;
use App\Models\User;

class UsageTrackerService
{
    /**
     * Increment usage count for a given feature key in current billing period.
     */
    public function increment(User $user, string $featureKey, int $amount = 1): void
    {
        $period = now()->format('Y-m');

        $record = UsageRecord::firstOrCreate(
            ['user_id' => $user->id, 'feature_key' => $featureKey, 'billing_period' => $period],
            ['usage_count' => 0]
        );

        $record->increment('usage_count', $amount);
    }

    /**
     * Get current period usage count for a feature.
     */
    public function getUsage(User $user, string $featureKey): int
    {
        $period = now()->format('Y-m');

        $record = UsageRecord::where('user_id', $user->id)
            ->where('feature_key', $featureKey)
            ->where('billing_period', $period)
            ->first();

        return $record ? (int) $record->usage_count : 0;
    }
}
