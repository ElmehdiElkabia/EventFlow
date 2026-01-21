<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTicketRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user_id' => 'sometimes|exists:users,id',
            'event_id' => 'sometimes|exists:events,id',
            'ticket_type_id' => 'sometimes|exists:ticket_types,id',
            'qr_code' => 'nullable|string',
            'status' => 'sometimes|in:available,used,cancelled',
            'price' => 'sometimes|numeric|min:0',
        ];
    }
}
