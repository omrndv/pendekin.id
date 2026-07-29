<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SubscriptionCancelledNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public Subscription $subscription
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $cancelsAt = $this->subscription->cancels_at?->format('d M Y') ?? 'akhir periode';

        return (new MailMessage)
            ->subject('Konfirmasi Pembatalan Perpanjangan Otomatis')
            ->greeting("Halo {$notifiable->name},")
            ->line('Perpanjangan otomatis untuk paket langganan kamu telah dihentikan.')
            ->line("Kamu masih dapat menikmati seluruh fitur paket hingga tanggal {$cancelsAt}.")
            ->line('Setelah tanggal tersebut, akun kamu akan secara otomatis kembali ke Paket Free.')
            ->action('Buka Billing Portal', url('/dashboard/billing'));
    }
}
