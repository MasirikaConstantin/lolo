<?php

namespace Database\Factories;

use App\Models\Mariage;
use App\Models\Fonctionnaire;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class DocumentMariageFactory extends Factory
{
    public function definition()
    {
        $mariage = Mariage::factory()->create();
        $fonctionnaire = Fonctionnaire::factory()->create();

        $types = [
            'Certificat de célibat',
            'Bulletin de mariage',
            'Acte de mariage',
            'Certificat de coutume',
            'Extrait d\'acte de naissance'
        ];

        return [
            'mariage_id' => $mariage->id,
            'type_document' => $this->faker->randomElement($types),
            'numero_document' => $this->faker->unique()->bothify('DOC-####-????-####'),
            'date_emission' => $this->faker->dateTimeBetween('-1 month', 'now'),
            'date_expiration' => $this->faker->dateTimeBetween('now', '+1 year'),
            'fichier' => 'documents/'.$this->faker->word().'.pdf',
            'livre' => $this->faker->boolean(),
            'date_livraison' => $this->faker->optional()->dateTimeBetween('-1 month', 'now'),
            'livre_par' => $this->faker->boolean() ? $fonctionnaire->id : null,
            'ref' => Str::uuid(),
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}