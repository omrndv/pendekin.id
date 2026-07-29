<?php

namespace App\Policies;

use App\Models\Invoice;
use App\Models\PaymentTransaction;
use App\Models\Subscription;
use App\Models\User;

class BillingPolicy
{
    public function viewTransaction(User $user, PaymentTransaction $transaction): bool
    {
        return $user->isAdmin() || $user->id === $transaction->user_id;
    }

    public function viewInvoice(User $user, Invoice $invoice): bool
    {
        return $user->isAdmin() || $user->id === $invoice->user_id;
    }

    public function manageSubscription(User $user, Subscription $subscription): bool
    {
        return $user->isAdmin() || $user->id === $subscription->user_id;
    }
}
