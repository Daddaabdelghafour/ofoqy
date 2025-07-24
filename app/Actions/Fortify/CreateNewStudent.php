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
        Log::info('🚀 CreateNewStudent: Action initiated', [
            'input_keys' => array_keys($input),
            'data_preview' => [
                'nom_complet' => $input['nom_complet'] ?? 'missing',
                'email' => $input['email'] ?? 'missing',
                'age' => $input['age'] ?? 'missing',
                'ville' => $input['ville'] ?? 'missing',
                'genre' => $input['genre'] ?? 'missing',
                'niveau_etude' => $input['niveau_etude'] ?? 'missing',
                'filiere' => $input['filiere'] ?? 'missing',
                'langue_bac' => $input['langue_bac'] ?? 'missing',
                'moyenne_general_bac' => $input['moyenne_general_bac'] ?? 'missing',
                'has_password' => isset($input['password']) ? 'yes' : 'no',
                'has_password_confirmation' => isset($input['password_confirmation']) ? 'yes' : 'no',
            ]
        ]);

        try {
            Log::info('📋 CreateNewStudent: Starting validation');

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
                Log::warning('❌ CreateNewStudent: Validation failed', [
                    'errors' => $validator->errors()->toArray(),
                    'failed_rules' => $validator->failed()
                ]);
            }

            $validator->validate();
            Log::info('✅ CreateNewStudent: Validation passed successfully');

            Log::info('🔨 CreateNewStudent: Preparing student data');
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

            Log::info('💾 CreateNewStudent: Attempting to create student in database', [
                'table' => 'students',
                'email' => $studentData['email'],
                'data_keys' => array_keys($studentData)
            ]);

            $student = Student::create($studentData);

            Log::info('🎉 CreateNewStudent: Student created successfully', [
                'student_id' => $student->id,
                'email' => $student->email,
                'nom_complet' => $student->nom_complet,
                'created_at' => $student->created_at,
                'table_used' => $student->getTable()
            ]);

            Log::info('✨ CreateNewStudent: Action completed successfully');
            return $student;

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('🚫 CreateNewStudent: Validation exception thrown', [
                'errors' => $e->errors(),
                'message' => $e->getMessage(),
                'validator_errors' => $e->validator->errors()->toArray()
            ]);
            throw $e;
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('🗃️ CreateNewStudent: Database query failed', [
                'error' => $e->getMessage(),
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'error_code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            throw $e;
        } catch (\Exception $e) {
            Log::error('💥 CreateNewStudent: Unexpected error occurred', [
                'error' => $e->getMessage(),
                'exception_class' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}