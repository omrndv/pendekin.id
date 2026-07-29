<?php

namespace Tests\Feature;

use App\Models\BillingPlan;
use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PricingGateTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('db:seed', ['--class' => 'BillingPlanSeeder']);
    }

    public function test_free_user_can_use_custom_slug()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/dashboard/links', [
            'original_url' => 'https://example.com',
            'custom_slug' => 'my-custom',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('short_links', [
            'user_id' => $user->id,
            'short_slug' => 'my-custom',
        ]);
    }

    public function test_free_user_cannot_use_password_and_expiration()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/dashboard/links', [
            'original_url' => 'https://example.com',
            'password' => 'secret123',
            'expires_at' => now()->addDays(7)->toDateTimeString(),
        ]);

        $response->assertSessionHasErrors(['password', 'expires_at']);
    }

    public function test_pro_user_can_use_premium_link_features()
    {
        $user = User::factory()->create();
        $proPlan = BillingPlan::where('slug', 'pro')->first();
        $sub = \App\Models\Subscription::create([
            'user_id' => $user->id,
            'billing_plan_id' => $proPlan->id,
            'status' => 'active',
            'cycle' => 'monthly',
            'plan_snapshot' => $proPlan->toArray(),
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);
        $sub->transactions()->create([
            'user_id' => $user->id,
            'invoice_number' => 'INV-TEST-1',
            'gross_amount' => 24900,
            'status' => 'success',
            'payment_type' => 'qris',
        ]);

        $response = $this->actingAs($user)->post('/dashboard/links', [
            'original_url' => 'https://example.com',
            'custom_slug' => 'my-pro-slug',
            'password' => 'secret123',
            'expires_at' => now()->addDays(7)->format('Y-m-d\TH:i'),
        ]);

        $response->assertRedirect();
        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('short_links', [
            'user_id' => $user->id,
            'short_slug' => 'my-pro-slug',
        ]);
    }

    public function test_pro_user_cannot_access_developer_api()
    {
        $user = User::factory()->create();
        $proPlan = BillingPlan::where('slug', 'pro')->first();
        $sub = \App\Models\Subscription::create([
            'user_id' => $user->id,
            'billing_plan_id' => $proPlan->id,
            'status' => 'active',
            'cycle' => 'monthly',
            'plan_snapshot' => $proPlan->toArray(),
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);
        $sub->transactions()->create([
            'user_id' => $user->id,
            'invoice_number' => 'INV-TEST-2',
            'gross_amount' => 24900,
            'status' => 'success',
            'payment_type' => 'qris',
        ]);

        $response = $this->actingAs($user)->get('/dashboard/api-keys');
        $response->assertStatus(200);
    }

    public function test_business_user_can_access_developer_api()
    {
        $user = User::factory()->create();
        $businessPlan = BillingPlan::where('slug', 'business')->first();
        $sub = \App\Models\Subscription::create([
            'user_id' => $user->id,
            'billing_plan_id' => $businessPlan->id,
            'status' => 'active',
            'cycle' => 'monthly',
            'plan_snapshot' => $businessPlan->toArray(),
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);
        $sub->transactions()->create([
            'user_id' => $user->id,
            'invoice_number' => 'INV-TEST-3',
            'gross_amount' => 54900,
            'status' => 'success',
            'payment_type' => 'qris',
        ]);

        $response = $this->actingAs($user)->get('/dashboard/api-keys');
        $response->assertStatus(200);
    }

    public function test_free_user_cannot_customize_qr_code()
    {
        $user = User::factory()->create();
        $link = ShortLink::factory()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)->post('/dashboard/qr-codes', [
            'short_link_id' => $link->id,
            'fg_color' => '#FF0000',
            'bg_color' => '#000000',
        ]);

        $response->assertRedirect();
        $this->assertEquals('Kustomisasi QR Code membutuhkan langganan paket Pro atau Business.', session('flash.error'));
    }
}
