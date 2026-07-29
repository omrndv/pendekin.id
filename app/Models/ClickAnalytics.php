<?php

namespace App\Models;

use App\Enums\DeviceType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClickAnalytics extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'short_link_id',
        'ip_address',
        'country_code',
        'country_name',
        'city',
        'device_type',
        'browser',
        'os',
        'referrer',
        'clicked_at',
    ];

    protected function casts(): array
    {
        return [
            'clicked_at' => 'datetime',
            'device_type' => DeviceType::class,
        ];
    }

    public function shortLink(): BelongsTo
    {
        return $this->belongsTo(ShortLink::class);
    }
}
