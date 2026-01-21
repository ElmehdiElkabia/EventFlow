<?php

namespace App\Http\Controllers\Api;

use App\Models\Ticket;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use App\Http\Resources\TicketResource;

class TicketController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tickets = Ticket::with(['user', 'event', 'ticketType'])->paginate(15);
        return $this->successResponse(TicketResource::collection($tickets)->response()->getData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketRequest $request)
    {
        try {
            $ticket = Ticket::create($request->validated());
            return $this->successResponse(new TicketResource($ticket), 'Ticket created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create ticket', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        $ticket->load(['user', 'event', 'ticketType']);
        return $this->successResponse(new TicketResource($ticket));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        try {
            $ticket->update($request->validated());
            return $this->successResponse(new TicketResource($ticket), 'Ticket updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update ticket', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        try {
            $ticket->delete();
            return $this->successResponse(null, 'Ticket deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete ticket', 500, ['error' => $e->getMessage()]);
        }
    }
}
