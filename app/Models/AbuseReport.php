<?php

namespace App\Models;

use App\Enums\ReportStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AbuseReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'short_link_id',
        'reporter_email',
        'reason',
        'severity',
        'description',
        'screenshot_path',
        'status',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'status' => ReportStatus::class,
        ];
    }

    public function shortLink(): BelongsTo
    {
        return $this->belongsTo(ShortLink::class);
    }
}
