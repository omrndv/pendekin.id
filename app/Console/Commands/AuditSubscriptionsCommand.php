<?php

namespace App\Console\Commands;

use App\Enums\PaymentStatus;
use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use Illuminate\Console\Command;

class AuditSubscriptionsCommand extends Command
{
    protected $signature = 'subscriptions:audit {--fix : Automatically fix corrupt subscription states}';

    protected $description = 'Audit database subscriptions for integrity and corrupt data detection.';

    public function handle(): int
    {
        $this->info('Starting Subscription Integrity Audit...');

        // 1. Find active subscriptions without any successful payment transaction
        $activeSubs = Subscription::where('status', SubscriptionStatus::ACTIVE)->get();
        $corruptCount = 0;

        $reportData = [];

        foreach ($activeSubs as $sub) {
            $hasSuccessPayment = $sub->transactions()
                ->where('status', PaymentStatus::SUCCESS)
                ->exists();

            if (! $hasSuccessPayment && ! $sub->user?->isAdmin()) {
                $corruptCount++;
                $reportData[] = [
                    'ID' => $sub->id,
                    'User ID' => $sub->user_id,
                    'User Email' => $sub->user?->email ?? 'N/A',
                    'Status' => $sub->status->value,
                    'Issue' => 'Active without successful payment',
                ];

                if ($this->option('fix')) {
                    $sub->update(['status' => SubscriptionStatus::EXPIRED]);
                }
            }
        }

        if (count($reportData) > 0) {
            $this->warn("Found {$corruptCount} corrupt active subscription(s):");
            $this->table(['Subscription ID', 'User ID', 'User Email', 'Status', 'Issue'], $reportData);

            if ($this->option('fix')) {
                $this->info("Automatically fixed {$corruptCount} corrupt record(s) to EXPIRED.");
            } else {
                $this->comment("Run 'php artisan subscriptions:audit --fix' to purge these records.");
            }
        } else {
            $this->info('All active subscriptions passed integrity check. No corrupt data found!');
        }

        return Command::SUCCESS;
    }
}
