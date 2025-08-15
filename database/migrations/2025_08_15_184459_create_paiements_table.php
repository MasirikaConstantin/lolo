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
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mariage_id')->constrained();
            $table->decimal('montant', 10, 2);
            $table->string('mode_paiement'); // Espèces, mobile money, carte, etc.
            $table->string('reference_paiement');
            $table->date('date_paiement');
            $table->string('statut')->default('payé'); // payé, impayé, remboursé
            $table->foreignId('encaisser_par')->constrained('fonctionnaires');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
