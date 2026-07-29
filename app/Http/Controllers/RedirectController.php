<?php

namespace App\Http\Controllers;

use App\DTOs\ClickDataDTO;
use App\Enums\DeviceType;
use App\Events\LinkClicked;
use App\Exceptions\LinkNotFoundException;
use App\Services\LinkService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RedirectController extends Controller
{
    public function __construct(
        protected LinkService $linkService
    ) {}

    /**
     * Ultra-fast redirect resolution with Redis caching & async analytics dispatch.
     */
    public function redirect(Request $request, string $slug)
    {
        try {
            // 1. Fast lookup via Redis cache / DB fallback
            $link = $this->linkService->resolveActiveLink($slug);
        } catch (LinkNotFoundException $e) {
            abort(404, 'Short link tidak ditemukan atau sudah kedaluwarsa.');
        }

        // 2. Check Password Protection if enabled
        if ($link->password_hash) {
            $unlockedKey = "unlocked_link_{$link->id}";
            if (! session()->has($unlockedKey)) {
                return Inertia::render('Auth/LinkPasswordPrompt', [
                    'slug' => $slug,
                    'linkTitle' => $link->title,
                ]);
            }
        }

        // 3. Parse Device & Visitor Analytics (Async)
        $userAgent = $request->userAgent() ?? '';
        $deviceType = $this->detectDeviceType($userAgent);

        $clickData = new ClickDataDTO(
            shortLinkId: $link->id,
            ipAddress: $request->ip(),
            countryCode: $request->header('CF-IPCountry') ?? 'ID',
            countryName: $request->header('CF-IPCountry') ? 'Cloudflare Geo' : 'Indonesia',
            city: $request->header('CF-IPCity') ?? 'Jakarta',
            deviceType: $deviceType->value,
            browser: $this->detectBrowser($userAgent),
            os: $this->detectOS($userAgent),
            referrer: $request->header('referer'),
            clickedAt: now()->toIso8601String()
        );

        // 4. Dispatch Async Analytics Event (Queue Worker handles DB write)
        event(new LinkClicked($clickData));

        // 5. High-speed HTTP 302 Redirect
        return redirect()->away($link->original_url, 302, [
            'Cache-Control' => 'no-cache, no-store, must-revalidate',
            'X-Redirected-By' => 'Pendekin-Engine',
        ]);
    }

    /**
     * Unlock password protected link.
     */
    public function unlockPassword(Request $request, string $slug): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'string'],
        ]);

        try {
            $link = $this->linkService->resolveActiveLink($slug);
        } catch (LinkNotFoundException $e) {
            abort(404);
        }

        if (! \Hash::check($request->password, $link->password_hash)) {
            return redirect()->back()->withErrors([
                'password' => 'Kata sandi link salah. Silakan coba lagi.',
            ]);
        }

        session()->put("unlocked_link_{$link->id}", true);

        return redirect()->to("/{$slug}");
    }

    protected function detectDeviceType(string $ua): DeviceType
    {
        if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $ua)) {
            return DeviceType::TABLET;
        }

        if (preg_match('/(Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini))/i', $ua)) {
            return DeviceType::MOBILE;
        }

        return DeviceType::DESKTOP;
    }

    protected function detectBrowser(string $ua): string
    {
        if (str_contains($ua, 'Chrome')) {
            return 'Chrome';
        }
        if (str_contains($ua, 'Safari')) {
            return 'Safari';
        }
        if (str_contains($ua, 'Firefox')) {
            return 'Firefox';
        }
        if (str_contains($ua, 'Edge')) {
            return 'Edge';
        }

        return 'Other';
    }

    protected function detectOS(string $ua): string
    {
        if (str_contains($ua, 'Android')) {
            return 'Android';
        }
        if (str_contains($ua, 'iPhone') || str_contains($ua, 'iPad')) {
            return 'iOS';
        }
        if (str_contains($ua, 'Windows')) {
            return 'Windows';
        }
        if (str_contains($ua, 'Macintosh')) {
            return 'macOS';
        }
        if (str_contains($ua, 'Linux')) {
            return 'Linux';
        }

        return 'Other';
    }
}
