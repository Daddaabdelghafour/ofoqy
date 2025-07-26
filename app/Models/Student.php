<?php

namespace App\Models;

use App\Notifications\StudentPasswordResetNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Student extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nom_complet',
        'ville',
        'age',
        'genre',
        'email',
        'password',
        'niveau_etude',
        'filiere',
        'langue_bac',
        'moyenne_general_bac',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'moyenne_general_bac' => 'decimal:2',
        'age' => 'integer',
    ];


    /**
     * Get the name attribute for Fortify compatibility
     */
    public function getNameAttribute()
    {
        return $this->nom_complet;
    }

    public function getEmailForPasswordReset(): string
    {
        return $this->email;
    }

    /**
     * Send a password reset notification to the user.
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new StudentPasswordResetNotification($token));
    }


}