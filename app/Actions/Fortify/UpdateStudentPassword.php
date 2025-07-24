<?php

namespace App\Actions\Fortify;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\UpdatesUserPasswords;

class UpdateStudentPassword implements UpdatesUserPasswords
{
    use PasswordValidationRules;

    /**
     * Validate and update the student's password.
     */
    public function update($student, array $input): void
    {
        Validator::make($input, [
            'current_password' => ['required', 'string', 'current_password:student'],
            'password' => $this->passwordRules(),
        ], [
            'current_password.current_password' => 'Le mot de passe actuel est incorrect.',
        ])->validateWithBag('updatePassword');

        $student->forceFill([
            'password' => Hash::make($input['password']),
        ])->save();
    }
}