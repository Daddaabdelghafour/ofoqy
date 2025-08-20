<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */

    public function up()
    {
        Schema::table('correspondances_mbti_metiers', function (Blueprint $table) {
            $table->index('type_mbti');
            $table->index('metier_id');
        });

        Schema::table('filieres', function (Blueprint $table) {
            $table->index('nom');
        });

    }

    public function down()
    {
        Schema::table('correspondances_mbti_metiers', function (Blueprint $table) {
            $table->dropIndex(['type_mbti']);
            $table->dropIndex(['metier_id']);
        });

        Schema::table('filieres', function (Blueprint $table) {
            $table->dropIndex(['nom']);
        });


    }
};
