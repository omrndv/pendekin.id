<?php

namespace Tests\Feature;

use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PendingUrlTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_pass_pending_url_and_gets_shortened_post_login(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $pendingUrl = 'https://google.com/search?q=laravel';

        // 1. Visit login page with pending_url query param
        $this->get(route('login', ['pending_url' => $pendingUrl]))
            ->assertStatus(200);

        // Verify session now has pending_url
        $this->assertEquals($pendingUrl, session('pending_url'));

        // 2. Submit login form
        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        // Should redirect to dashboard
        $response->assertRedirect(route('dashboard'));

        // Verify link is automatically created for this user
        $this->assertDatabaseHas('short_links', [
            'user_id' => $user->id,
            'original_url' => $pendingUrl,
        ]);

        // Session variable is pulled/cleared
        $this->assertFalse(session()->has('pending_url'));
    }

    public function test_guest_can_pass_pending_url_and_gets_shortened_post_registration(): void
    {
        $pendingUrl = 'https://github.com/trending';

        // 1. Visit register page with pending_url query param
        $this->get(route('register', ['pending_url' => $pendingUrl]))
            ->assertStatus(200);

        // Verify session now has pending_url
        $this->assertEquals($pendingUrl, session('pending_url'));

        // 2. Submit registration form
        $response = $this->post(route('register'), [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'Password123!',
            'password_confirmation' => 'Password123!',
        ]);

        // Should redirect to dashboard
        $response->assertRedirect(route('dashboard'));

        $user = User::where('email', 'john@example.com')->first();
        $this->assertNotNull($user);

        // Verify link is automatically created for this user
        $this->assertDatabaseHas('short_links', [
            'user_id' => $user->id,
            'original_url' => $pendingUrl,
        ]);

        // Session variable is pulled/cleared
        $this->assertFalse(session()->has('pending_url'));
    }

    public function test_guest_cannot_shorten_pending_url_if_quota_reached(): void
    {
        \App\Models\SystemSetting::set('free_link_limit', 4);

        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        // Create 4 links for the free user (Free limit is 4 active links)
        ShortLink::factory()->count(4)->create([
            'user_id' => $user->id,
            'is_active' => true,
        ]);

        $pendingUrl = 'https://google.com/search?q=laravel';

        // 1. Visit login page with pending_url query param
        $this->get(route('login', ['pending_url' => $pendingUrl]));

        // 2. Submit login form
        $response = $this->post(route('login'), [
            'email' => $user->email,
            'password' => 'password123',
        ]);

        // Should redirect to dashboard
        $response->assertRedirect(route('dashboard'));

        // Verify link is NOT created for this user
        $this->assertDatabaseMissing('short_links', [
            'user_id' => $user->id,
            'original_url' => $pendingUrl,
        ]);

        // Verify error flash is set
        $this->assertEquals(
            'Gagal membuat link otomatis: Kuota bulanan link Anda sudah habis. Silakan upgrade paket Anda.',
            session('flash.error')
        );
    }
}
