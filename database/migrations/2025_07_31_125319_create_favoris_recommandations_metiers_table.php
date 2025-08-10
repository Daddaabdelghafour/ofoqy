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
        Schema::create('favoris_recommandations_metiers', function (Blueprint $table) {
            $table->id();
            $table->foreignId("student_id")->constrained("students")->onDelete("cascade");
            $table->foreignId("metier_id")->constrained("metiers")->onDelete("cascade");
            $table->date("date_favoris");
            $table->timestamps();

            $table->unique(['student_id', 'metier_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favoris_recommandations_metiers');
    }
};
