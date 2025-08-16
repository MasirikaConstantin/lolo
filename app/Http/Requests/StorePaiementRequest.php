<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePaiementRequest extends FormRequest
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
            'mariage_id' => [
                'required',
                'exists:mariages,id',
                function ($attribute, $value, $fail) {
                    $mariage = \App\Models\Mariage::find($value);
                    if ($mariage && $mariage->statut !== 'approuvé') {
                        $fail('Le mariage doit être approuvé pour enregistrer un paiement.');
                    }
                },
            ],
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:Espèces,Mobile Money,Carte Bancaire,Virement,Chèque',
            'reference_paiement' => 'required|string|max:255|unique:paiements',
            'date_paiement' => 'required|date',
            'statut' => 'required|in:payé,impayé,remboursé',
            'encaisser_par' => 'required|exists:fonctionnaires,id',
            'notes' => 'nullable|string',
        ];
    }
}
