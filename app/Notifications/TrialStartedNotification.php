<?php

namespace App\Notifications;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TrialStartedNotification extends Notification implements ShouldQueue
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
        $endsAt = $this->subscription->trial_ends_at?->format('d M Y') ?? '14 hari kedepan';

        return (new MailMessage)
            ->subject('Masa Trial 14 Hari Paket Pro Aktif!')
            ->greeting("Halo {$notifiable->name},")
            ->line("Masa trial 14 hari Paket Pro kamu telah aktif sampai tanggal {$endsAt}.")
            ->line('Nikmati akses kuota 10.000 link/bulan, custom domain, dan akses full REST API.')
            ->action('Kelola Langganan', url('/dashboard/billing'));
    }
}
