<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserSuspendedNotification extends Notification
{
    use Queueable;

    protected $reason;

    /**
     * Create a new notification instance.
     */
    public function __construct($reason = null)
    {
        $this->reason = $reason;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $frontendUrl = config('app.frontend_url', 'http://localhost:5173');
        
        $mail = (new MailMessage)
            ->subject('Account Suspended - EventFlow')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('Your EventFlow account has been suspended by our administrators.');
        
        if ($this->reason) {
            $mail->line('**Reason:** ' . $this->reason);
        }
        
        $mail->line('If you believe this is a mistake, please contact our support team.')
            ->action('Contact Support', $frontendUrl . '/contact')
            ->line('Thank you for your understanding.');
        
        return $mail;
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'reason' => $this->reason,
        ];
    }
}