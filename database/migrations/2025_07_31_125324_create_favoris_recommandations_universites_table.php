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
        Schema::create('favoris_recommandations_universites', function (Blueprint $table) {
            $table->id();
            $table->foreignId("student_id")->constrained("students")->onDelete("cascade");
            $table->foreignId("universite_id")->constrained("universites")->onDelete("cascade");
            $table->date("date_favoris");
            $table->timestamps();

            $table->unique(["student_id", "universite_id"],'favoris_unique');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('favoris_recommandations_universites');
    }
};
