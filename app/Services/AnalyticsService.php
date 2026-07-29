<?php

namespace App\Services;

use App\Models\ClickAnalytics;
use App\Models\ShortLink;
use Illuminate\Support\Facades\DB;

class AnalyticsService
{
    /**
     * Get aggregate traffic summary for a user.
     */
    public function getSummaryForUser(int $userId): array
    {
        $user = \App\Models\User::find($userId);
        $retentionDays = app(FeatureGateService::class)->getAnalyticsRetentionDays($user);
        if ($retentionDays === 0) {
            $retentionDays = 36500; // Treat 0 as unlimited (approx 100 years)
        }
        $retentionDate = now()->subDays($retentionDays);

        $linkIds = ShortLink::where('user_id', $userId)->pluck('id');

        $totalClicks = ShortLink::where('user_id', $userId)->sum('clicks_count');

        $clicksDaysToCheck = min($retentionDays, 30);
        $clicks30Days = ClickAnalytics::whereIn('short_link_id', $linkIds)
            ->where('clicked_at', '>=', now()->subDays($clicksDaysToCheck))
            ->count();

        $topCountry = ClickAnalytics::whereIn('short_link_id', $linkIds)
            ->where('clicked_at', '>=', $retentionDate)
            ->select('country_name', DB::raw('count(*) as total'))
            ->groupBy('country_name')
            ->orderByDesc('total')
            ->first();

        $topDevice = ClickAnalytics::whereIn('short_link_id', $linkIds)
            ->where('clicked_at', '>=', $retentionDate)
            ->select('device_type', DB::raw('count(*) as total'))
            ->groupBy('device_type')
            ->orderByDesc('total')
            ->first();

        return [
            'total_clicks' => $totalClicks,
            'clicks_30_days' => $clicks30Days,
            'top_country' => $topCountry ? $topCountry->country_name : '-',
            'top_device' => $topDevice ? ucfirst(is_object($topDevice->device_type) ? $topDevice->device_type->value : $topDevice->device_type) : '-',
        ];
    }

    /**
     * Get daily click trends for up to max days allowed by retention.
     */
    public function getClickTrends(int $userId, int $days = 7): array
    {
        $user = \App\Models\User::find($userId);
        $retentionDays = app(FeatureGateService::class)->getAnalyticsRetentionDays($user);
        if ($retentionDays === 0) {
            $retentionDays = 36500;
        }
        $days = min($days, $retentionDays);

        $linkIds = ShortLink::where('user_id', $userId)->pluck('id');

        $analytics = ClickAnalytics::whereIn('short_link_id', $linkIds)
            ->where('clicked_at', '>=', now()->subDays($days))
            ->select(DB::raw('DATE(clicked_at) as date'), DB::raw('count(*) as clicks'))
            ->groupBy('date')
            ->pluck('clicks', 'date')
            ->toArray();

        $result = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayName = now()->subDays($i)->isoFormat('dd');
            $result[] = [
                'date' => $date,
                'day' => $dayName,
                'clicks' => $analytics[$date] ?? 0,
            ];
        }

        return $result;
    }

    /**
     * Get country breakdown.
     */
    public function getCountryBreakdown(int $userId): array
    {
        $user = \App\Models\User::find($userId);
        $retentionDays = app(FeatureGateService::class)->getAnalyticsRetentionDays($user);
        if ($retentionDays === 0) {
            $retentionDays = 36500;
        }
        $retentionDate = now()->subDays($retentionDays);

        $linkIds = ShortLink::where('user_id', $userId)->pluck('id');

        $baseQuery = ClickAnalytics::whereIn('short_link_id', $linkIds)
            ->where('clicked_at', '>=', $retentionDate);

        $total = (clone $baseQuery)->count() ?: 1;

        return $baseQuery
            ->select('country_name', DB::raw('count(*) as count'))
            ->groupBy('country_name')
            ->orderByDesc('count')
            ->limit(5)
            ->get()
            ->map(fn ($row) => [
                'country' => $row->country_name ?? 'Indonesia',
                'count' => $row->count,
                'percentage' => round(($row->count / $total) * 100, 1),
            ])
            ->toArray();
    }

    /**
     * Get device breakdown.
     */
    public function getDeviceBreakdown(int $userId): array
    {
        $user = \App\Models\User::find($userId);
        $retentionDays = app(FeatureGateService::class)->getAnalyticsRetentionDays($user);
        if ($retentionDays === 0) {
            $retentionDays = 36500;
        }
        $retentionDate = now()->subDays($retentionDays);

        $linkIds = ShortLink::where('user_id', $userId)->pluck('id');

        $baseQuery = ClickAnalytics::whereIn('short_link_id', $linkIds)
            ->where('clicked_at', '>=', $retentionDate);

        $total = (clone $baseQuery)->count() ?: 1;

        return $baseQuery
            ->select('device_type', DB::raw('count(*) as count'))
            ->groupBy('device_type')
            ->orderByDesc('count')
            ->get()
            ->map(fn ($row) => [
                'name' => ucfirst($row->device_type->value ?? 'Desktop'),
                'count' => $row->count,
                'percentage' => round(($row->count / $total) * 100, 1),
            ])
            ->toArray();
    }
}
