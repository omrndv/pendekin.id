<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Pendekin Core SaaS Configuration
    |--------------------------------------------------------------------------
    |
    | High-performance configuration for URL Shortening, Redis Caching,
    | Rate Limiting, and SaaS Domain Defaults.
    |
    */

    'default_domain' => env('PENDEKIN_DEFAULT_DOMAIN', env('APP_URL', 'http://127.0.0.1:8000')),

    'free_mode' => env('PENDEKIN_FREE_MODE', true),

    'slug' => [
        'default_length' => (int) env('PENDEKIN_SLUG_LENGTH', 6),
        'alphabet' => '23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ',
        'reserved' => [
            'login', 'register', 'logout', 'dashboard', 'admin', 'profile',
            'api', 'auth', 'health', 'up', 'privacy', 'terms', 'billing',
        ],
    ],

    'cache' => [
        'enabled' => env('PENDEKIN_CACHE_ENABLED', true),
        'ttl_seconds' => (int) env('PENDEKIN_CACHE_TTL', 86400), // 24 hours
        'prefix' => 'pendekin:slug:',
    ],

    'rate_limiting' => [
        'public_redirect' => (int) env('PENDEKIN_RATE_LIMIT_REDIRECT', 300), // per minute
        'api_requests' => (int) env('PENDEKIN_RATE_LIMIT_API', 60), // per minute
    ],

    'analytics' => [
        'async' => env('PENDEKIN_ASYNC_ANALYTICS', true),
        'anonymize_ip' => env('PENDEKIN_ANONYMIZE_IP', false),
    ],
];
