<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class EventRejectedNotification extends Notification
{
    use Queueable;

    protected $event;

    public function __construct($event)
    {
        $this->event = $event;
    }

    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Event Rejected - ' . $this->event->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Unfortunately, your event has been rejected.')
            ->line('**Event:** ' . $this->event->title)
            ->line('**Status:** Rejected')
            ->line('Please review your event details and submit again with the necessary corrections.')
            ->action('View Events', url('/dashboard/my-events'))
            ->line('If you have questions, please contact support.');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'event',
            'event_id' => $this->event->id,
            'title' => 'Event Rejected',
            'message' => 'Your event "' . $this->event->title . '" has been rejected.',
        ];
    }
}
