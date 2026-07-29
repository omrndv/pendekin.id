<?php

namespace App\Services;

use App\Enums\InvoiceStatus;
use App\Models\Invoice;
use App\Models\PaymentTransaction;
use App\Models\Subscription;

class InvoiceService
{
    /**
     * Generate unique sequential invoice number.
     * Format: PDK-YYYYMMDD-000001
     */
    public function generateInvoiceNumber(): string
    {
        $prefix = 'PDK-'.now()->format('Ymd').'-';

        $lastInvoice = Invoice::where('invoice_number', 'like', "{$prefix}%")
            ->orderByDesc('id')
            ->first();

        if (! $lastInvoice) {
            return $prefix.'000001';
        }

        $lastSeq = (int) substr($lastInvoice->invoice_number, -6);
        $newSeq = str_pad($lastSeq + 1, 6, '0', STR_PAD_LEFT);

        return $prefix.$newSeq;
    }

    /**
     * Create invoice record for a subscription transaction.
     */
    public function createInvoice(PaymentTransaction $transaction, Subscription $subscription, array $lineItems = []): Invoice
    {
        return Invoice::create([
            'user_id' => $transaction->user_id,
            'subscription_id' => $subscription->id,
            'payment_transaction_id' => $transaction->id,
            'invoice_number' => $transaction->invoice_number,
            'total_amount' => $transaction->gross_amount,
            'discount_amount' => $transaction->discount_amount ?? 0,
            'tax_amount' => $transaction->tax_amount ?? 0,
            'currency' => $transaction->currency,
            'status' => InvoiceStatus::UNPAID,
            'line_items' => $lineItems ?: [
                [
                    'description' => "Langganan Paket {$subscription->plan->name} ({$subscription->cycle->value})",
                    'amount' => $transaction->gross_amount - ($transaction->tax_amount ?? 0) + ($transaction->discount_amount ?? 0),
                ],
            ],
            'due_at' => now()->addDays(3),
        ]);
    }
}
