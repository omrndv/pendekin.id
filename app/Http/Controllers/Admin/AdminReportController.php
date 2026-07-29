<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AbuseReport;
use App\Services\Admin\AdminAbuseReportService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminReportController extends Controller
{
    public function __construct(
        protected AdminAbuseReportService $adminAbuseReportService
    ) {}

    public function index(Request $request): Response
    {
        $status = $request->input('status');

        $query = AbuseReport::with('shortLink')->latest();

        if ($status) {
            $query->where('status', $status);
        }

        $reports = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Reports', [
            'reports' => $reports,
            'filters' => [
                'status' => $status ?? '',
            ],
        ]);
    }

    public function approve(AbuseReport $report, Request $request): RedirectResponse
    {
        $this->adminAbuseReportService->approveAndSuspendLink($report, $request->user());

        return redirect()->back()->with('flash', [
            'success' => 'Laporan disetujui. Tautan terkait telah disuspend.',
        ]);
    }

    public function reject(AbuseReport $report, Request $request): RedirectResponse
    {
        $this->adminAbuseReportService->reject($report, $request->user());

        return redirect()->back()->with('flash', [
            'success' => 'Laporan ditolak. Tautan terkait tetap aktif.',
        ]);
    }
}
