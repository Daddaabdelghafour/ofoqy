<?php

namespace App\Actions\Fortify;

use App\Models\Student;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewStudent implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered student.
     */
    public function create(array $input): Student
    {
        try {
            $validator = Validator::make($input, [
                'nom_complet' => ['required', 'string', 'max:255'],
                'ville' => ['required', 'string', 'max:255'],
                'age' => ['required', 'integer', 'min:16', 'max:100'],
                'genre' => ['required', Rule::in(['masculin', 'feminin', 'autre'])],
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique(Student::class),
                ],
                'password' => $this->passwordRules(),
                'niveau_etude' => [
                    'required',
                    Rule::in([
                        'baccalaureat',
                    ])
                ],
                'filiere' => ['required', 'string', 'max:255'],
                'langue_bac' => ['required', Rule::in(['francais', 'arabe', 'anglais'])],
                'moyenne_general_bac' => ['required', 'numeric', 'min:0', 'max:20'],
            ], [
                'nom_complet.required' => 'Le nom complet est obligatoire.',
                'ville.required' => 'La ville est obligatoire.',
                'age.required' => 'L\'âge est obligatoire.',
                'age.min' => 'L\'âge minimum est de 16 ans.',
                'genre.required' => 'Le genre est obligatoire.',
                'email.required' => 'L\'email est obligatoire.',
                'email.unique' => 'Cet email est déjà utilisé.',
                'password.required' => 'Le mot de passe est obligatoire.',
                'niveau_etude.required' => 'Le niveau d\'études est obligatoire.',
                'filiere.required' => 'La filière est obligatoire.',
                'langue_bac.required' => 'La langue du bac est obligatoire.',
                'moyenne_general_bac.required' => 'La moyenne générale du bac est obligatoire.',
                'moyenne_general_bac.max' => 'La moyenne ne peut pas dépasser 20.',
            ]);

            if ($validator->fails()) {
                Log::warning('Student registration validation failed', [
                    'errors' => $validator->errors()->toArray()
                ]);
            }

            $validator->validate();

            $studentData = [
                'nom_complet' => $input['nom_complet'],
                'ville' => $input['ville'],
                'age' => $input['age'],
                'genre' => $input['genre'],
                'email' => $input['email'],
                'password' => Hash::make($input['password']),
                'niveau_etude' => $input['niveau_etude'],
                'filiere' => $input['filiere'],
                'langue_bac' => $input['langue_bac'],
                'moyenne_general_bac' => $input['moyenne_general_bac'],
            ];

            $student = Student::create($studentData);

            // Keep this log - useful for monitoring new registrations
            Log::info('Student registered successfully', [
                'student_id' => $student->id,
                'email' => $student->email
            ]);

            return $student;

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::warning('Student registration validation failed', [
                'errors' => $e->errors()
            ]);
            throw $e;
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Student registration database error', [
                'error' => $e->getMessage(),
                'email' => $input['email'] ?? 'unknown'
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('Student registration unexpected error', [
                'error' => $e->getMessage(),
                'email' => $input['email'] ?? 'unknown'
            ]);
            throw $e;
        }
    }
}