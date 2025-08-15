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
        Schema::create('etape_mariages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mariage_id')->constrained();
            $table->string('etape'); // dépôt dossier, paiement, publication bans, célébration, etc.
            $table->string('statut'); // complété, en cours, en attente
            $table->date('date_debut')->nullable();
            $table->date('date_fin')->nullable();
            $table->foreignId('responsable_id')->nullable()->constrained('fonctionnaires');
            $table->text('commentaires')->nullable();
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
        Schema::dropIfExists('etape_mariages');
    }
};
