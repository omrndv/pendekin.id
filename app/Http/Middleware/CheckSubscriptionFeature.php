<?php

namespace App\Http\Middleware;

use App\Services\FeatureGateService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscriptionFeature
{
    public function __construct(
        protected FeatureGateService $featureGateService
    ) {}

    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $user = $request->user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Admin bypass
        if ($user->isAdmin()) {
            return $next($request);
        }

        $entitled = match ($feature) {
            'api_access' => $this->featureGateService->canAccessApi($user),
            'custom_domain' => $this->featureGateService->canUseCustomSlug($user),
            'link_quota' => ! $this->featureGateService->hasReachedLinkQuota($user),
            default => true,
        };

        if (! $entitled) {
            if ($request->expectsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => "Fitur '{$feature}' membutuhkan paket langganan Pro atau Enterprise.",
                ], 403);
            }

            return redirect()->route('dashboard.billing')->with('flash', [
                'error' => "Akses Dibatasi: Upgrade paket langganan kamu untuk membuka fitur '{$feature}'.",
            ]);
        }

        return $next($request);
    }
}
