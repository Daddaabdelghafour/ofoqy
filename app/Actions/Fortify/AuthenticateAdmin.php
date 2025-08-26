<?php


namespace App\Actions\Fortify;

use App\Models\Admin;
use Dotenv\Exception\ValidationException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException as ValidationValidationException;

class AuthenticateAdmin
{

    public function authenticate(array $input): Admin
    {

        $validator = Validator::make($input, [
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'string', 'min:8']
        ]);

        if ($validator->fails()) {
            throw new ValidationValidationException($validator);
        }

        $admin = Admin::where('email', $input['email'])->first();

        if (!$admin || !Hash::check($input['password'], $admin->password)) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'email' => ['Ces identifiants ne correspondent à aucun de nos enregistrements.'],
            ]);
        }

        return $admin;
    }

}