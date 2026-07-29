<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShortLinkResource;
use App\Models\ShortLink;
use App\Services\Admin\AdminLinkService;
use App\Services\LinkService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminLinkController extends Controller
{
    public function __construct(
        protected LinkService $linkService,
        protected AdminLinkService $adminLinkService
    ) {}

    public function index(Request $request): Response
    {
        $search = $request->input('search');
        $flagged = $request->input('flagged');

        // Modify linkService->getGlobalLinks to support trashed if needed, or we just write our own query here for admin
        $query = ShortLink::with(['user'])->withCount('analytics as clicks_count');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('short_slug', 'like', "%{$search}%")
                    ->orWhere('original_url', 'like', "%{$search}%");
            });
        }

        if ($flagged === 'flagged') {
            $query->where('is_flagged', true);
        } elseif ($flagged === 'deleted') {
            $query->withTrashed()->whereNotNull('deleted_at');
        } elseif ($flagged === 'active') {
            $query->where('is_active', true);
        } elseif ($flagged === 'suspended') {
            $query->where('is_active', false);
        }

        $links = $query->latest()->paginate(15)->withQueryString();

        return Inertia::render('Admin/Links', [
            'links' => ShortLinkResource::collection($links),
            'filters' => [
                'search' => $search ?? '',
                'flagged' => $flagged ?? '',
            ],
        ]);
    }

    public function show($id): Response
    {
        $link = ShortLink::withTrashed()->with(['user', 'abuseReports' => function ($q) {
            $q->latest();
        }])->findOrFail($id);

        $analytics = $link->analytics()
            ->selectRaw('DATE(clicked_at) as date, count(*) as clicks')
            ->groupBy('date')
            ->latest('date')
            ->take(30)
            ->get();

        $devices = $link->analytics()
            ->selectRaw('device_type, count(*) as count')
            ->groupBy('device_type')
            ->get();

        $browsers = $link->analytics()
            ->selectRaw('browser, count(*) as count')
            ->groupBy('browser')
            ->get();

        $countries = $link->analytics()
            ->selectRaw('country_name as country, count(*) as count')
            ->groupBy('country_name')
            ->get();

        $referrers = $link->analytics()
            ->selectRaw('referrer as referrer_host, count(*) as count')
            ->groupBy('referrer')
            ->get();

        return Inertia::render('Admin/LinkDetail', [
            'targetLink' => (new ShortLinkResource($link))->resolve(),
            'analytics' => $analytics,
            'devices' => $devices,
            'browsers' => $browsers,
            'countries' => $countries,
            'referrers' => $referrers,
            'abuseReports' => $link->abuseReports,
        ]);
    }

    public function suspend($id, Request $request): RedirectResponse
    {
        $link = ShortLink::withTrashed()->findOrFail($id);
        $this->adminLinkService->suspend($link, $request->user());

        // Invalidate Cache
        $cachePrefix = config('pendekin.cache.prefix', 'pendekin:slug:');
        \Cache::forget($cachePrefix.$link->short_slug);

        return redirect()->back()->with('flash', [
            'success' => "Link '{$link->short_slug}' berhasil disuspend.",
        ]);
    }

    public function activate($id, Request $request): RedirectResponse
    {
        $link = ShortLink::withTrashed()->findOrFail($id);
        $this->adminLinkService->activate($link, $request->user());

        // Invalidate Cache
        $cachePrefix = config('pendekin.cache.prefix', 'pendekin:slug:');
        \Cache::forget($cachePrefix.$link->short_slug);

        return redirect()->back()->with('flash', [
            'success' => "Link '{$link->short_slug}' berhasil diaktifkan.",
        ]);
    }

    public function destroy($id, Request $request): RedirectResponse
    {
        $link = ShortLink::withTrashed()->findOrFail($id);
        $this->adminLinkService->delete($link, $request->user());

        // Invalidate Cache
        $cachePrefix = config('pendekin.cache.prefix', 'pendekin:slug:');
        \Cache::forget($cachePrefix.$link->short_slug);

        return redirect()->back()->with('flash', [
            'success' => "Link '{$link->short_slug}' berhasil dihapus (soft delete).",
        ]);
    }

    public function forceDelete($id, Request $request): RedirectResponse
    {
        $link = ShortLink::withTrashed()->findOrFail($id);
        $this->adminLinkService->forceDelete($link, $request->user());

        // Invalidate Cache
        $cachePrefix = config('pendekin.cache.prefix', 'pendekin:slug:');
        \Cache::forget($cachePrefix.$link->short_slug);

        return redirect()->back()->with('flash', [
            'success' => "Link '{$link->short_slug}' berhasil dihapus secara permanen.",
        ]);
    }

    public function restore($id, Request $request): RedirectResponse
    {
        $link = ShortLink::withTrashed()->findOrFail($id);
        $this->adminLinkService->restore($link, $request->user());

        return redirect()->back()->with('flash', [
            'success' => "Link '{$link->short_slug}' berhasil dipulihkan.",
        ]);
    }

    public function toggleFlag($id, Request $request): RedirectResponse
    {
        $link = ShortLink::withTrashed()->findOrFail($id);
        $this->adminLinkService->toggleFlag($link, $request->user());

        // Invalidate Cache
        $cachePrefix = config('pendekin.cache.prefix', 'pendekin:slug:');
        \Cache::forget($cachePrefix.$link->short_slug);

        return redirect()->back()->with('flash', [
            'success' => "Status moderasi link '{$link->short_slug}' berhasil diperbarui.",
        ]);
    }
}
