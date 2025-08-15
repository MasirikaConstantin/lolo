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
        Schema::create('piece_jointes', function (Blueprint $table) {
            $table->id();
            $table->morphs('attachable'); // Relation polymorphique
            $table->string('type_piece'); // CNI, acte de naissance, etc.
            $table->string('numero_piece');
            $table->string('fichier');
            $table->date('date_emission');
            $table->date('date_expiration')->nullable();
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
        Schema::dropIfExists('piece_jointes');
    }
};
