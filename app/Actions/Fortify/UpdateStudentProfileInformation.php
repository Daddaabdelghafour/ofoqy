<?php

namespace App\Actions\Fortify;

use App\Models\Student;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateStudentProfileInformation implements UpdatesUserProfileInformation
{
    /**
     * Validate and update the given student's profile information.
     */
    public function update($student, array $input): void
    {
        Validator::make($input, [
            'nom_complet' => ['required', 'string', 'max:255'],
            'ville' => ['required', 'string', 'max:255'],
            'age' => ['required', 'integer', 'min:16', 'max:100'],
            'genre' => ['required', Rule::in(['masculin', 'feminin', 'autre'])],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('students')->ignore($student->id),
            ],
            'niveau_etude' => [
                'required',
                Rule::in([
                    'baccalaureat',
                ])
            ],
            'filiere' => ['required', 'string', 'max:255'],
            'langue_bac' => ['required', Rule::in(['francais', 'arabe', 'anglais'])],
            'moyenne_general_bac' => ['required', 'numeric', 'min:0', 'max:20'],
        ])->validateWithBag('updateProfileInformation');

        if (
            $input['email'] !== $student->email &&
            $student instanceof MustVerifyEmail
        ) {
            $this->updateVerifiedUser($student, $input);
        } else {
            $student->forceFill([
                'nom_complet' => $input['nom_complet'],
                'ville' => $input['ville'],
                'age' => $input['age'],
                'genre' => $input['genre'],
                'email' => $input['email'],
                'niveau_etude' => $input['niveau_etude'],
                'filiere' => $input['filiere'],
                'langue_bac' => $input['langue_bac'],
                'moyenne_general_bac' => $input['moyenne_general_bac'],
            ])->save();
        }
    }

    /**
     * Update the given verified student's profile information.
     */
    protected function updateVerifiedUser($student, array $input): void
    {
        $student->forceFill([
            'nom_complet' => $input['nom_complet'],
            'ville' => $input['ville'],
            'age' => $input['age'],
            'genre' => $input['genre'],
            'email' => $input['email'],
            'email_verified_at' => null,
            'niveau_etude' => $input['niveau_etude'],
            'filiere' => $input['filiere'],
            'langue_bac' => $input['langue_bac'],
            'moyenne_general_bac' => $input['moyenne_general_bac'],
        ])->save();

        $student->sendEmailVerificationNotification();
    }
}