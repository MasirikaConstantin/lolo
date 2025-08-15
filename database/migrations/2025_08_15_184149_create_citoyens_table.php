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
        Schema::create('citoyens', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('postnom');
            $table->string('prenom');
            $table->string('sexe'); // M ou F
            $table->date('date_naissance');
            $table->string('lieu_naissance');
            $table->string('etat_civil'); // Célibataire, Marié(e), Divorcé(e), Veuf/Veuve
            $table->string('profession');
            $table->string('adresse');
            $table->string('nom_pere');
            $table->string('nom_mere');
            $table->string('numero_identification_national')->unique()->nullable();
            $table->string('photo')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citoyens');
    }
};
