<?php

namespace App\Services;

use App\Actions\CreateShortLinkAction;
use App\DTOs\CreateLinkDTO;
use App\DTOs\UpdateLinkDTO;
use App\Exceptions\LinkNotFoundException;
use App\Models\ShortLink;
use App\Repositories\Contracts\LinkRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class LinkService
{
    public function __construct(
        protected LinkRepositoryInterface $linkRepository,
        protected CreateShortLinkAction $createShortLinkAction,
    ) {}

    public function createLink(CreateLinkDTO $dto): ShortLink
    {
        return $this->createShortLinkAction->execute($dto);
    }

    public function resolveActiveLink(string $slug): ShortLink
    {
        $link = $this->linkRepository->findBySlugActive($slug);

        if (! $link || $link->isExpired()) {
            throw new LinkNotFoundException("Short link dengan slug '{$slug}' tidak ditemukan atau sudah kedaluwarsa.");
        }

        return $link;
    }

    public function getUserLinks(int $userId, int $perPage = 15, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        return $this->linkRepository->getPaginatedForUser($userId, $perPage, $search, $status);
    }

    public function getGlobalLinks(int $perPage = 15, ?string $search = null, ?string $flagged = null): LengthAwarePaginator
    {
        return $this->linkRepository->getPaginatedGlobal($perPage, $search, $flagged);
    }

    public function updateLink(ShortLink $link, UpdateLinkDTO $dto): bool
    {
        $data = array_filter([
            'title' => $dto->title,
            'original_url' => $dto->originalUrl,
            'is_active' => $dto->isActive,
            'expires_at' => $dto->expiresAt,
            'max_clicks' => $dto->maxClicks,
        ], fn ($val) => $val !== null);

        if ($dto->password) {
            $data['password_hash'] = bcrypt($dto->password);
        }

        return $this->linkRepository->update($link, $data);
    }

    public function deleteLink(ShortLink $link): bool
    {
        return $this->linkRepository->delete($link);
    }

    public function restoreLink(int $id): bool
    {
        $link = $this->linkRepository->findByIdWithTrashed($id);
        if (! $link) {
            throw new LinkNotFoundException("Link dengan ID #{$id} tidak ditemukan.");
        }

        return $this->linkRepository->restore($link);
    }

    public function toggleStatus(ShortLink $link): bool
    {
        return $this->linkRepository->toggleStatus($link);
    }
}
