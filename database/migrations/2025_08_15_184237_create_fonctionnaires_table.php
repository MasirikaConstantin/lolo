<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fonctionnaires', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('postnom');
            $table->string('prenom');
            $table->string('fonction'); // Maire, Officier d'état civil, etc.
            $table->string('grade');
            $table->string('matricule')->unique();
            $table->string('email')->unique();
            $table->string('telephone');
            $table->timestamp('date_embauche');
            $table->string('photo')->nullable();
            $table->foreignIdFor(User::class)->constrained('users')->onDelete('cascade');
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
        Schema::dropIfExists('fonctionnaires');
    }
};
