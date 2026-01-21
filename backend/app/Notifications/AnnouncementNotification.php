<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class AnnouncementNotification extends Notification
{
    use Queueable;

    protected $announcement;

    public function __construct($announcement)
    {
        $this->announcement = $announcement;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
            'announcement_id' => $this->announcement->id,
            'title' => $this->announcement->title,
            'message' => $this->announcement->message,
        ];
    }
}
