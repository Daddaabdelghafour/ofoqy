<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavorisRecommandationMetier extends Model
{
    protected $fillable = [
        'student_id',
        'metier_id',
        'date_favoris',
    ];



    protected $casts = [
        'date_favoris' => 'datetime',
    ];


    // relations

    public function student()
    {
        return $this->belongsTo(Student::class);
    }


    public function metier()
    {
        return $this->belongsTo(Metier::class);
    }


    // scopes 

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('date_favoris', '>=', now()->subDays($days));
    }


    public function scopeByStudent($query, int $studentId)
    {
        return $query->where('student_id', $studentId);
    }

    public function scopeByMetier($query, int $metierId)
    {
        return $query->where('metier_id', $metierId);
    }

    // helper methods 

    public function isRecent(int $days = 7)
    {
        return $this->date_favoris >= now()->subDays($days);
    }


    public function getTimeSinceFavorited()
    {
        return $this->date_favoris->diffForHumans();
    }








}
