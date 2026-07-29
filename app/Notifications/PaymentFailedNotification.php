<?php

namespace App\Notifications;

use App\Models\PaymentTransaction;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentFailedNotification extends Notification implements ShouldQueue
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
        return (new MailMessage)
            ->subject("Pembayaran Gagal - Invoice #{$this->transaction->invoice_number}")
            ->greeting("Halo {$notifiable->name},")
            ->line("Transaksi pembayaran untuk invoice #{$this->transaction->invoice_number} gagal atau kedaluwarsa.")
            ->line('Silakan lakukan pembayaran ulang melalui Billing Portal untuk mempertahankan akses fitur Pro.')
            ->action('Bayar Ulang', url('/dashboard/billing'));
    }
}
