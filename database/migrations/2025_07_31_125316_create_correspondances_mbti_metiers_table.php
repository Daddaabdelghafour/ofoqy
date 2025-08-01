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
        Schema::create('correspondances_mbti_metiers', function (Blueprint $table) {
            $table->id();
            $table->enum("type_mbti", [
                'INTJ',
                'INTP',
                'ENTJ',
                'ENTP',
                'INFJ',
                'INFP',
                'ENFJ',
                'ENFP',
                'ISTJ',
                'ISFJ',
                'ESTJ',
                'ESFJ',
                'ISTP',
                'ISFP',
                'ESTP',
                'ESFP'
            ]);
            $table->foreignId("metier_id")->constrained("metiers")->onDelete("cascade");
            $table->integer("niveau_affinite")->comment("1-10 : niveau de compatibilité");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('correspondances_mbti_metiers');
    }
};
