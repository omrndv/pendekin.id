<?php

namespace App\Traits;

use App\Models\User;
use App\Services\LinkService;
use App\DTOs\CreateLinkDTO;
use Illuminate\Support\Facades\Log;

trait HandlesPendingUrl
{
    /**
     * Store the pending URL from query parameter into session.
     */
    protected function storePendingUrl(\Illuminate\Http\Request $request): void
    {
        if ($request->has('pending_url')) {
            session(['pending_url' => $request->query('pending_url')]);
        }
    }

    /**
     * Process the pending URL from session for the authenticated user.
     */
    protected function handlePendingUrl(User $user): void
    {
        if (session()->has('pending_url')) {
            $pendingUrl = session()->pull('pending_url');

            try {
                /** @var \App\Services\FeatureGateService $featureGate */
                $featureGate = app(\App\Services\FeatureGateService::class);

                if ($featureGate->hasReachedLinkQuota($user)) {
                    session()->flash('flash', [
                        'error' => 'Gagal membuat link otomatis: Kuota bulanan link Anda sudah habis. Silakan upgrade paket Anda.',
                    ]);
                    return;
                }

                /** @var LinkService $linkService */
                $linkService = app(LinkService::class);
                
                $dto = new CreateLinkDTO(
                    userId: $user->id,
                    originalUrl: $pendingUrl,
                    title: null,
                    customSlug: null,
                    password: null,
                    expiresAt: null,
                    maxClicks: null,
                    teamId: null,
                    domain: null
                );

                $linkService->createLink($dto);

                session()->flash('flash', [
                    'success' => 'Link berhasil dibuat otomatis setelah login!',
                ]);
            } catch (\Exception $e) {
                Log::error('Gagal membuat link tertunda setelah login: ' . $e->getMessage());
            }
        }
    }
}
