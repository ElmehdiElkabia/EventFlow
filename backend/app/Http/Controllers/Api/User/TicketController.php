<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Api\BaseController;
use App\Http\Requests\Api\User\BuyTicketRequest;
use App\Models\Ticket;
use App\Models\Attendee;
use App\Models\Transaction;
use App\Models\Event;

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
                'event_id' => $ticket->event_id,
                'eventTitle' => $ticket->event->title,
                'date' => optional($ticket->event->start_date)->format('M d, Y'),
                'time' => optional($ticket->event->start_date)->format('h:i A'),
                'location' => $ticket->event->location,
                'ticketType' => $ticket->ticketType->name,
                'price' => $ticket->ticketType->price,
                'status' => $ticket->status,
                'qrCode' => $ticket->ticket_code, // ticket_code field from schema
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
        $event = Event::find($request->event_id);

        if (!$event) {
            return $this->notFound('Event not found');
        }

        // Create transaction
        $transaction = Transaction::create([
            'transaction_id' => 'TXN-' . strtoupper(uniqid()),
            'user_id' => auth()->user()->id,
            'event_id' => $event->id,
            'amount' => $request->amount,
            'status' => 'completed', // Would integrate with payment processor
            'payment_method' => 'card',
        ]);

        // Create tickets
        $tickets = [];
        $firstTicketId = null;
        
        for ($i = 0; $i < $request->quantity; $i++) {
            $ticket = Ticket::create([
                'user_id' => auth()->user()->id,
                'event_id' => $event->id,
                'ticket_type_id' => $request->ticket_type_id,
                'ticket_code' => 'TKT-' . strtoupper(uniqid()),
                'status' => 'valid',
                'price' => $request->amount / $request->quantity,
                'purchased_at' => now(),
            ]);

            if ($i === 0) {
                $firstTicketId = $ticket->id;
            }

            $tickets[] = [
                'id' => $ticket->id,
                'code' => $ticket->ticket_code,
            ];
        }

        // Create attendee record once per event (not per ticket)
        Attendee::firstOrCreate(
            [
                'user_id' => auth()->user()->id,
                'event_id' => $event->id,
            ],
            [
                'ticket_id' => $firstTicketId,
                'status' => 'registered',
            ]
        );

        return $this->success([
            'transaction_id' => $transaction->transaction_id,
            'tickets' => $tickets,
            'amount' => $transaction->amount,
        ], 'Tickets purchased successfully', 201);
    }
}
