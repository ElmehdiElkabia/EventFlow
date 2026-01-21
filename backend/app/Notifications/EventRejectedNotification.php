<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

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
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'event_id' => $this->event->id,
            'title' => $this->event->title,
            'message' => 'Your event has been rejected.',
        ];
    }
}
