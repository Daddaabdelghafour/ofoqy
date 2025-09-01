<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class StudentProfileController extends Controller
{
    /**
     * Affiche la page de profil de l'étudiant
     *
     * @return \Inertia\Response
     */
    public function show()
    {
        $student = Auth::guard('student')->user();

        return Inertia::render('Dashboard/ProfileDetails', [
            'student' => $student,
        ]);
    }

    /**
     * Met à jour le profil de l'étudiant et son mot de passe si fourni
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request)
    {
        $student = Auth::guard('student')->user();

        // Règles de validation de base pour les informations de profil
        $rules = [
            'nom_complet' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique('students')->ignore($student->id)
            ],
            'age' => ['required', 'integer', 'min:15', 'max:99'],
            'genre' => ['required', 'in:feminin,masculin'],
            'ville' => ['required', 'string', 'max:100'],
            'niveau_etude' => ['required', 'string', 'max:100'],
            'filiere' => ['required', 'string', 'max:100'],
            'langue_bac' => ['required', 'in:arabe,francais,anglais'],
            'moyenne_general_bac' => ['required', 'numeric', 'min:0', 'max:20'],
        ];


        if ($request->filled('current_password') || $request->filled('new_password') || $request->filled('password_confirmation')) {
            $rules['current_password'] = [
                'required',
                function ($attribute, $value, $fail) use ($student) {
                    if (!Hash::check($value, $student->password)) {
                        $fail('Le mot de passe actuel est incorrect.');
                    }
                }
            ];
            $rules['new_password'] = [
                'required',
                'string',
                'min:8',
                // Remplacer 'confirmed' par une validation personnalisée
                function ($attribute, $value, $fail) use ($request) {
                    if ($value !== $request->password_confirmation) {
                        $fail('La confirmation du nouveau mot de passe ne correspond pas.');
                    }
                }
            ];
            $rules['password_confirmation'] = ['required'];
        }

        $validated = $request->validate($rules);

        // Mettre à jour les informations du profil
        $student->nom_complet = $validated['nom_complet'];
        $student->email = $validated['email'];
        $student->age = $validated['age'];
        $student->genre = $validated['genre'];
        $student->ville = $validated['ville'];
        $student->niveau_etude = $validated['niveau_etude'];
        $student->filiere = $validated['filiere'];
        $student->langue_bac = $validated['langue_bac'];
        $student->moyenne_general_bac = $validated['moyenne_general_bac'];

        // Mettre à jour le mot de passe si fourni
        if ($request->filled('new_password')) {
            $student->password = Hash::make($validated['new_password']);
        }

        $student->save();

        return back()->with('success', 'Profil mis à jour avec succès.');
    }

    /**
     * Met à jour la photo de profil de l'étudiant
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateProfilePhoto(Request $request)
{
    $request->validate([
        'photo' => ['required', 'image', 'max:2048'], // 2MB max
    ]);

    $student = Auth::guard('student')->user();

    // Supprimer l'ancienne photo si elle existe
    if ($student->profile_photo_path && file_exists(public_path($student->profile_photo_path))) {
        unlink(public_path($student->profile_photo_path));
    }

    // Stocker la nouvelle photo dans public/images
    $file = $request->file('photo');
    $filename = time() . '_' . $file->getClientOriginalName();
    $file->move(public_path('/images'), $filename);

    $student->profile_photo_path = '/images/' . $filename;
    $student->save();

    return back()->with('success', 'Photo de profil mise à jour avec succès.');
}

}
