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
        try {
            $validator = Validator::make($input, [
                'email' => ['required', 'string', 'email'],
                'password' => ['required', 'string'],
            ], [
                'email.required' => 'L\'email est obligatoire.',
                'email.email' => 'Veuillez entrer un email valide.',
                'password.required' => 'Le mot de passe est obligatoire.',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

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

            if (!$student || !Hash::check($input['password'], $student->password)) {
                // Keep security logs for failed login attempts
                Log::warning('Student authentication failed', [
                    'email' => $input['email'],
                    'ip' => request()->ip()
                ]);

                throw ValidationException::withMessages([
                    'email' => ['Ces identifiants ne correspondent à aucun de nos enregistrements.'],
                ]);
            }

            // Keep successful login logs for security monitoring
            Log::info('Student authenticated successfully', [
                'student_id' => $student->id,
                'email' => $student->email
            ]);

            return $student;

        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Student authentication error', [
                'error' => $e->getMessage(),
                'email' => $input['email'] ?? 'unknown'
            ]);
            throw $e;
        }
    }
}