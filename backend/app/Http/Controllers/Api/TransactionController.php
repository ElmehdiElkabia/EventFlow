<?php

namespace App\Http\Controllers\Api;

use App\Models\Transaction;
use App\Http\Requests\StoreTransactionRequest;
use App\Http\Resources\TransactionResource;

class TransactionController extends ApiController
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $transactions = Transaction::with(['user', 'event'])->paginate(15);
        return $this->successResponse(TransactionResource::collection($transactions)->response()->getData());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTransactionRequest $request)
    {
        try {
            $transaction = Transaction::create($request->validated());
            return $this->successResponse(new TransactionResource($transaction), 'Transaction created successfully', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Failed to create transaction', 500, ['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        $transaction->load(['user', 'event']);
        return $this->successResponse(new TransactionResource($transaction));
    }
}
