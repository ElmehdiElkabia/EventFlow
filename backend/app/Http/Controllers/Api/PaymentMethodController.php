<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentMethodController extends Controller
{
    /**
     * Get all payment methods for authenticated user
     */
    public function index(Request $request)
    {
        $paymentMethods = $request->user()
            ->paymentMethods()
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $paymentMethods,
        ]);
    }

    /**
     * Store a new payment method
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:visa,mastercard,amex,discover',
            'last_four' => 'required|string|size:4',
            'cardholder_name' => 'required|string|max:255',
            'expiry_month' => 'required|string|size:2',
            'expiry_year' => 'required|string|size:4',
            'brand' => 'nullable|string',
            'is_default' => 'boolean',
        ]);

        DB::beginTransaction();
        try {
            // If this is set as default, unset all other defaults
            if ($request->is_default) {
                $request->user()->paymentMethods()->update(['is_default' => false]);
            }

            // If this is the first payment method, make it default
            $isFirstMethod = $request->user()->paymentMethods()->count() === 0;

            $paymentMethod = $request->user()->paymentMethods()->create([
                'type' => $request->type,
                'last_four' => $request->last_four,
                'cardholder_name' => $request->cardholder_name,
                'expiry_month' => $request->expiry_month,
                'expiry_year' => $request->expiry_year,
                'brand' => $request->brand ?? $request->type,
                'is_default' => $request->is_default || $isFirstMethod,
                'stripe_payment_method_id' => $request->stripe_payment_method_id,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment method added successfully',
                'data' => $paymentMethod,
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to add payment method',
            ], 500);
        }
    }

    /**
     * Update a payment method
     */
    public function update(Request $request, $id)
    {
        $paymentMethod = $request->user()
            ->paymentMethods()
            ->findOrFail($id);

        $request->validate([
            'cardholder_name' => 'sometimes|string|max:255',
            'expiry_month' => 'sometimes|string|size:2',
            'expiry_year' => 'sometimes|string|size:4',
        ]);

        $paymentMethod->update($request->only([
            'cardholder_name',
            'expiry_month',
            'expiry_year',
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Payment method updated successfully',
            'data' => $paymentMethod,
        ]);
    }

    /**
     * Set payment method as default
     */
    public function setDefault(Request $request, $id)
    {
        $paymentMethod = $request->user()
            ->paymentMethods()
            ->findOrFail($id);

        DB::beginTransaction();
        try {
            // Unset all other defaults
            $request->user()->paymentMethods()->update(['is_default' => false]);
            
            // Set this one as default
            $paymentMethod->update(['is_default' => true]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Default payment method updated',
                'data' => $paymentMethod,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update default payment method',
            ], 500);
        }
    }

    /**
     * Delete a payment method
     */
    public function destroy(Request $request, $id)
    {
        $paymentMethod = $request->user()
            ->paymentMethods()
            ->findOrFail($id);

        // Don't allow deletion of default method if there are others
        if ($paymentMethod->is_default && $request->user()->paymentMethods()->count() > 1) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete default payment method. Please set another card as default first.',
            ], 422);
        }

        $paymentMethod->delete();

        return response()->json([
            'success' => true,
            'message' => 'Payment method deleted successfully',
        ]);
    }
}
