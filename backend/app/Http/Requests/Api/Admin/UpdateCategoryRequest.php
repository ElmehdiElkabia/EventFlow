<?php

namespace App\Http\Requests\Api\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'icon' => ['sometimes', 'string'],
            'description' => ['sometimes', 'string'],
            'gradient' => ['sometimes', 'string'],
            'image' => ['sometimes', 'url'],
        ];
    }
}
