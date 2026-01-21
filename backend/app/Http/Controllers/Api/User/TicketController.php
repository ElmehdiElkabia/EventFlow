<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\User\BuyTicketRequest;
use App\Models\Ticket;
use App\Models\Attendee;

/**
 * User Ticket Controller
 * 
 * Handles user ticket browsing and purchases.
 */
class TicketController extends BaseController
{
    /**
     * Get user's tickets
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $tickets = Ticket::where('user_id', auth()->user()->id)
            ->with('event', 'ticketType')
            ->get()
            ->map(fn($ticket) => [
                'id' => $ticket->id,
                'eventTitle' => $ticket->event->title,
                'date' => $ticket->event->date->format('M d, Y'),
                'time' => $ticket->event->date->format('h:i A'),
                'location' => $ticket->event->location,
                'ticketType' => $ticket->ticketType->name,
                'price' => $ticket->ticketType->price,
                'status' => $ticket->status,
                'qrCode' => $ticket->code, // Or generate QR code
            ]);

        return $this->success($tickets->all());
    }

    /**
     * Buy tickets for an event
     * 
     * @param BuyTicketRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function buy(BuyTicketRequest $request)
    {
        $event = \App\Models\Event::find($request->event_id);

        if (!$event) {
            return $this->notFound('Event not found');
        }

        // Create transaction
        $transaction = \App\Models\Transaction::create([
            'user_id' => auth()->user()->id,
            'event_id' => $event->id,
            'amount' => $request->amount,
            'status' => 'completed', // Would integrate with payment processor
        ]);

        // Create tickets
        $tickets = [];
        for ($i = 0; $i < $request->quantity; $i++) {
            $ticket = Ticket::create([
                'user_id' => auth()->user()->id,
                'event_id' => $event->id,
                'ticket_type_id' => $request->ticket_type_id,
                'code' => 'TKT-' . uniqid(),
                'status' => 'active',
            ]);

            // Create attendee record
            Attendee::create([
                'user_id' => auth()->user()->id,
                'event_id' => $event->id,
                'ticket_id' => $ticket->id,
                'status' => 'registered',
            ]);

            $tickets[] = [
                'id' => $ticket->id,
                'code' => $ticket->code,
            ];
        }

        return $this->success([
            'transaction_id' => $transaction->id,
            'tickets' => $tickets,
            'amount' => $transaction->amount,
        ], 'Tickets purchased successfully', 201);
    }
}
