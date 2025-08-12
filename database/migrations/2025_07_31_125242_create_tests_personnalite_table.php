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
        Schema::create('tests_personnalite', function (Blueprint $table) {
            $table->id();
            $table->foreignId("student_id")->unique()->constrained("students")->onDelete("cascade");
            $table->enum("type_mbti", [
            'SCJL',
            'SCJH',
            'SCPL',
            'SCPH',
            'STJL',
            'STJH',
            'STPL',
            'STPH',
            'ICJL',
            'ICJH',
            'ICPL',
            'ICPH',
            'ITJL',
            'ITJH',
            'ITPL',
            'ITPH'
        ]);
            $table->json("resultat_json");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tests_personnalite');
    }
};
