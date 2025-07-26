<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Actions\Fortify\CreateNewStudent;
use App\Actions\Fortify\AuthenticateStudent;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;

Route::get('/', function () {
    return Inertia::render('Landing/Index');
});

// Registration routes - NO middleware (anyone can access anytime)
Route::get('/register', function () {
    return Inertia::render('auth/register');
})->name('register');

Route::post('/register', function (Request $request, CreateNewStudent $action) {
    $student = $action->create($request->all());
    return redirect('/login');
});

// Login routes - WITH guest middleware (only unauthenticated users)

Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('auth/login');
    })->name('login');


    Route::post('/login', function (Request $request, AuthenticateStudent $action) {
        $student = $action->authenticate($request->all());
        Auth::login($student);
        return redirect('/dashboard');
    });

});

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout');

// Fix duplicate dashboard - keep only protected one
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('dashboard'); // Capital D for consistency
    })->name('dashboard');
});

// 🔐 Routes de réinitialisation de mot de passe
Route::middleware('guest')->group(function () {

    // Page "Mot de passe oublié"
    Route::get('/forgot-password', [ForgotPasswordController::class, 'create'])
        ->name('password.request');

    // Traiter l'envoi du lien de réinitialisation
    Route::post('/forgot-password', [ForgotPasswordController::class, 'store'])
        ->name('password.email');

    // Page de réinitialisation avec token
    Route::get('/reset-password/{token}', [ResetPasswordController::class, 'create'])
        ->name('password.reset');

    // Traiter la réinitialisation du mot de passe
    Route::post('/reset-password', [ResetPasswordController::class, 'store'])
        ->name('password.store');
});

require __DIR__ . '/settings.php';
#require __DIR__ . '/auth.php';
