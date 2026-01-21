<?php

namespace App\Http\Requests\Api\Organizer;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'date' => ['required', 'date', 'after:now'],
            'end_date' => ['required', 'date', 'after:date'],
            'location' => ['required', 'string'],
            'address' => ['nullable', 'string'],
            'latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'capacity' => ['required', 'integer', 'min:1'],
            'image' => ['nullable', 'url'],
            'category_id' => ['required', 'exists:categories,id'],
            'ticket_types' => ['nullable', 'array'],
            'ticket_types.*.name' => ['required', 'string'],
            'ticket_types.*.price' => ['required', 'numeric', 'min:0'],
            'ticket_types.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
