<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admin extends Model
{
    protected $fillable = [
        'nom_complet',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token'
    ];


    protected $casts = [
        'email_verified_at' => 'datetime',
    ];


    public function getNameAttribute()
    {
        return $this->nom_complet;
    }








}
