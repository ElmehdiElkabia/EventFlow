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
            'type' => 'event',
            'event_id' => $this->event->id,
            'title' => 'Event Rejected',
            'message' => 'Your event "' . $this->event->title . '" has been rejected.',
        ];
    }
}
