<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePieceJointeRequest extends FormRequest
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
    public function rules()
    {
        return [
            'type_piece' => 'required|string|max:255',
            'numero_piece' => 'required|string|max:255',
            'fichier' => 'required|file|max:2048', // 2MB max
            'date_emission' => 'required|date',
            'date_expiration' => 'nullable|date',
            'attachable_type' => 'nullable|string',
            'attachable_id' => 'nullable|integer',
        ];
    }
}
