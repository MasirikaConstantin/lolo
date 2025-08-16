<?php

namespace Database\Factories;

use App\Models\Mariage;
use App\Models\Fonctionnaire;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class EtapeMariageFactory extends Factory
{
    public function definition()
    {
        $mariage = Mariage::factory()->create();
        $fonctionnaire = Fonctionnaire::factory()->create();

        $etapes = [
            'depot_dossier',
            'paiement',
            'publication_bans' ,
            'verification',
            'celebration' ,
            'enregistrement',
            'livraison_acte' 
        ];

        $statuts = ['complété', 'en cours', 'en attente', 'annulé'];

        return [
            'mariage_id' => $mariage->id,
            'etape' => $this->faker->randomElement($etapes),
            'statut' => $this->faker->randomElement($statuts),
            'date_debut' => $this->faker->dateTimeBetween('-2 months', 'now'),
            'date_fin' => $this->faker->optional()->dateTimeBetween('now', '+1 month'),
            'responsable_id' => $this->faker->boolean(75) ? $fonctionnaire->id : null,
            'commentaires' => $this->faker->optional()->sentence(),
            'ref' => Str::uuid(),
            'created_by' => null,
            'updated_by' => null,
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function ($etape) {
            // Ensure date_fin is after date_debut when both exist
            if ($etape->date_fin && $etape->date_debut > $etape->date_fin) {
                $etape->update([
                    'date_fin' => $this->faker->dateTimeBetween($etape->date_debut, '+1 month')
                ]);
            }
        });
    }
}