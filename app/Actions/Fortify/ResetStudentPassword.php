<?php

namespace App\Actions\Fortify;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ResetStudentPassword
{
    use PasswordValidationRules;

    /**
     * Validate and reset the student's forgotten password.
     */
    public function reset($student, array $input): void
    {
        // Validation
        Validator::make($input, [
            'password' => $this->passwordRules(),
        ], [
            'password.required' => 'Le mot de passe est requis.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
        ])->validate();

        // Mise à jour du mot de passe
        $student->forceFill([
            'password' => Hash::make($input['password']),
            'remember_token' => null,
        ])->save();

        // Log pour sécurité
        Log::info('Password reset successful', [
            'student_id' => $student->id,
            'email' => $student->email,
            'ip' => request()->ip(),
        ]);
    }
}