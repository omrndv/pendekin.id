<?php

namespace Tests\Feature;

use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RedirectEngineTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_redirect_resolves_correctly(): void
    {
        $user = User::factory()->create();
        $link = ShortLink::factory()->create([
            'user_id' => $user->id,
            'short_slug' => 'promo-2026',
            'original_url' => 'https://example.com/target-page',
            'is_active' => true,
        ]);

        $response = $this->get('/promo-2026');

        $response->assertStatus(302);
        $response->assertRedirect('https://example.com/target-page');
    }

    public function test_inactive_link_returns_404(): void
    {
        $user = User::factory()->create();
        $link = ShortLink::factory()->create([
            'user_id' => $user->id,
            'short_slug' => 'disabled-link',
            'is_active' => false,
        ]);

        $response = $this->get('/disabled-link');
        $response->assertStatus(404);
    }

    public function test_password_protected_link_prompts_password(): void
    {
        $user = User::factory()->create();
        $link = ShortLink::factory()->create([
            'user_id' => $user->id,
            'short_slug' => 'secret-page',
            'password_hash' => bcrypt('secret123'),
            'is_active' => true,
        ]);

        // Attempt redirect without unlocking -> should render prompt modal/page
        $response = $this->get('/secret-page');
        $response->assertStatus(200);

        // Submit wrong password
        $this->post('/secret-page/unlock', ['password' => 'wrongpass'])
            ->assertSessionHasErrors(['password']);

        // Submit correct password
        $this->post('/secret-page/unlock', ['password' => 'secret123'])
            ->assertRedirect('/secret-page');

        // Access again after unlock -> redirects cleanly
        $this->get('/secret-page')->assertRedirect($link->original_url);
    }
}
