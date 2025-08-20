<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CorrespondanceMbtiMetier extends Model
{
    protected $table = 'correspondances_mbti_metiers'; 
    protected $fillable = [
        'type_mbti',
        'metier_id',
        'niveau_affinite',
    ];


    protected $casts = [
        'niveau_affinite' => 'integer',
    ];


    // Relations Eloquent ^^

    public function metier()
    {
        return $this->belongsTo(Metier::class);
    }



    // Scopes 

    public function scopeHighCompatibility($query)
    {
        return $query->where("niveau_affinite", '>=', 8);
    }

    public function scopeMediumCompatibility($query)
    {
        return $query->whereBetween("niveau_affinite", [5, 7]);
    }

    public function scopeLowCompatibility($query)
    {
        return $query->where("niveau_affinite", '<', 5);
    }


    public function scopeForMBTI($query, $mbtiType)
    {
        return $query->where("type_mbti", $mbtiType);
    }

    public function scopeOrderedByCompatibility($query)
    {
        return $this->orderBy("niveau_affinite", 'desc');
    }


    //helpers 

    public function getCompatibilityLevel()
    {
        return match (true) {
            $this->niveau_affinite >= 9 => 'Parfaitement Recommendé',
            $this->niveau_affinite >= 8 => 'Très Recommandé',
            $this->niveau_affinite >= 6 => 'Bien Recommendé',
            $this->niveau_affinite >= 4 => 'Peu Recommendé',
            default => 'Pas Recommendé'
        };
    }


    public function getCompatibilityColor()
    {
        return match (true) {
            $this->niveau_affinite >= 8 => "green",
            $this->niveau_affinite >= 6 => "blue",
            $this->niveau_affinite >= 4 => 'yellow',
            default => 'red'
        };
    }


    public function getCompatibilityPercentage()
    {
        return ($this->niveau_affinite / 10) * 100;
    }
















}
