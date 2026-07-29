<?php

namespace App\Models;

use App\Enums\BillingCycle;
use App\Enums\SubscriptionStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'billing_plan_id',
        'cycle',
        'status',
        'plan_snapshot',
        'trial_started_at',
        'trial_ends_at',
        'starts_at',
        'ends_at',
        'cancels_at',
        'failed_attempts',
    ];

    protected function casts(): array
    {
        return [
            'status' => SubscriptionStatus::class,
            'cycle' => BillingCycle::class,
            'plan_snapshot' => 'array',
            'trial_started_at' => 'datetime',
            'trial_ends_at' => 'datetime',
            'starts_at' => 'datetime',
            'ends_at' => 'datetime',
            'cancels_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function plan(): BelongsTo
    {
        return $this->belongsTo(BillingPlan::class, 'billing_plan_id');
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(PaymentTransaction::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(SubscriptionEvent::class);
    }

    public function isActive(): bool
    {
        return in_array($this->status, [SubscriptionStatus::ACTIVE, SubscriptionStatus::TRIALING], true);
    }

    public function isTrial(): bool
    {
        return $this->status === SubscriptionStatus::TRIALING;
    }

    /**
     * Get dynamic feature entitlement value from JSON plan_snapshot.
     */
    public function getEntitlement(string $featureKey, mixed $default = null): mixed
    {
        if (empty($this->plan_snapshot['features'])) {
            return $default;
        }

        return $this->plan_snapshot['features'][$featureKey] ?? $default;
    }
}
