<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FavorisRecommandationUniversite extends Model
{
    protected $fillable = [
        'student_id',
        'universite_id',
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


    public function universite()
    {
        return $this->belongsTo(Universite::class);
    }





    // scopes 

    public function scopeRecent($query, int $days = 30)
    {
        return $query->where('date_favoris', '>=', now()->subDays($days));
    }


    public function scopeByStudent($query, int $studentId)
    {
        return $query->where("student_id", $studentId);
    }



    public function scopeByUniversite($query, int $universiteId)
    {
        return $query->where("universite_id", $universiteId);
    }


    // Helpers 

    public function isRecent(int $days = 7)
    {
        return $this->date_favoris >= now()->subDays($days);
    }


    public function getTimeSinceFavorited()
    {
        return $this->date_favoris->diffForHumans();
    }


    



















}
