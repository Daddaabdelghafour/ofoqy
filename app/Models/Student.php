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

    public function testPersonnalite()
    {
        return $this->hasOne(TestPersonnalite::class);
    }

    public function favorisMetiers()
    {
        return $this->hasMany(FavorisRecommandationMetier::class);
    }

    public function favorisUniversites()
    {
        return $this->hasMany(FavorisRecommandationUniversite::class);
    }


    public function messagesChatbot()
    {
        return $this->hasMany(MessageChatbot::class);

    }


    // ici , on utilise eloquent pour avoir le type mbti de student 
    public function getMBTI(): ?string
    {
        return $this->testPersonnalite?->type_mbti;
    }

    // ici c'est pour savoir si l'utilisateur a complété le test ou bien il l'a passé (pour des test apres)
    public function hasCompletedPersonalityTest(): bool
    {
        return $this->testPersonnalite !== null;
    }


    public function getRecommendedMetiers()
    {

        if (!$this->getMBTI()) {
            return collect([]);
        }

        return \App\Models\Metier::whereHas("correspondancesMbti", function ($query) {
            $query->where('type_mbti', $this->getMBTI())
                ->where('niveau_affinite', '>=', 7);
        })->get();


    }


}