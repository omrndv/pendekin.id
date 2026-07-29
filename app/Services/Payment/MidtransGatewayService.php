<?php

namespace App\Services\Payment;

use App\Contracts\PaymentGatewayInterface;
use App\Models\PaymentGatewayLog;
use App\Models\PaymentTransaction;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MidtransGatewayService implements PaymentGatewayInterface
{
    protected string $serverKey;

    protected string $clientKey;

    protected bool $isProduction;

    public function __construct()
    {
        $this->serverKey = config('services.midtrans.server_key', env('MIDTRANS_SERVER_KEY', 'SB-Mid-server-demo'));
        $this->clientKey = config('services.midtrans.client_key', env('MIDTRANS_CLIENT_KEY', 'SB-Mid-client-demo'));
        $this->isProduction = (bool) config('services.midtrans.is_production', env('MIDTRANS_IS_PRODUCTION', false));
    }

    public function createCheckoutSession(PaymentTransaction $transaction, array $customerData): array
    {
        $baseUrl = $this->isProduction
            ? 'https://app.midtrans.com/snap/v1/transactions'
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

        $payload = [
            'transaction_details' => [
                'order_id' => $transaction->invoice_number,
                'gross_amount' => (int) $transaction->gross_amount,
            ],
            'customer_details' => [
                'first_name' => $customerData['name'] ?? 'User',
                'email' => $customerData['email'] ?? 'user@example.com',
            ],
            'credit_card' => [
                'secure' => true,
            ],
        ];

        try {
            $response = Http::withBasicAuth($this->serverKey, '')
                ->acceptJson()
                ->post($baseUrl, $payload);

            $responseData = $response->json();

            // Audit Log Request & Response
            PaymentGatewayLog::create([
                'invoice_number' => $transaction->invoice_number,
                'gateway_provider' => 'midtrans',
                'event_type' => 'checkout_created',
                'payload_raw' => $payload,
                'response_raw' => $responseData,
                'ip_address' => request()->ip(),
            ]);

            if ($response->successful()) {
                return [
                    'snap_token' => $responseData['token'] ?? 'demo_token_'.$transaction->invoice_number,
                    'redirect_url' => $responseData['redirect_url'] ?? "https://app.sandbox.midtrans.com/snap/v2/vtweb/{$transaction->invoice_number}",
                ];
            }
        } catch (\Throwable $e) {
            Log::error('Midtrans Checkout Exception: '.$e->getMessage());
            throw new \Exception('Payment gateway connection failed: '.$e->getMessage());
        }

        throw new \Exception('Failed to retrieve Snap Token from Midtrans. Check your Server Key.');
    }

    public function verifyWebhookSignature(array $payload): bool
    {
        $orderId = $payload['order_id'] ?? '';
        $statusCode = $payload['status_code'] ?? '';
        $grossAmount = $payload['gross_amount'] ?? '';
        $signatureKey = $payload['signature_key'] ?? '';

        if (! $orderId || ! $statusCode || ! $grossAmount || ! $signatureKey) {
            return false;
        }

        // SHA512(order_id + status_code + gross_amount + ServerKey)
        $expectedSignature = hash('sha512', $orderId.$statusCode.$grossAmount.$this->serverKey);

        $isValid = hash_equals($expectedSignature, $signatureKey);

        PaymentGatewayLog::create([
            'invoice_number' => $orderId,
            'gateway_provider' => 'midtrans',
            'event_type' => 'webhook_received',
            'payload_raw' => $payload,
            'response_raw' => ['signature_valid' => $isValid],
            'ip_address' => request()->ip(),
        ]);

        return $isValid;
    }

    public function parseWebhookPayload(array $payload): array
    {
        return [
            'order_id' => $payload['order_id'] ?? '',
            'transaction_status' => $payload['transaction_status'] ?? 'pending',
            'gross_amount' => (float) ($payload['gross_amount'] ?? 0),
            'payment_type' => $payload['payment_type'] ?? 'bank_transfer',
            'reference_id' => $payload['transaction_id'] ?? '',
        ];
    }
}
