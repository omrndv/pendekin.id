<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\AnalyticsService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function __construct(
        protected AnalyticsService $analyticsService
    ) {}

    public function index(Request $request): Response
    {
        $userId = $request->user()->id;

        return Inertia::render('Dashboard/Analytics', [
            'summary' => $this->analyticsService->getSummaryForUser($userId),
            'clickTrends' => $this->analyticsService->getClickTrends($userId, 7),
            'countries' => $this->analyticsService->getCountryBreakdown($userId),
            'devices' => $this->analyticsService->getDeviceBreakdown($userId),
        ]);
    }
}
