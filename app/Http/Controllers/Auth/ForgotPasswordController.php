<?php


namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Inertia;
use Inertia\Response;

class ForgotPasswordController extends Controller
{
    /**
     * Afficher le formulaire de demande de reset
     */
    public function create(): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => session('status')
        ]);
    }

    /**
     * Envoyer le lien de réinitialisation
     */
    public function store(Request $request)
    {
        // 1. Validation de l'email
        $request->validate([
            'email' => 'required|email|exists:students,email'
        ], [
            'email.required' => 'L\'adresse email est requise.',
            'email.email' => 'Veuillez entrer une adresse email valide.',
            'email.exists' => 'Aucun compte n\'est associé à cette adresse email.',
        ]);

        // 2. Rate limiting pour éviter le spam
        $this->checkRateLimit($request);

        try {
            // 3. Envoyer le lien via le Password Broker de Laravel
            $status = Password::broker('students')->sendResetLink(
                $request->only('email')
            );

            // 4. Gérer la réponse
            if ($status === Password::RESET_LINK_SENT) {
                // Logger pour sécurité
                Log::info('Password reset link sent', [
                    'email' => $request->email,
                    'ip' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'timestamp' => now()
                ]);

                return back()->with('status', 'Un lien de réinitialisation a été envoyé à votre email !');
            }

            // 5. Gérer les différents types d'erreurs
            $this->handleError($status, $request);

        } catch (\Exception $e) {
            Log::error('Password reset link sending failed', [
                'email' => $request->email,
                'error' => $e->getMessage(),
                'ip' => $request->ip(),
            ]);

            throw ValidationException::withMessages([
                'email' => ['Une erreur est survenue. Veuillez réessayer plus tard.'],
            ]);
        }
    }

    /**
     * Vérifier le rate limiting
     */
    protected function checkRateLimit(Request $request): void
    {
        $key = 'password-reset:' . $request->ip();

        if (RateLimiter::tooManyAttempts($key, 3)) { // 3 tentatives max
            $seconds = RateLimiter::availableIn($key);

            throw ValidationException::withMessages([
                'email' => [
                    "Trop de tentatives de réinitialisation. Réessayez dans {$seconds} secondes."
                ],
            ]);
        }

        RateLimiter::hit($key, 300); // 5 minutes
    }

    /**
     * Gérer les différents types d'erreurs
     */
    protected function handleError(string $status, Request $request): void
    {
        $messages = [
            Password::INVALID_USER => 'Aucun compte n\'est associé à cette adresse email.',
            Password::RESET_THROTTLED => 'Veuillez attendre avant de demander un nouveau lien.',
        ];

        Log::warning('Password reset link failed', [
            'email' => $request->email,
            'status' => $status,
            'ip' => $request->ip(),
        ]);

        throw ValidationException::withMessages([
            'email' => [$messages[$status] ?? 'Impossible d\'envoyer le lien de réinitialisation.'],
        ]);
    }
}