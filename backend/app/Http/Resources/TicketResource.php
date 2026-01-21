<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TicketResource extends JsonResource
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
            'ticket_type_id' => $this->ticket_type_id,
            'qr_code' => $this->qr_code,
            'status' => $this->status,
            'price' => $this->price,
            'purchased_at' => $this->purchased_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'event' => new EventResource($this->whenLoaded('event')),
            'ticket_type' => new TicketTypeResource($this->whenLoaded('ticketType')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
