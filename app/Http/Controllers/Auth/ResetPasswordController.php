<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Actions\Fortify\ResetStudentPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ResetPasswordController extends Controller
{
    /**
     * Afficher le formulaire de réinitialisation du mot de passe
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * Traiter la réinitialisation du mot de passe
     */
    public function store(Request $request, ResetStudentPassword $resetAction)
    {
        // Validation
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ], [
            'token.required' => 'Le token de réinitialisation est requis.',
            'email.required' => 'L\'adresse email est requise.',
            'email.email' => 'Veuillez entrer une adresse email valide.',
            'password.required' => 'Le mot de passe est requis.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'password.min' => 'Le mot de passe doit contenir au moins 8 caractères.',
        ]);

        // Utiliser le Password Broker pour traiter le reset
        $status = Password::broker('students')->reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) use ($resetAction) {
                // 🎯 Appel de votre action personnalisée
                $resetAction->reset($user, [
                    'password' => $password,
                    'password_confirmation' => $password,
                ]);

                // Révoquer les tokens "remember me" existants
                $user->setRememberToken(Str::random(60));

                // Déclencher l'événement de reset
                event(new PasswordReset($user));
            }
        );

        // Gérer la réponse
        if ($status === Password::PASSWORD_RESET) {
            return redirect()->route('login')->with('status', 'Votre mot de passe a été mis à jour avec succès !');
        }

        // Gérer les erreurs
        $this->handleResetError($status);
    }

    /**
     * Gérer les erreurs de réinitialisation
     */
    protected function handleResetError(string $status): void
    {
        $messages = [
            Password::INVALID_TOKEN => 'Ce lien de réinitialisation n\'est pas valide ou a expiré.',
            Password::INVALID_USER => 'Aucun compte n\'est associé à cette adresse email.',
            Password::RESET_THROTTLED => 'Veuillez attendre avant de faire une nouvelle tentative.',
        ];

        throw ValidationException::withMessages([
            'email' => [$messages[$status] ?? 'Impossible de réinitialiser le mot de passe.'],
        ]);
    }
}