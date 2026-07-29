<?php

namespace App\Services;

use App\Exceptions\SlugAlreadyExistsException;
use App\Repositories\Contracts\LinkRepositoryInterface;
use Illuminate\Support\Str;

class SlugGeneratorService
{
    public function __construct(
        protected LinkRepositoryInterface $linkRepository
    ) {}

    /**
     * Generate or validate a slug with collision retry fallback.
     */
    public function generate(?string $customSlug = null): string
    {
        // Custom slug handling
        if ($customSlug && trim($customSlug) !== '') {
            $normalizedSlug = Str::slug($customSlug);

            $this->validateCustomSlug($normalizedSlug);

            $existing = $this->linkRepository->findBySlug($normalizedSlug);
            if ($existing) {
                throw new SlugAlreadyExistsException("Alias '{$normalizedSlug}' sudah digunakan oleh link lain.");
            }

            return $normalizedSlug;
        }

        // Random slug generation loop with collision handling
        $maxRetries = 5;
        $length = config('pendekin.slug.default_length', 6);
        $alphabet = config('pendekin.slug.alphabet', '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ');
        $alphabetLength = strlen($alphabet);

        for ($attempt = 0; $attempt < $maxRetries; $attempt++) {
            // Increase length slightly on higher retry attempts to prevent infinite collision loops
            $currentLength = $length + intdiv($attempt, 2);

            $slug = '';
            for ($i = 0; $i < $currentLength; $i++) {
                $slug .= $alphabet[random_int(0, $alphabetLength - 1)];
            }

            if (! $this->isReserved($slug) && ! $this->linkRepository->findBySlug($slug)) {
                return $slug;
            }
        }

        // Fallback to high-entropy UUID slug if retries exhausted
        return Str::lower(Str::random($length + 2));
    }

    /**
     * Validate custom slug against reserved routing keywords.
     */
    public function validateCustomSlug(string $slug): void
    {
        if ($this->isReserved($slug)) {
            throw new SlugAlreadyExistsException("Alias '{$slug}' bersifat reserved untuk sistem dan tidak dapat digunakan.");
        }
    }

    /**
     * Check if slug is a reserved system keyword.
     */
    public function isReserved(string $slug): bool
    {
        $reserved = config('pendekin.slug.reserved', []);

        return in_array(strtolower($slug), array_map('strtolower', $reserved), true);
    }
}
