<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class EventApprovedNotification extends Notification
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
            ->subject('Event Approved - ' . $this->event->title)
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('Great news! Your event has been approved.')
            ->line('**Event:** ' . $this->event->title)
            ->line('**Status:** Approved')
            ->line('This event will be published and visible to all users.')
            ->action('View Event', url('/events/' . $this->event->id))
            ->line('Thank you for using our platform!');
    }

    public function toArray($notifiable)
    {
        return [
            'type' => 'event',
            'event_id' => $this->event->id,
            'title' => 'Event Approved',
            'message' => 'Your event "' . $this->event->title . '" has been approved!',
        ];
    }
}
