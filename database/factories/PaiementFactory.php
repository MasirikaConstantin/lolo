<?php

namespace Database\Factories;

use App\Models\Mariage;
use App\Models\Fonctionnaire;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class PaiementFactory extends Factory
{
    public function definition()
    {
        $mariage = Mariage::where('statut', 'approuvé')->inRandomOrder()->get()->random();
        $fonctionnaire = Fonctionnaire::factory()->create();

        return [
            'mariage_id' => $mariage->id,
            'montant' => $this->faker->randomFloat(2, 50000, 500000),
            'mode_paiement' => $this->faker->randomElement([
                'Espèces',
                'Mobile Money',
                'Carte bancaire',
                'Virement bancaire',
                'Chèque'
            ]),
            'reference_paiement' => 'PAY-'.Str::upper(Str::random(8)),
            'date_paiement' => $this->faker->dateTimeBetween('-1 month', 'now')->format('Y-m-d'),
            'statut' => $this->faker->randomElement(['payé', 'impayé', 'remboursé']),
            'encaisser_par' => $fonctionnaire->id,
            'notes' => $this->faker->optional()->sentence(),
            'ref' => Str::uuid(),
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}