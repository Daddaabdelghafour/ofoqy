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
        Schema::create('universites', function (Blueprint $table) {
            $table->id();
            $table->string("nom");
            $table->string("universite_rattachement")->nullable();
            $table->enum("type", ['publique', 'privee']);
            $table->integer("annee_accrediation");
            $table->boolean("accreditation")->default(false);
            $table->boolean("concours")->default(false);
            $table->integer("nombre_annees_etude");
            $table->boolean("bac_obligatoire")->default(true);
            $table->string("localisation");
            $table->string("site_web")->nullable();
            $table->json("seuils_admission");
            $table->enum("etat_postulation", ["ouvert", "ferme", "bientot"]);
            $table->date("date_ouverture")->nullable();
            $table->date("date_fermeture")->nullable();
            $table->json("conditions_admission")->nullable();
            $table->json("formations_proposees")->nullable();
            $table->json("deroulement_concours")->nullable();
            $table->timestamps();






        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('universites');
    }
};
