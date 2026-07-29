<?php

namespace Tests\Feature;

use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ShortLinkTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_short_link(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/dashboard/links', [
            'original_url' => 'https://example.com/long-page-url',
            'title' => 'Test Link',
            'custom_slug' => 'test-link-alias',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('short_links', [
            'user_id' => $user->id,
            'short_slug' => 'test-link-alias',
            'original_url' => 'https://example.com/long-page-url',
        ]);
    }

    public function test_cannot_use_reserved_slug(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/dashboard/links', [
            'original_url' => 'https://example.com',
            'custom_slug' => 'admin',
        ]);

        $response->assertSessionHasErrors(['custom_slug']);
        $this->assertDatabaseMissing('short_links', [
            'short_slug' => 'admin',
        ]);
    }

    public function test_user_can_soft_delete_and_restore_link(): void
    {
        $user = User::factory()->create();
        $link = ShortLink::factory()->create([
            'user_id' => $user->id,
            'short_slug' => 'my-link',
        ]);

        // Soft delete
        $this->actingAs($user)->delete("/dashboard/links/{$link->id}");
        $this->assertSoftDeleted('short_links', ['id' => $link->id]);

        // Restore
        $this->actingAs($user)->post("/dashboard/links/{$link->id}/restore");
        $this->assertDatabaseHas('short_links', [
            'id' => $link->id,
            'deleted_at' => null,
        ]);
    }

    public function test_user_cannot_delete_others_link(): void
    {
        $userA = User::factory()->create();
        $userB = User::factory()->create();

        $linkA = ShortLink::factory()->create([
            'user_id' => $userA->id,
        ]);

        $response = $this->actingAs($userB)->delete("/dashboard/links/{$linkA->id}");
        $response->assertStatus(403);
    }
}
