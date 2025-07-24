<?php

namespace App\Actions\Fortify;


use Illuminate\Validation\Rules\Password;

trait PasswordValidationRules
{
    /**
     * Get the validation rules used to validate passwords.
     */
    protected function passwordRules(): array
    {
        return ['required', 'string', new Password(8), 'confirmed'];
    }
}