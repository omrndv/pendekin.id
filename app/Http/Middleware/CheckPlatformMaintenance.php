<?php

namespace App\Http\Middleware;

use App\Models\SystemSetting;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckPlatformMaintenance
{
    public function handle(Request $request, Closure $next): Response
    {
        $isMaintenance = SystemSetting::get('maintenance_mode', false);

        if ($isMaintenance) {
            $user = $request->user();

            // 1. Allow Admins
            if ($user && $user->hasRole('admin')) {
                return $next($request);
            }

            // 2. Allow Device with Maintenance Bypass Cookie or Session
            if ($request->cookie('bypass_maintenance') === 'true' || $request->session()->get('bypass_maintenance') === true) {
                return $next($request);
            }

            $secretCode = strtolower(SystemSetting::get('maintenance_secret_code', 'admin-ganteng'));
            $currentPath = strtolower(trim($request->path(), '/'));

            // 3. Check for Secret Bypass route interception
            if ($currentPath === $secretCode && $secretCode !== '') {
                // Set the bypass session/cookie and redirect to login or dashboard
                return redirect()->route('login')->withCookie(cookie('bypass_maintenance', 'true', 120))
                    ->with('flash', ['success' => 'Maintenance Mode bypassed. You can now login or access the dashboard.']);
            }

            // 4. Exclude everything except dashboard routes
            if (! $request->is('dashboard*') && ! $request->is('profile*')) {
                return $next($request);
            }

            // 4. Block Dashboard & App routes with clean minimal Maintenance page
            if ($request->header('X-Inertia')) {
                return Inertia::render('Errors/Maintenance')->toResponse($request);
            }

            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Sistem sedang dalam pemeliharaan berkala (Maintenance Mode).',
                ], 503);
            }

            return Inertia::render('Errors/Maintenance')->toResponse($request);
        }

        return $next($request);
    }
}
