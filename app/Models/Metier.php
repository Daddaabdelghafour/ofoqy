<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Metier extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'image_path',
    ];

    protected $casts = [
        // Removed salaire_indicatif and universite_id as they're in pivot
    ];

    public function universites()
    {
        return $this->belongsToMany(Universite::class)
                   ->withPivot('salaire_indicatif')
                   ->withTimestamps();
    }

    public function correspondancesMbti()
    {
        return $this->hasMany(CorrespondanceMbtiMetier::class);
    }

    public function filieres()
    {
        return $this->belongsToMany(Filiere::class, 'filiere_metier');
    }


    public function favoris()
    {
        return $this->hasMany(FavorisRecommandationMetier::class);
    }


    public function scopeHighSalary($query, int $minimum = 8000)
    {
        return $query->where("salaire_indicatif", ">=", $minimum);
    }


    public function scopeBySector($query, string $secteur)
    {
        return $query->where("secteur_activite", $secteur);
    }

    public function scopePopular($query, int $minFavoris = 5)
    {
        return $query->withCount('favoris')->having('favoris_count', '>=', $minFavoris);
    }

    public function getFormattedSalary()
    {
        if (!$this->salaire_indicatif) {
            return 'Salaire non renseigné';

        }
        return number_format($this->salaire_indicatif, 0, '.', ' ') . 'MAD';
    }

    public function isPopular()
    {
        return $this->favoris()->count() > 10;
    }


    public function getRequiredCompetences()
    {
        return $this->competences_requises ?? [];
    }


    public function getSalaryRange()
    {
        $salaire = $this->salaire_indicatif;

        return match (true) {
            $salaire < 5000 => 'Entrée de gamme',
            $salaire < 10000 => 'Moyen',
            $salaire < 20000 => 'Élevé',
            default => 'Très élevé'

        };
    }

}
