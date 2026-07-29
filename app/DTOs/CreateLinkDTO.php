<?php

namespace App\DTOs;

use App\Http\Requests\StoreLinkRequest;

readonly class CreateLinkDTO
{
    public function __construct(
        public string $originalUrl,
        public ?int $userId = null,
        public ?int $teamId = null,
        public ?string $title = null,
        public ?string $customSlug = null,
        public ?string $domain = null,
        public ?string $password = null,
        public ?string $expiresAt = null,
        public ?int $maxClicks = null,
    ) {}

    public static function fromRequest(StoreLinkRequest $request, ?int $userId = null): self
    {
        return new self(
            originalUrl: $request->validated('original_url'),
            userId: $userId ?? $request->user()?->id,
            teamId: $request->validated('team_id'),
            title: $request->validated('title'),
            customSlug: $request->validated('custom_slug'),
            domain: $request->validated('domain'),
            password: $request->validated('password'),
            expiresAt: $request->validated('expires_at'),
            maxClicks: $request->validated('max_clicks'),
        );
    }
}
