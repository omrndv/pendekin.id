<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user,
                'unread_notifications_count' => $user ? $user->unreadNotifications()->count() : 0,
                'pending_reports_count' => ($user && $user->hasRole('admin')) ? \App\Models\AbuseReport::where('status', 'pending')->count() : 0,
                'open_tickets_count' => ($user && $user->hasRole('admin')) ? \App\Models\Ticket::where('status', 'open')->count() : 0,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('flash.success'),
                'error' => fn () => $request->session()->get('flash.error'),
                'redirect_url' => fn () => $request->session()->get('flash.redirect_url'),
            ],
        ];
    }
}
