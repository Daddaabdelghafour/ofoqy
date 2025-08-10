<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('filiere_metier', function (Blueprint $table) {
            $table->id();
            $table->foreignId("filiere_id")->constrained("filieres")->onDelete("cascade");
            $table->foreignId("metier_id")->constrained("metiers")->onDelete("cascade");
            $table->timestamps();

            $table->unique(['filiere_id', 'metier_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filiere_metier');
    }
};
