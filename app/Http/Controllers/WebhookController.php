<?php

namespace App\Http\Controllers;

use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WebhookController extends Controller
{
    public function __construct(
        protected PaymentService $paymentService
    ) {}

    /**
     * Handle incoming payment gateway webhook payload.
     */
    public function handleMidtrans(Request $request): JsonResponse
    {
        $payload = $request->all();

        $processed = $this->paymentService->handleWebhook($payload);

        if (! $processed) {
            return response()->json(['status' => 'error', 'message' => 'Invalid webhook signature or transaction not found'], 400);
        }

        return response()->json(['status' => 'ok', 'message' => 'Webhook handled successfully']);
    }
}
