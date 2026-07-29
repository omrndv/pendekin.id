<?php

namespace App\Enums;

enum UserRole: string
{
    case USER = 'user';
    case ADMIN = 'admin';
    case MODERATOR = 'moderator';

    public function label(): string
    {
        return match ($this) {
            self::USER => 'User Standard',
            self::ADMIN => 'Administrator',
            self::MODERATOR => 'Moderator',
        };
    }
}
