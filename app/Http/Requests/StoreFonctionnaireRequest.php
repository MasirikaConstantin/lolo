<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreFonctionnaireRequest extends FormRequest
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
            'nom' => 'required|string|max:255',
            'postnom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'fonction' => 'required|string|max:255',
            'grade' => 'required|string|max:255',
            'matricule' => 'required|string|max:255|unique:fonctionnaires',
            'email' => 'required|string|email|max:255|unique:fonctionnaires',
            'telephone' => 'required|string|max:20',
            'date_embauche' => 'required|date',
            'photo' => 'nullable|image|max:2048',
        ];
    }
}
