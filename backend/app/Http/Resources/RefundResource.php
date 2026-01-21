<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class RefundResource extends JsonResource
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
            'transaction_id' => $this->transaction_id,
            'amount' => $this->amount,
            'reason' => $this->reason,
            'status' => $this->status,
            'requested_at' => $this->requested_at,
            'processed_at' => $this->processed_at,
            'user' => new UserResource($this->whenLoaded('user')),
            'event' => new EventResource($this->whenLoaded('event')),
            'ticket' => new TicketResource($this->whenLoaded('ticket')),
            'transaction' => new TransactionResource($this->whenLoaded('transaction')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
