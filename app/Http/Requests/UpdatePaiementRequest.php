<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePaiementRequest extends FormRequest
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
            'montant' => 'required|numeric|min:0',
            'mode_paiement' => 'required|in:Espèces,Mobile Money,Carte Bancaire,Virement,Chèque',
            'reference_paiement' => [
                'required',
                'string',
                'max:255,'
               .$this->paiement->id,
            ],
            'date_paiement' => 'required|date',
            'statut' => 'required|in:payé,impayé,remboursé',
            'encaisser_par' => 'required|exists:fonctionnaires,id',
            'notes' => 'nullable|string',
        ];
    }
}
