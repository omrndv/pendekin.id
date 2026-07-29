<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Contracts\LinkRepositoryInterface::class,
            \App\Repositories\Eloquent\LinkRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        \App\Models\ShortLink::observe(\App\Observers\AuditLogObserver::class);
        \App\Models\User::observe(\App\Observers\AuditLogObserver::class);
    }
}
