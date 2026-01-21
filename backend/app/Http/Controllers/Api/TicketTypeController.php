<?php

namespace App\Http\Controllers\Api;

use App\Models\TicketType;
use App\Http\Requests\StoreTicketTypeRequest;
use App\Http\Requests\UpdateTicketTypeRequest;
use App\Http\Resources\TicketTypeResource;

class TicketTypeController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $ticketTypes = TicketType::paginate(15);
        return $this->successResponse(TicketTypeResource::collection($ticketTypes)->response()->getData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTicketTypeRequest $request)
    {
        try {
            $ticketType = TicketType::create($request->validated());
            return $this->successResponse(new TicketTypeResource($ticketType), 'Ticket type created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create ticket type', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(TicketType $ticketType)
    {
        return $this->successResponse(new TicketTypeResource($ticketType));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTicketTypeRequest $request, TicketType $ticketType)
    {
        try {
            $ticketType->update($request->validated());
            return $this->successResponse(new TicketTypeResource($ticketType), 'Ticket type updated successfully');
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to update ticket type', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TicketType $ticketType)
    {
        try {
            $ticketType->delete();
            return $this->successResponse(null, 'Ticket type deleted successfully', 204);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to delete ticket type', 500, ['error' => $e->getMessage()]);
        }
    }
}
