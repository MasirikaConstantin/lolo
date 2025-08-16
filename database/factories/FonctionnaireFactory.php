<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class FonctionnaireFactory extends Factory
{
    public function definition()
    {
        return [
            'nom' => $this->faker->lastName(),
            'postnom' => $this->faker->lastName(),
            'prenom' => $this->faker->firstName(),
            'fonction' => $this->faker->randomElement(['Maire', 'Officier d\'état civil', 'Secrétaire', 'Agent administratif']),
            'grade' => $this->faker->randomElement(['A', 'B', 'C', 'D']),
            'matricule' => $this->faker->unique()->bothify('??####'),
            'email' => $this->faker->unique()->safeEmail(),
            'telephone' => $this->faker->phoneNumber(),
            'date_embauche' => $this->faker->dateTimeBetween('-10 years', 'now'),
            'photo' => null,
            'user_id' => User::factory(), // This will create a User automatically
            'created_by' => null,
            'updated_by' => null,
            'ref' => Str::uuid(),
        ];
    }
}