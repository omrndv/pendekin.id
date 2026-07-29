<?php

namespace Tests\Feature;

use App\Models\ShortLink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class QRCodeTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->artisan('db:seed', ['--class' => 'BillingPlanSeeder']);
    }

    private function giveProPlan(User $user)
    {
        $plan = \App\Models\BillingPlan::where('slug', 'pro')->first();
        $sub = \App\Models\Subscription::create([
            'user_id' => $user->id,
            'billing_plan_id' => $plan->id,
            'status' => 'active',
            'cycle' => 'monthly',
            'plan_snapshot' => $plan->toArray(),
            'starts_at' => now(),
            'ends_at' => now()->addMonth(),
        ]);
        $sub->transactions()->create([
            'user_id' => $user->id,
            'invoice_number' => 'INV-TEST-'.uniqid(),
            'gross_amount' => 24900,
            'status' => 'success',
            'payment_type' => 'qris',
        ]);
    }

    public function test_user_can_generate_qr_code_for_owned_short_link(): void
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->giveProPlan($user);

        $link = ShortLink::create([
            'user_id' => $user->id,
            'title' => 'Test Link',
            'original_url' => 'https://example.com',
            'short_slug' => 'qrslug12',
        ]);

        $response = $this->actingAs($user)->post('/dashboard/qr-codes', [
            'short_link_id' => $link->id,
            'fg_color' => '#10B981',
            'bg_color' => '#FFFFFF',
        ]);

        $response->assertStatus(302);
        $this->assertDatabaseHas('qr_codes', [
            'short_link_id' => $link->id,
            'fg_color' => '#10B981',
        ]);
    }

    public function test_user_cannot_generate_qr_code_for_unowned_short_link(): void
    {
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $this->giveProPlan($user2); // Give pro plan so it bypasses feature gate and hits authorization gate

        $link = ShortLink::create([
            'user_id' => $user1->id,
            'title' => 'Test Link',
            'original_url' => 'https://example.com',
            'short_slug' => 'qrslug99',
        ]);

        $response = $this->actingAs($user2)->post('/dashboard/qr-codes', [
            'short_link_id' => $link->id,
            'fg_color' => '#10B981',
            'bg_color' => '#FFFFFF',
        ]);

        $response->assertStatus(403);
    }
}
