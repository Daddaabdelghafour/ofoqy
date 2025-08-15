<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Actions\Fortify\CreateNewStudent;
use App\Actions\Fortify\AuthenticateStudent;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Auth\ForgotPasswordController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\MBTIController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Auth\EmailCheckController;
use App\Http\Controllers\UniversitesController;


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

// Email check route for registration validation
Route::post('/check-email', [EmailCheckController::class, 'checkEmail']);

// Login routes - WITH guest middleware (only unauthenticated users)
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('auth/login');
    })->name('login');


    Route::post('/login', function (Request $request, AuthenticateStudent $action) {
        $student = $action->authenticate($request->all());
        
        Log::info('LOGIN - Before Auth::guard(student)->login()', [
            'student_id' => $student->id,
            'email' => $student->email
        ]);
        
        Auth::guard('student')->login($student);
        
        return redirect('/MBTI');
    });

});

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout');


Route::get('/profile',  [ProfileController::class, 'profile']);

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

// MBTI routes
Route::get('/MBTI', function () {
    return Inertia::render('MBTI/Acceuil');
})->name('/MBTI');

Route::get('/questions', function () {
    return Inertia::render('MBTI/Questions');
})->name('/questions');

// MBTI API endpoint - moved from api.php to maintain session
Route::post('/mbti-result', [MBTIController::class, 'store']);
// University routes (Rest API for data)
Route::get('/universites', [UniversitesController::class, 'index']);
Route::get('/universites/{id}', [UniversitesController::class, 'show']);
Route::get('/universites-statistics', [UniversitesController::class, 'statistics']);
Route::post('/universites/by-bac-type', [UniversitesController::class, 'findByBacType']);

// University routes (To show all universities)
Route::get('/dashboard/universities', function () {
    return Inertia::render('Dashboard/Universities');
})->name('dashboard.universities');

// University routes (To show a single university)
Route::get("/dashboard/universities/{id}", function ($id) {
    return Inertia::render("Dashboard/UniversityDetail", [
        'id' => $id
    ]);
})->name('dashboard.universities.show');

Route::get('/universites-export', [UniversitesController::class, 'export'])->name('universites.export');
// Import universities from JSON
Route::post('/universites-import', [UniversitesController::class, 'import'])->name('universites.import');

// Import page route
Route::get('/import-universities', function () {
    return Inertia::render('ImportUniversities');
})->name('import.universities');


require __DIR__ . '/settings.php';
#require __DIR__ . '/auth.php';
