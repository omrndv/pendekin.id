<?php

namespace App\Services\Admin;

use App\Models\AbuseReport;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class AdminAbuseReportService
{
    public function __construct(
        protected AdminLinkService $adminLinkService
    ) {}

    public function approveAndSuspendLink(AbuseReport $report, User $admin): bool
    {
        return DB::transaction(function () use ($report, $admin) {
            $oldValue = ['status' => $report->status];

            // Suspend Link
            $link = $report->shortLink;
            $this->adminLinkService->suspend($link, $admin, "Suspended due to approved abuse report: {$report->reason}");

            // Update Report Status
            $report->status = 'approved';
            $report->save();

            // All other pending reports for this link should also be closed
            AbuseReport::where('short_link_id', $link->id)
                ->where('status', 'pending')
                ->where('id', '!=', $report->id)
                ->update(['status' => 'approved']);

            $this->logAction($admin, $report, 'approve_abuse_report', $oldValue, ['status' => 'approved']);

            return true;
        });
    }

    public function reject(AbuseReport $report, User $admin): bool
    {
        return DB::transaction(function () use ($report, $admin) {
            $oldValue = ['status' => $report->status];
            $report->status = 'rejected';
            $report->save();

            $this->logAction($admin, $report, 'reject_abuse_report', $oldValue, ['status' => 'rejected']);

            return true;
        });
    }

    protected function logAction(User $actor, AbuseReport $target, string $action, ?array $oldValue = null, ?array $newValue = null): void
    {
        AuditLog::create([
            'user_id' => $actor->id,
            'action' => $action,
            'auditable_type' => AbuseReport::class,
            'auditable_id' => $target->id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'old_value' => $oldValue,
            'new_value' => $newValue,
        ]);
    }
}
