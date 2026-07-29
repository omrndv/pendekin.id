<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShortLinkResource;
use App\Models\ShortLink;
use App\Services\LinkService;
use App\Services\QrCodeService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QrCodeController extends Controller
{
    public function __construct(
        protected LinkService $linkService,
        protected QrCodeService $qrCodeService
    ) {}

    public function index(Request $request): Response
    {
        $userId = $request->user()->id;
        $links = $this->linkService->getUserLinks($userId, 50);
        $featureGate = app(\App\Services\FeatureGateService::class);
        $canCustomizeQr = $featureGate->canUseQrCustomization($request->user());

        return Inertia::render('Dashboard/QrCodes', [
            'userLinks' => ShortLinkResource::collection($links),
            'can_customize_qr' => $canCustomizeQr,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'short_link_id' => ['required', 'exists:short_links,id'],
            'fg_color' => ['required', 'string', 'max:10'],
            'bg_color' => ['required', 'string', 'max:10'],
        ]);

        $featureGate = app(\App\Services\FeatureGateService::class);
        $allowedFreeColors = ['#10b981', '#000000', '#111827'];
        $requestedFg = strtolower($request->fg_color);

        if (! $featureGate->canUseQrCustomization($request->user()) && ! in_array($requestedFg, $allowedFreeColors)) {
            return redirect()->back()->with('flash', [
                'error' => 'Kustomisasi QR Code membutuhkan langganan paket Pro atau Business.',
            ]);
        }

        $link = ShortLink::findOrFail($request->short_link_id);
        $this->authorize('update', $link);

        $this->qrCodeService->generateOrUpdate($link, $request->fg_color, $request->bg_color);

        return redirect()->back()->with('flash', [
            'success' => 'Konfigurasi QR Code berhasil diperbarui!',
        ]);
    }
}
