<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mariages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('homme_id')->constrained('citoyens');
            $table->foreignId('femme_id')->constrained('citoyens');
            $table->date('date_mariage');
            $table->time('heure_mariage');
            $table->foreignId('officier_id')->constrained('fonctionnaires');
            $table->string('lieu_mariage');
            $table->string('regime_matrimonial'); // Séparation de biens, communauté réduite, etc.
            $table->text('temoins_homme')->nullable(); // Noms des témoins
            $table->text('temoins_femme')->nullable();
            $table->string('statut')->default('en_attente'); // en_attente, approuvé, rejeté, célébré
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->uuid("ref")->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mariages');
    }
};
