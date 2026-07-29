<?php

namespace App\Repositories\Eloquent;

use App\Models\ShortLink;
use App\Repositories\Contracts\LinkRepositoryInterface;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;

class LinkRepository implements LinkRepositoryInterface
{
    public function findBySlug(string $slug): ?ShortLink
    {
        return ShortLink::where('short_slug', $slug)->first();
    }

    public function findBySlugActive(string $slug): ?ShortLink
    {
        $cacheTtl = config('pendekin.cache.ttl_seconds', 86400);
        $cachePrefix = config('pendekin.cache.prefix', 'pendekin:slug:');

        return Cache::remember($cachePrefix.$slug, $cacheTtl, function () use ($slug) {
            return ShortLink::where('short_slug', $slug)
                ->where('is_active', true)
                ->where('is_flagged', false)
                ->first();
        });
    }

    public function findByIdWithTrashed(int $id): ?ShortLink
    {
        return ShortLink::withTrashed()->find($id);
    }

    public function getPaginatedForUser(int $userId, int $perPage = 15, ?string $search = null, ?string $status = null): LengthAwarePaginator
    {
        $query = ShortLink::where('user_id', $userId);

        if ($status === 'archived') {
            $query->onlyTrashed()->latest('deleted_at');
        } else {
            $query->latest();
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('short_slug', 'like', "%{$search}%")
                    ->orWhere('original_url', 'like', "%{$search}%");
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getPaginatedGlobal(int $perPage = 15, ?string $search = null, ?string $flagged = null): LengthAwarePaginator
    {
        $query = ShortLink::withTrashed()->with('user')->latest();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('short_slug', 'like', "%{$search}%")
                    ->orWhere('original_url', 'like', "%{$search}%");
            });
        }

        if ($flagged === 'flagged') {
            $query->where('is_flagged', true);
        } elseif ($flagged === 'normal') {
            $query->where('is_flagged', false);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function create(array $data): ShortLink
    {
        return ShortLink::create($data);
    }

    public function update(ShortLink $link, array $data): bool
    {
        $updated = $link->update($data);
        if ($updated) {
            $this->forgetCache($link->short_slug);
        }

        return $updated;
    }

    public function delete(ShortLink $link): bool
    {
        $this->forgetCache($link->short_slug);

        return $link->delete();
    }

    public function restore(ShortLink $link): bool
    {
        $restored = $link->restore();
        if ($restored) {
            $this->forgetCache($link->short_slug);
        }

        return $restored;
    }

    public function toggleStatus(ShortLink $link): bool
    {
        $newStatus = ! $link->is_active;
        $updated = $link->update(['is_active' => $newStatus]);
        if ($updated) {
            $this->forgetCache($link->short_slug);
        }

        return $updated;
    }

    public function incrementClicks(int $linkId): void
    {
        ShortLink::where('id', $linkId)->increment('clicks_count');
    }

    protected function forgetCache(string $slug): void
    {
        $cachePrefix = config('pendekin.cache.prefix', 'pendekin:slug:');
        Cache::forget($cachePrefix.$slug);
    }
}
