<?php

namespace App\Actions\Fortify;

use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\ResetsUserPasswords;

class ResetStudentPassword implements ResetsUserPasswords
{
    use PasswordValidationRules;

    /**
     * Validate and reset the student's forgotten password.
     */
    public function reset($student, array $input): void
    {
        Validator::make($input, [
            'password' => $this->passwordRules(),
        ])->validate();

        $student->forceFill([
            'password' => Hash::make($input['password']),
        ])->save();
    }
}