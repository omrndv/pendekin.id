<?php

namespace App\Actions;

use Illuminate\Support\Str;

class GenerateSlugAction
{
    public function execute(?string $customSlug = null): string
    {
        if ($customSlug && trim($customSlug) !== '') {
            return Str::slug($customSlug);
        }

        $length = config('pendekin.slug.default_length', 6);
        $alphabet = config('pendekin.slug.alphabet', '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ');
        $alphabetLength = strlen($alphabet);

        $slug = '';
        for ($i = 0; $i < $length; $i++) {
            $slug .= $alphabet[random_int(0, $alphabetLength - 1)];
        }

        return $slug;
    }
}
