<?php

namespace App\Jobs;

use App\DTOs\ClickDataDTO;
use App\Models\ClickAnalytics;
use App\Repositories\Contracts\LinkRepositoryInterface;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessClickAnalyticsJob implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public ClickDataDTO $clickData
    ) {}

    public function handle(LinkRepositoryInterface $linkRepository): void
    {
        // 1. Create analytics entry
        ClickAnalytics::create([
            'short_link_id' => $this->clickData->shortLinkId,
            'ip_address' => $this->clickData->ipAddress,
            'country_code' => $this->clickData->countryCode,
            'country_name' => $this->clickData->countryName,
            'city' => $this->clickData->city,
            'device_type' => $this->clickData->deviceType,
            'browser' => $this->clickData->browser,
            'os' => $this->clickData->os,
            'referrer' => $this->clickData->referrer,
            'clicked_at' => $this->clickData->clickedAt ?? now(),
        ]);

        // 2. Increment clicks count in repository
        $linkRepository->incrementClicks($this->clickData->shortLinkId);
    }
}
