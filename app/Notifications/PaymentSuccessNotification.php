<?php

namespace App\Notifications;

use App\Models\PaymentTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentSuccessNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public PaymentTransaction $transaction
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $amount = number_format($this->transaction->gross_amount, 0, ',', '.');

        return (new MailMessage)
            ->subject("Pembayaran Berhasil! Invoice #{$this->transaction->invoice_number}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Pembayaran kamu sebesar Rp {$amount} untuk invoice #{$this->transaction->invoice_number} telah berhasil dikonfirmasi.")
            ->line('Paket langganan kamu telah aktif kembali.')
            ->action('Lihat Invoice', url('/dashboard/billing'));
    }
}
