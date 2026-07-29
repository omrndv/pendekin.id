<?php

namespace App\DTOs;

readonly class ClickDataDTO
{
    public function __construct(
        public int $shortLinkId,
        public ?string $ipAddress = null,
        public ?string $countryCode = null,
        public ?string $countryName = null,
        public ?string $city = null,
        public string $deviceType = 'desktop',
        public ?string $browser = null,
        public ?string $os = null,
        public ?string $referrer = null,
        public ?string $clickedAt = null,
    ) {}
}
