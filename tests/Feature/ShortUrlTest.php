<?php

namespace Tests\Feature;

use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShortUrlTest extends TestCase
{
    use RefreshDatabase;

    public function test_short_link_url_uses_app_url_config_dynamically(): void
    {
        config(['app.url' => 'https://pendekin.site']);

        $user = User::factory()->create();
        $link = ShortLink::create([
            'user_id' => $user->id,
            'title' => 'Test Link',
            'original_url' => 'https://example.com',
            'short_slug' => 'abc1234',
        ]);

        $this->assertEquals('https://pendekin.site/abc1234', $link->short_url);
    }
}
