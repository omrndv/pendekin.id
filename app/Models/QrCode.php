<?php

namespace App\Models;

use App\Enums\QrFormat;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QrCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'short_link_id',
        'fg_color',
        'bg_color',
        'logo_path',
        'format',
        'file_path',
    ];

    protected function casts(): array
    {
        return [
            'format' => QrFormat::class,
        ];
    }

    public function shortLink(): BelongsTo
    {
        return $this->belongsTo(ShortLink::class);
    }
}
