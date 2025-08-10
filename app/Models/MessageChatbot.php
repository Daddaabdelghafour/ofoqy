<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageChatbot extends Model
{
    protected $fillable = [
        'student_id',
        'role',
        'message',
        'contexte_json',

    ];

    protected $casts = [
        'contexte_json' => 'array',
    ];




    // Relations 

    public function student()
    {
        return $this->belongsTo(Student::class);
    }


    // Scopes 

    public function scopeUserMessages($query)
    {
        return $query->where('role', 'user');
    }

    public function scopeAssistantMessages($query)
    {
        return $query->where('role', 'assistant');
    }


    public function scopeToday($query, $studentId)
    {
        return $query->where('created_at', today())
            ->where('student_id', $studentId);
    }

    public function scopeYesterday($query, $studentId)
    {
        return $query->where('created_at', today()->subDay())
            ->where('student_id', $studentId);
        ;
    }


    public function scopeLast7Days($query, $studentId)
    {
        return $query->where('created_at', '>=', today()->subDays(7))
            ->where('student_id', $studentId);
        ;
    }


    public function scopeLastMessage($query, $studentId)
    {
        return $query->where("student_id", $studentId)->latest()->limit(1);
    }

    // helpers 

    public function isFromUser()
    {
        return $this->role === 'user';
    }

    public function isFromAssistant()
    {
        return $this->role === 'assistant';
    }


    public function getMessageType()
    {
        return $this->isFromUser() ? 'Question' : 'Réponse';
    }

    public function getFormattedTime()
    {
        return $this->created_at->format('H:i');
    }


    public function getContext()
    {
        return $this->contexte_json ?? [];
    }


    public static function countToday($studentId)
    {
        return self::today($studentId)->count();
    }

    public static function countYesterday($studentId)
    {
        return self::yesterday($studentId)->count();
    }

    public static function countLast7Days($studentId)
    {
        return self::last7Days($studentId)->count();
    }



    public function addContext(array $context): void
    {
        $currentContext = $this->getContext();
        $this->update([
            'contexte_json' => array_merge($currentContext, $context)
        ]);
    }












}
