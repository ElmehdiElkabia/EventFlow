<?php

namespace App\Http\Requests\Api\Organizer;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['sometimes', 'string'],
            'date' => ['sometimes', 'date'],
            'end_date' => ['sometimes', 'date'],
            'location' => ['sometimes', 'string'],
            'address' => ['sometimes', 'string'],
            'latitude' => ['sometimes', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'numeric', 'between:-180,180'],
            'capacity' => ['sometimes', 'integer', 'min:1'],
            'image' => ['sometimes', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'category_id' => ['sometimes', 'exists:categories,id'],
            'ticket_types' => ['sometimes', 'array'],
            'ticket_types.*.name' => ['required', 'string'],
            'ticket_types.*.price' => ['required', 'numeric', 'min:0'],
            'ticket_types.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
