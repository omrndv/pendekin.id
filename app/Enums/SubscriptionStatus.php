<?php

namespace App\Enums;

enum SubscriptionStatus: string
{
    case PENDING = 'pending';
    case TRIALING = 'trialing';
    case ACTIVE = 'active';
    case GRACE_PERIOD = 'grace_period';
    case EXPIRED = 'expired';
    case CANCELLED = 'cancelled';
    case FAILED = 'failed';
    case SUSPENDED = 'suspended';

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Menunggu Pembayaran',
            self::TRIALING => 'Masa Trial',
            self::ACTIVE => 'Aktif',
            self::GRACE_PERIOD => 'Masa Tenggang (Grace Period)',
            self::EXPIRED => 'Kedaluwarsa',
            self::CANCELLED => 'Dibatalkan',
            self::FAILED => 'Gagal Pembayaran',
            self::SUSPENDED => 'Ditangguhkan',
        };
    }
}
