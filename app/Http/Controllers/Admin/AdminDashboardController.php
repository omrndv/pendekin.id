<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AbuseReport;
use App\Models\ClickAnalytics;
use App\Models\PaymentTransaction;
use App\Models\ShortLink;
use App\Models\Ticket;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(Request $request): Response
    {
        $totalUsers = User::count();
        $totalLinks = ShortLink::withTrashed()->count();
        $totalClicks = ShortLink::sum('clicks_count');
        $pendingReports = AbuseReport::where('status', 'pending')->count();
        $openTickets = Ticket::where('status', 'open')->count();

        // Revenue (30 days)
        $totalRevenue = PaymentTransaction::where('status', \App\Enums\PaymentStatus::SUCCESS)
            ->where('created_at', '>=', now()->subDays(30))
            ->sum('gross_amount');

        $recentUsers = User::latest()->limit(5)->get();
        $recentLinks = ShortLink::withTrashed()->with('user')->latest()->limit(5)->get();

        // CHART DATA: 30 Days Trend
        $thirtyDaysAgo = Carbon::now()->subDays(29)->startOfDay();

        // 1. Registrations Chart
        $registrationsChart = User::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // 2. Revenue Chart
        $revenueChart = PaymentTransaction::select(DB::raw('DATE(created_at) as date'), DB::raw('sum(gross_amount) as total'))
            ->where('status', \App\Enums\PaymentStatus::SUCCESS)
            ->where('created_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // 3. Clicks Chart
        $clicksChart = ClickAnalytics::select(DB::raw('DATE(clicked_at) as date'), DB::raw('count(*) as count'))
            ->where('clicked_at', '>=', $thirtyDaysAgo)
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Format dates into a continuous 30-day series to avoid missing days
        $dates = [];
        $regData = [];
        $revData = [];
        $clkData = [];

        $regMap = $registrationsChart->pluck('count', 'date')->toArray();
        $revMap = $revenueChart->pluck('total', 'date')->toArray();
        $clkMap = $clicksChart->pluck('count', 'date')->toArray();

        for ($i = 29; $i >= 0; $i--) {
            $dateStr = Carbon::now()->subDays($i)->format('Y-m-d');
            $dates[] = Carbon::now()->subDays($i)->format('d M');
            $regData[] = $regMap[$dateStr] ?? 0;
            $revData[] = $revMap[$dateStr] ?? 0;
            $clkData[] = $clkMap[$dateStr] ?? 0;
        }

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users' => $totalUsers,
                'total_links' => $totalLinks,
                'total_clicks' => $totalClicks,
                'pending_reports' => $pendingReports,
                'open_tickets' => $openTickets,
                'monthly_revenue' => $totalRevenue,
            ],
            'recentUsers' => $recentUsers,
            'recentLinks' => $recentLinks,
            'charts' => [
                'labels' => $dates,
                'registrations' => $regData,
                'revenue' => $revData,
                'clicks' => $clkData,
            ],
        ]);
    }
}
