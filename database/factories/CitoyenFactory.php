<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CitoyenFactory extends Factory
{
    public function definition()
    {
        $gender = $this->faker->randomElement(['M', 'F']);
        
        return [
            'nom' => $this->faker->lastName(),
            'postnom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName($gender === 'M' ? 'male' : 'female'),
            'sexe' => $gender,
            'date_naissance' => $this->faker->dateTimeBetween('-70 years', '-18 years')->format('Y-m-d'),
            'lieu_naissance' => $this->faker->city(),
            'etat_civil' => $this->faker->randomElement(['Célibataire', 'Marié(e)', 'Divorcé(e)', 'Veuf/Veuve']),
            'profession' => $this->faker->jobTitle(),
            'adresse' => $this->faker->address(),
            'nom_pere' => $this->faker->name('male'),
            'nom_mere' => $this->faker->name('female'),
            'numero_identification_national' => $this->faker->unique()->numerify('##########'),
            'photo' => null,
            'ref' => Str::uuid(),
            'created_by' => null,
            'updated_by' => null,
        ];
    }
}