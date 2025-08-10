<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Universite extends Model
{
    protected $fillable = [
        'nom',
        'universite_rattachement',
        'type',
        'annee_creation',
        'accreditation',
        'concours',
        'nombre_annees_etude',
        'bac_obligatoire',
        'localisation',
        'site_web',
        'seuils_admission',
        'etat_postulation',
        'date_ouverture',
        'date_fermeture',
        'mission_objectifs',
        'conditions_admission',
        'formations_proposees',
        'deroulement_concours',
    ];

    protected $casts = [
        'seuils_admission' => 'array',
        'formations_proposees' => 'array',
        'deroulement_concours' => 'array',
        'date_ouverture' => 'date',
        'date_fermeture' => 'date',
        'accreditation' => 'boolean',
        'concours' => 'boolean',
        'bac_obligatoire' => 'boolean',
        'annee_creation' => 'integer',
        'nombre_annees_etude' => 'integer',
    ];



    public function filieres()
    {
        return $this->hasMany(Filiere::class);
    }

    public function metiers()
    {
        return $this->hasMany(Metier::class);
    }

    public function scopeOuverte($query)
    {
        return $query->where("etat_postulation", "ouvert");
    }



    public function scopePublique($query)
    {
        return $query->where("type", "publique");
    }

    public function scopePrivee($query)
    {
        return $query->where("type", "privee");
    }


    public function scopeWithConcours($query)
    {
        return $query->where("concours", true);
    }


    public function isOpenForApplication(): bool
    {
        return $this->etat_postulation === "ouvert" && now()->between($this->date_ouverture, $this->date_fermeture);
    }


    public function getSeuilForBacType(string $typeBac): ?float 
    {
        return $this->seuils_admission[$typeBac] ?? null;
    }


    public function isEligibleForStudent(Student $student)
    {
        if (!$this->bac_obligatoire) {
            return true;
        }

        $typeBac = $this->determineBacType($student);
        $seuilRequis = $this->getSeuilForBacType($typeBac);

        return $seuilRequis ? $student->moyenne_general_bac >= $seuilRequis : false;

    }


    public function determineBacType(Student $student): string
    {

        $filiere = strtolower($student->filiere);



        return match (true) {
            str_contains($filiere, 'sciences mathématiques a') ||
            str_contains($filiere, 'sciences maths a') ||
            str_contains($filiere, 'sm a') => 'sciences_maths_a',

            str_contains($filiere, 'sciences mathématiques b') ||
            str_contains($filiere, 'sciences maths b') ||
            str_contains($filiere, 'sm b') => 'sciences_maths_b',

            str_contains($filiere, 'sciences physiques') ||
            str_contains($filiere, 'pc') => 'sciences_physiques',

            str_contains($filiere, 'sciences vie et terre') ||
            str_contains($filiere, 'sciences de la vie') ||
            str_contains($filiere, 'svt') => 'sciences_svt',

            str_contains($filiere, 'sciences économiques') ||
            str_contains($filiere, 'économie') ||
            str_contains($filiere, 'economie') ||
            str_contains($filiere, 'gestion') => 'economie',

            str_contains($filiere, 'littéraire') ||
            str_contains($filiere, 'litteraire') ||
            str_contains($filiere, 'lettres') ||
            str_contains($filiere, 'langue') ||
            str_contains($filiere, 'philosophie') => 'lettres',

            default => 'general'
        };


    }





}
