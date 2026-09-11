<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public function __construct(
        protected string $token
    ) {
    }

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = config('app.frontend_url')
            . '/reset-password?token='
            . $this->token
            . '&email='
            . urlencode($notifiable->getEmailForPasswordReset());

        return (new MailMessage)
            ->subject('Reset Your Portfolio Admin Password')
            ->greeting('Hello!')
            ->line('You requested to reset your administrator password.')
            ->action('Reset Password', $url)
            ->line('If you did not request this password reset, you can safely ignore this email.')
            ->line('This password reset link will expire after a limited time.');
    }
}
