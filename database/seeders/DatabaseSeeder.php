<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Citoyen;
use App\Models\Fonctionnaire;
use App\Models\Mariage;
use App\Models\DocumentMariage;
use App\Models\Paiement;
use App\Models\EtapeMariage;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
User::factory(10)->create();

Citoyen::factory()->count(100)->create();

Fonctionnaire::factory()->count(5)->create();

Fonctionnaire::factory()->create([
    'fonction' => 'Maire',
    'grade' => 'A'
]);

    // Create 5 mariages with all related documents
Mariage::factory()->count(5)->has(DocumentMariage::factory()->count(3), 'documents')->create();

// Create a mariage with specific attributes
Mariage::factory()->create([
'statut' => 'célébré',
'regime_matrimonial' => 'Communauté réduite'
]);

// Create documents for an existing mariage
$mariage = Mariage::all()->random();
DocumentMariage::factory()->count(2)->for($mariage)->create();
// Create 3 paiements for a specific mariage
$mariage = Mariage::where('statut', 'approuvé')->inRandomOrder()->get()->random();
Paiement::factory()
    ->count(3)
    ->for($mariage)
    ->create();

// Create all etapes for a mariage
$etapes = [
    'Dépôt dossier',
    'Paiement frais',
    'Vérification documents',
    'Publication bans',
    'Célébration'
];

foreach ($etapes as $etape) {
    EtapeMariage::factory()
        ->for($mariage)
        ->create(['etape' => $etape]);
}

// Create a paiement with specific attributes
Paiement::factory()->create([
    'montant' => 250000,
    'mode_paiement' => 'Mobile Money',
    'statut' => 'payé'
]);

// Create an etape with completed status
EtapeMariage::factory()->create([
    'etape' => 'Dépôt dossier',
    'statut' => 'complété',
    'date_fin' => now()->format('Y-m-d')
]); 
    }
}
