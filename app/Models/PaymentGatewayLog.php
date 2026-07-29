<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentGatewayLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_number',
        'gateway_provider',
        'event_type',
        'payload_raw',
        'response_raw',
        'ip_address',
    ];

    protected function casts(): array
    {
        return [
            'payload_raw' => 'array',
            'response_raw' => 'array',
        ];
    }
}
