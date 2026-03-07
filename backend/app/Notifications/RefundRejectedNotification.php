<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RefundRejectedNotification extends Notification
{
    use Queueable;

    protected $refund;

    /**
     * Create a new notification instance.
     */
    public function __construct($refund)
    {
        $this->refund = $refund;
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
            ->subject('Refund Request Update - EventFlow')
            ->greeting('Hello ' . $notifiable->name . ',')
            ->line('We have reviewed your refund request.')
            ->line('**Refund Details:**')
            ->line('Refund ID: ' . $this->refund->refund_id)
            ->line('Amount: $' . number_format($this->refund->amount, 2))
            ->line('Event: ' . $this->refund->event->title);
        
        if ($this->refund->admin_notes) {
            $mail->line('**Reason:** ' . $this->refund->admin_notes);
        }
        
        $mail->line('If you have any questions, please contact our support team.')
            ->action('Contact Support', $frontendUrl . '/contact');
        
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
            'refund_id' => $this->refund->refund_id,
            'amount' => $this->refund->amount,
        ];
    }
}