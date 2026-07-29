<?php

namespace App\Console\Commands;

use App\Enums\SubscriptionStatus;
use App\Models\Subscription;
use Illuminate\Console\Command;

class CleanExpiredSubscriptions extends Command
{
    protected $signature = 'subscriptions:cleanup';

    protected $description = 'Clean up expired temporary subscription data and obsolete records.';

    public function handle(): int
    {
        $this->info('Cleaning up obsolete subscription data...');

        // Purge pending subscriptions that have been inactive for over 7 days
        $count = Subscription::where('status', SubscriptionStatus::PENDING)
            ->where('created_at', '<', now()->subDays(7))
            ->delete();

        $this->info("Cleaned up {$count} obsolete pending subscriptions.");

        return Command::SUCCESS;
    }
}
