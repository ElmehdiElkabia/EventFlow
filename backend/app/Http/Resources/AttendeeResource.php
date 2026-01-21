<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendeeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'event_id' => $this->event_id,
            'ticket_id' => $this->ticket_id,
            'status' => $this->status,
            'checked_in_at' => $this->checked_in_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'event' => new EventResource($this->whenLoaded('event')),
            'ticket' => new TicketResource($this->whenLoaded('ticket')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
