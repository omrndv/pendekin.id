<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Selamat Datang di Pendekin SaaS!')
            ->greeting("Halo {$notifiable->name},")
            ->line('Terima kasih telah mendaftar di Pendekin SaaS platform URL shortener profesional.')
            ->line('Kamu dapat langsung mulai memperpendek link, kustomisasi QR Code, dan memantau analitik secara realtime.')
            ->action('Buka Dashboard', url('/dashboard'))
            ->line('Salam hangat, Team Pendekin SaaS.');
    }
}
