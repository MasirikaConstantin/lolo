<?php

namespace Database\Factories;

use App\Models\Citoyen;
use App\Models\Fonctionnaire;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MariageFactory extends Factory
{
    public function definition()
    {
        // Get or create a male citoyen
        $homme = Citoyen::factory()->create(['sexe' => 'M']);
        
        // Get or create a female citoyen
        $femme = Citoyen::factory()->create(['sexe' => 'F']);
        
        // Get or create an officier (fonctionnaire)
        $officier = Fonctionnaire::factory()->create();

        return [
            'homme_id' => $homme->id,
            'femme_id' => $femme->id,
            'date_mariage' => $this->faker->dateTimeBetween('now', '+1 year')->format('Y-m-d'),
            'heure_mariage' => $this->faker->time('H:i:s'),
            'officier_id' => $officier->id,
            'lieu_mariage' => $this->faker->city(),
            'regime_matrimonial' => $this->faker->randomElement([
                'Séparation de biens', 
                'Communauté réduite', 
                'Communauté universelle',
                'Participation aux acquêts'
            ]),
            'temoins_homme' => $this->faker->name().', '.$this->faker->name(),
            'temoins_femme' => $this->faker->name().', '.$this->faker->name(),
            'statut' => $this->faker->randomElement(['en_attente', 'approuvé', 'rejeté', 'célébré']),
            'notes' => $this->faker->sentence(),
            'created_by' => null,
            'updated_by' => null,
            'ref' => Str::uuid(),
        ];
    }
}