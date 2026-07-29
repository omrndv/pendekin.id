<?php

namespace App\DTOs;

use App\Http\Requests\UpdateLinkRequest;

readonly class UpdateLinkDTO
{
    public function __construct(
        public ?string $title = null,
        public ?string $originalUrl = null,
        public ?bool $isActive = null,
        public ?string $password = null,
        public ?string $expiresAt = null,
        public ?int $maxClicks = null,
    ) {}

    public static function fromRequest(UpdateLinkRequest $request): self
    {
        return new self(
            title: $request->validated('title'),
            originalUrl: $request->validated('original_url'),
            isActive: $request->validated('is_active'),
            password: $request->validated('password'),
            expiresAt: $request->validated('expires_at'),
            maxClicks: $request->validated('max_clicks'),
        );
    }
}
