<?php

namespace App\Http\Middleware;

use App\Services\FeatureGateService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckFeatureEntitlement
{
    public function __construct(protected FeatureGateService $featureGate) {}

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(401, 'Unauthorized');
        }

        $isAllowed = match ($feature) {
            'custom_slug' => $this->featureGate->canUseCustomSlug($user),
            'password' => $this->featureGate->canUsePassword($user),
            'expires_at' => $this->featureGate->canUseExpiration($user),
            'qr_customization' => $this->featureGate->canUseQrCustomization($user),
            'api_access' => $this->featureGate->canAccessApi($user),
            'custom_domain' => $this->featureGate->canUseCustomDomain($user),
            default => false,
        };

        if (! $isAllowed) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Your active subscription plan does not support this feature. Please upgrade.'], 403);
            }

            return abort(403, 'Akses Ditolak. Fitur ini membutuhkan langganan paket yang lebih tinggi.');
        }

        return $next($request);
    }
}
