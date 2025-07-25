<?php

namespace App\Actions\Fortify;

use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class AuthenticateStudent
{
    /**
     * Validate and authenticate a student.
     */
    public function authenticate(array $input): Student
    {
        Log::info('🔐 AuthenticateStudent: Action initiated', [
            'input_keys' => array_keys($input),
            'email' => $input['email'] ?? 'missing',
            'has_password' => isset($input['password']) ? 'yes' : 'no',
            'remember' => $input['remember'] ?? false,
        ]);

        try {
            Log::info('📋 AuthenticateStudent: Starting validation');

            $validator = Validator::make($input, [
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ], [
                'email.required' => 'L\'email est obligatoire.',
                'email.email' => 'Veuillez entrer un email valide.',
                'password.required' => 'Le mot de passe est obligatoire.',
            ]);

            if ($validator->fails()) {
                Log::warning('❌ AuthenticateStudent: Validation failed', [
                    'errors' => $validator->errors()->toArray(),
                ]);
                throw new ValidationException($validator);
            }

            Log::info('✅ AuthenticateStudent: Validation passed');

            Log::info('🔍 AuthenticateStudent: Looking for student by email', [
                'email' => $input['email']
            ]);

            $student = Student::where('email', $input['email'])->first();

            if (!$student) {
                Log::warning('👤 AuthenticateStudent: Student not found', [
                    'email' => $input['email']
                ]);

                throw ValidationException::withMessages([
                    'email' => ['Ces identifiants ne correspondent à aucun de nos enregistrements.'],
                ]);
            }

            Log::info('✅ AuthenticateStudent: Student found', [
                'student_id' => $student->id,
                'nom_complet' => $student->nom_complet,
            ]);

            Log::info('🔒 AuthenticateStudent: Verifying password');

            if (!Hash::check($input['password'], $student->password)) {
                Log::warning('🚫 AuthenticateStudent: Password verification failed', [
                    'student_id' => $student->id,
                    'email' => $student->email,
                ]);

                throw ValidationException::withMessages([
                    'email' => ['Ces identifiants ne correspondent à aucun de nos enregistrements.'],
                ]);
            }

            Log::info('🎉 AuthenticateStudent: Authentication successful', [
                'student_id' => $student->id,
                'email' => $student->email,
                'nom_complet' => $student->nom_complet,
            ]);

            Log::info('✨ AuthenticateStudent: Action completed successfully');
            return $student;

        } catch (ValidationException $e) {
            Log::error('🚫 AuthenticateStudent: Validation exception thrown', [
                'errors' => $e->errors(),
                'message' => $e->getMessage(),
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('💥 AuthenticateStudent: Unexpected error occurred', [
                'error' => $e->getMessage(),
                'exception_class' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            throw $e;
        }
    }
}