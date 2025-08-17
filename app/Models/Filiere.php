<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'competences',
        'parcours_formation',
        'universite_id',
        'image_path',
    ];


    protected $casts = [
        'competences' => 'array',
        'parcours_formation' => 'array',
    ];


    public function universite()
    {
        return $this->belongsTo(Universite::class);
    }


    public function metiers()
    {
        return $this->belongsToMany(Metier::class, 'filiere_metier');
    }


    public function scopeByUniversity($query, $universite_Id)
    {
        return $query->where("universite_id", $universite_Id);
    }


    public function scopeWithMetiers($query)
    {
        return $query->with("metiers");
    }

    // méthodes utiles pour nous faciliter certaines taches

    public function getCompetencesList(): array
    {
        return $this->competences ?? [];
    }


    public function getFormattedName(): string
    {
        return $this->nom . ' - ' . $this->universite->nom;

    }


    public function getDureeFormation(): ?string
    {
        $parcours = $this->parcours_formation;
        return $parcours['duree'] ?? null;
    }


    public function getDebouchesCount()
    {
        return $this->metiers()->count();
    }



}
