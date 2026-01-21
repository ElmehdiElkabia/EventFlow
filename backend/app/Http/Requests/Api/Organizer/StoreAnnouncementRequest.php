<?php

namespace App\Http\Requests\Api\Organizer;

use Illuminate\Foundation\Http\FormRequest;

class StoreAnnouncementRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
            'event_id' => ['required', 'exists:events,id'],
        ];
    }
}
