<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Admin extends Authenticatable
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
