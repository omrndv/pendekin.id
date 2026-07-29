<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\ShortLinkResource;
use App\Models\ShortLink;
use App\Services\LinkService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserDashboardController extends Controller
{
    public function __construct(
        protected LinkService $linkService
    ) {}

    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        $recentLinks = $this->linkService->getUserLinks(
            userId: $userId,
            perPage: 5
        );

        $totalLinks = ShortLink::where('user_id', $userId)->count();
        $activeLinks = ShortLink::where('user_id', $userId)->where('is_active', true)->count();
        $totalClicks = ShortLink::where('user_id', $userId)->sum('clicks_count');

        return Inertia::render('Dashboard/Index', [
            'recentLinks' => ShortLinkResource::collection($recentLinks),
            'stats' => [
                'total_links' => $totalLinks,
                'active_links' => $activeLinks,
                'total_clicks' => $totalClicks,
                'avg_clicks' => $totalLinks > 0 ? round($totalClicks / $totalLinks, 1) : 0,
            ],
        ]);
    }
}
