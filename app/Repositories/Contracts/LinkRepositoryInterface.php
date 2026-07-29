<?php

namespace App\Repositories\Contracts;

use App\Models\ShortLink;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

interface LinkRepositoryInterface
{
    public function findBySlug(string $slug): ?ShortLink;

    public function findBySlugActive(string $slug): ?ShortLink;

    public function findByIdWithTrashed(int $id): ?ShortLink;

    public function getPaginatedForUser(int $userId, int $perPage = 15, ?string $search = null, ?string $status = null): LengthAwarePaginator;

    public function getPaginatedGlobal(int $perPage = 15, ?string $search = null, ?string $flagged = null): LengthAwarePaginator;

    public function create(array $data): ShortLink;

    public function update(ShortLink $link, array $data): bool;

    public function delete(ShortLink $link): bool;

    public function restore(ShortLink $link): bool;

    public function toggleStatus(ShortLink $link): bool;

    public function incrementClicks(int $linkId): void;
}
