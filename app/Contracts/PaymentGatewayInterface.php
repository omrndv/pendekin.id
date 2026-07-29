<?php

namespace App\Contracts;

use App\Models\PaymentTransaction;

interface PaymentGatewayInterface
{
    /**
     * Create checkout token/url for transaction.
     */
    public function createCheckoutSession(PaymentTransaction $transaction, array $customerData): array;

    /**
     * Verify incoming webhook signature.
     */
    public function verifyWebhookSignature(array $payload): bool;

    /**
     * Standardize webhook payload into array keys: transaction_status, order_id, gross_amount, payment_type, reference_id.
     */
    public function parseWebhookPayload(array $payload): array;
}
