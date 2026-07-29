<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class ShortLink extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'team_id',
        'title',
        'original_url',
        'short_slug',
        'domain',
        'is_custom_slug',
        'password_hash',
        'expires_at',
        'max_clicks',
        'clicks_count',
        'is_active',
        'is_flagged',
        'meta_title',
        'meta_description',
    ];

    protected $appends = [
        'short_url',
    ];

    protected function casts(): array
    {
        return [
            'is_custom_slug' => 'boolean',
            'is_active' => 'boolean',
            'is_flagged' => 'boolean',
            'expires_at' => 'datetime',
            'clicks_count' => 'integer',
            'max_clicks' => 'integer',
        ];
    }

    public function getShortUrlAttribute(): string
    {
        $baseUrl = $this->domain ?: config('app.url');
        $baseUrl = rtrim($baseUrl, '/');

        return "{$baseUrl}/{$this->short_slug}";
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function team(): BelongsTo
    {
        return $this->belongsTo(Team::class);
    }

    public function analytics(): HasMany
    {
        return $this->hasMany(ClickAnalytics::class);
    }

    public function qrCode(): HasOne
    {
        return $this->hasOne(QrCode::class);
    }

    public function abuseReports(): HasMany
    {
        return $this->hasMany(AbuseReport::class);
    }

    public function isExpired(): bool
    {
        if ($this->expires_at && $this->expires_at->isPast()) {
            return true;
        }

        if ($this->max_clicks && $this->clicks_count >= $this->max_clicks) {
            return true;
        }

        return false;
    }
}
