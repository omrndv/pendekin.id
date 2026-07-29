<?php

namespace App\Services\Payment;

use App\Contracts\PaymentGatewayInterface;
use InvalidArgumentException;

class PaymentGatewayManager
{
    protected array $gateways = [];

    public function __construct()
    {
        $this->gateways['midtrans'] = new MidtransGatewayService;
    }

    public function driver(?string $name = null): PaymentGatewayInterface
    {
        $driver = $name ?: config('pendekin.payment_gateway', 'midtrans');

        if (! isset($this->gateways[$driver])) {
            throw new InvalidArgumentException("Payment gateway driver '{$driver}' tidak didukung.");
        }

        return $this->gateways[$driver];
    }
}
