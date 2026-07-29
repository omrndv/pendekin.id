<?php

namespace App\Http\Middleware;

use App\Models\ApiKey;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiKey
{
    /**
     * Handle an incoming request for REST API v1.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->bearerToken();

        if (! $token) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Missing Authorization Bearer token header.',
            ], 401);
        }

        $hash = hash('sha256', $token);
        $apiKey = ApiKey::where('key_hash', $hash)->where('is_active', true)->first();

        if (! $apiKey || ! $apiKey->user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Invalid, inactive, or revoked API key.',
            ], 401);
        }

        // Update last used timestamp
        $apiKey->update(['last_used_at' => now()]);

        // Authenticate user context for this request
        auth()->setUser($apiKey->user);
        $request->setUserResolver(fn () => $apiKey->user);

        return $next($request);
    }
}
