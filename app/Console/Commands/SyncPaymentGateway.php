<?php

namespace App\Console\Commands;

use App\Enums\PaymentStatus;
use App\Models\PaymentTransaction;
use App\Services\PaymentService;
use Illuminate\Console\Command;

class SyncPaymentGateway extends Command
{
    protected $signature = 'payment:sync';

    protected $description = 'Sync pending payment transaction statuses with the payment gateway.';

    public function handle(PaymentService $paymentService): int
    {
        $this->info('Syncing pending payment transactions...');

        $pending = PaymentTransaction::where('status', PaymentStatus::PENDING)
            ->where('created_at', '<', now()->subMinutes(30))
            ->get();

        foreach ($pending as $transaction) {
            // Auto expire transactions older than 24 hours
            if ($transaction->created_at->lt(now()->subHours(24))) {
                $transaction->update(['status' => PaymentStatus::EXPIRED]);
                $this->info("Transaction #{$transaction->invoice_number} marked as expired.");
            }
        }

        $this->info('Payment sync completed.');

        return Command::SUCCESS;
    }
}
