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
        Schema::create('students', function (Blueprint $table) {
            $table->id();
            $table->string('nom_complet');
            $table->string('ville');
            $table->integer('age');
            $table->enum('genre', ['masculin', 'feminin']);
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('niveau_etude', [
                'baccalaureat',
            ]);
            $table->string('filiere');
            $table->enum('langue_bac', ['francais', 'arabe', 'anglais']);
            $table->decimal('moyenne_general_bac', 4, 2); // 00.00 format
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};