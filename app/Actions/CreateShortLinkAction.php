<?php

namespace App\Actions;

use App\DTOs\CreateLinkDTO;
use App\Models\ShortLink;
use App\Repositories\Contracts\LinkRepositoryInterface;
use App\Services\SlugGeneratorService;
use App\Support\UrlSanitizer;

class CreateShortLinkAction
{
    public function __construct(
        protected LinkRepositoryInterface $linkRepository,
        protected SlugGeneratorService $slugGeneratorService,
        protected \App\Services\UsageTrackerService $usageTracker,
    ) {}

    public function execute(CreateLinkDTO $dto): ShortLink
    {
        $normalizedUrl = UrlSanitizer::normalize($dto->originalUrl);
        $slug = $this->slugGeneratorService->generate($dto->customSlug);

        $link = $this->linkRepository->create([
            'user_id' => $dto->userId,
            'team_id' => $dto->teamId,
            'title' => \Illuminate\Support\Str::limit($dto->title ?? UrlSanitizer::normalize($dto->originalUrl), 250, ''),
            'original_url' => $normalizedUrl,
            'short_slug' => $slug,
            'domain' => $dto->domain ?? config('pendekin.default_domain'),
            'is_custom_slug' => ! empty($dto->customSlug),
            'password_hash' => $dto->password ? bcrypt($dto->password) : null,
            'expires_at' => $dto->expiresAt,
            'max_clicks' => $dto->maxClicks,
            'is_active' => true,
        ]);

        if ($dto->userId) {
            $user = \App\Models\User::find($dto->userId);
            if ($user) {
                $this->usageTracker->increment($user, 'monthly_links');
            }
        }

        return $link;
    }
}
