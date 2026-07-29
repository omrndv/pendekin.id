<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BillingAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_non_admin_cannot_access_admin_billing(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);

        $response = $this->actingAs($user)->get('/admin/billing');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_billing(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);

        $response = $this->actingAs($admin)->get('/admin/billing');
        $response->assertStatus(200);
    }
}
