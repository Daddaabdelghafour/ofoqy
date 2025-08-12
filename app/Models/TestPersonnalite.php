<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestPersonnalite extends Model
{
    protected $table = 'tests_personnalite';
    
    protected $fillable = [
        'student_id',
        'type_mbti',
        'resultat_json',
    ];

    protected $casts = [
        'resultat_json' => 'array'
    ];


    public function student()
    {
        return $this->belongsTo(Student::class);
    }


    public function correspondancesMetiers()
    {
        return $this->hasMany(CorrespondanceMbtiMetier::class, 'type_mbti', 'type_mbti')->orderBy("niveau_affinite", "desc");
    }



}
