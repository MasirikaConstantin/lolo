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
        Schema::create('document_mariages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mariage_id')->constrained();
            $table->string('type_document'); // Certificat de célibat, bulletin de mariage, etc.
            $table->string('numero_document')->unique();
            $table->date('date_emission');
            $table->date('date_expiration')->nullable();
            $table->string('fichier')->nullable(); // Chemin vers le document scanné
            $table->boolean('livre')->default(false);
            $table->date('date_livraison')->nullable();
            $table->foreignId('livre_par')->nullable()->constrained('fonctionnaires');
            $table->uuid("ref")->unique();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_mariages');
    }
};
