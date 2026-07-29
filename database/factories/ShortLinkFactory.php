<?php

namespace Database\Factories;

use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ShortLinkFactory extends Factory
{
    protected $model = ShortLink::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => $this->faker->sentence(3),
            'original_url' => $this->faker->url(),
            'short_slug' => Str::random(6),
            'domain' => config('pendekin.default_domain'),
            'is_active' => true,
            'clicks_count' => 0,
        ];
    }
}
