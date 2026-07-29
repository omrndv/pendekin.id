<?php

namespace App\Enums;

enum UserStatus: string
{
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';
    case PENDING = 'pending';

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Aktif',
            self::SUSPENDED => 'Dibekukan (Suspended)',
            self::PENDING => 'Menunggu Verifikasi',
        };
    }
}
