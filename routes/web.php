<?php

use App\Http\Controllers\FavorisUniversiteController;
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
use App\Http\Controllers\StudentProfileController;
use App\Http\Controllers\UniversitesController;
use App\Http\Controllers\FilieresMetiersController;
use App\Http\Controllers\FilieresMetiersComponentController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\AdminController;



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


    Route::post('/login', function (Request $request) {
        $input = $request->all();
        // le cas d'un admin
        if (\App\Models\Admin::where('email', $input['email'])->exists()) {
            $admin = app(\App\Actions\Fortify\AuthenticateAdmin::class)->authenticate($input);
            Auth::guard('admin')->login($admin);
            return redirect('/admin/dashboard');
        }
        // le cas d'un étudiant
        if (\App\Models\Student::where('email', $input['email'])->exists()) {
            $student = app(\App\Actions\Fortify\AuthenticateStudent::class)->authenticate($input);
            Auth::guard('student')->login($student);
            return redirect('/MBTI');
        }

        return back()->withErrors([
            'email' => 'Les identifiants fournis ne correspondent à aucun compte.',
        ]);
    });

});

// Logout
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
})->name('logout');


Route::get('/profile', [ProfileController::class, 'profile']);

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
Route::get('/dashboard/favorites', [UniversitesController::class, 'favoriteUniversites'])->middleware(["auth:student"])->name('dashboard.universities.favorites');
Route::get('/universites/{id}', [UniversitesController::class, 'show']);
Route::get('/universites-statistics', [UniversitesController::class, 'statistics']);
Route::post('/universites/by-bac-type', [UniversitesController::class, 'findByBacType']);

// University routes (To show all universities)
Route::middleware(["auth:student"])->get('/dashboard/universities', function () {
    $student = Auth::guard("student")->user();
    $universites = \App\Models\Universite::with('filieres')->get();

    // Récupérer toutes les filières liées aux universités affichées
    $filiereIds = [];
    foreach ($universites as $u) {
        foreach ($u->filieres as $f) {
            $filiereIds[] = $f->id;
        }
    }
    $filiereIds = array_unique($filiereIds);
    $filieres = \App\Models\Filiere::whereIn('id', $filiereIds)->get();

    return Inertia::render('Dashboard/Universities', [
        'student' => $student,
        'filieres' => $filieres,
    ]);
})->name('dashboard.universities');

// University routes (To show a single university)
Route::middleware(["auth:student"])->get("/dashboard/universities/{id}", function ($id) {
    $student = Auth::guard("student")->user();
    return Inertia::render("Dashboard/UniversityDetail", [
        'id' => $id,
        'student' => $student
    ]);
})->name('dashboard.universities.show');

Route::get('/universites-export', [UniversitesController::class, 'export'])->name('universites.export');

// Import universities from JSON
Route::post('/universites-import', [UniversitesController::class, 'import'])->name('universites.import');

// Import page route
Route::get('/import-universities', function () {
    return Inertia::render('ImportUniversities');
})->name('import.universities');

// Route de filieres et metiers
Route::get('/dashboard/filieres-metiers', [FilieresMetiersController::class, 'FilieresMetiers'])->name('filieres-metiers');

Route::get('/dashboard/filieres-metiers/{id}/{type}', [FilieresMetiersComponentController::class, 'Showcomponent'])->name('filieres-metiers.show');

// Search route
Route::post('/filter', [FilieresMetiersController::class, 'searchFilieresMetiers']);

// Route de profileDetails
Route::middleware(["auth:student"])->get("/profileDetails/{id}", function ($id) {
    return Inertia::render("Dashboard/ProfileDetails", [
        'id' => $id
    ]);
})->name('profileDetails');

Route::middleware(["auth:student"])->group(function () {
    Route::get('/profileDetails', [StudentProfileController::class, 'show'])->name('profile.show');
    Route::post('/profileDetails', [StudentProfileController::class, 'update'])->name('profile.update');
    Route::post('/profileDetails/photo', [StudentProfileController::class, 'updateProfilePhoto'])->name('profile.photo.update');
    Route::post('/logout', [ProfileController::class, 'logout'])->name('logout');
    Route::delete('/account', [ProfileController::class, 'deleteAccount'])->name('account.delete');
});

// Route pour la page d'aide
Route::middleware(["auth:student"])->get('/help', function () {
    return Inertia::render('Dashboard/Aide');
})->name('help');

Route::middleware(['auth:student'])->get('/dashboard/acceuil', [MBTIController::class, 'showDetails'])->name('PersonnaliteDetails');

// Route des  favoris des universités
Route::post('/favorite', [FavorisUniversiteController::class, 'store'])->middleware('auth:student');
Route::get('/favorite-list', [FavorisUniversiteController::class, 'list'])->name("universites.favorite.list");
Route::get("/favorite-ids", [FavorisUniversiteController::class, 'favoriteids'])->name("universites.favorite.ids");
Route::get('/is-favorite/{id}', [FavorisUniversiteController::class, 'isFavorite']);


Route::middleware(['auth:student'])->get('/dashboard/postulations', function () {
    $student = Auth::guard("student")->user();
    $universites = \App\Models\Universite::with('filieres')->get();
    return Inertia::render('Dashboard/Postulations', [
        'student' => $student,
        'universites' => $universites,
    ]);
})->name('dashboard.postulations');


//Route de chatbot
Route::get('/chatbot', [ChatbotController::class, 'Chatbot'])->middleware('auth:student');


Route::post('/chatbot/message', [ChatbotController::class, 'sendMessage']);

Route::post('/chatbot/session-messages', [ChatbotController::class, 'storeSessionMessages']);

Route::get('/chatbot/history', [ChatbotController::class, 'getHistory']);

Route::get('/chatbot/conversation/{title}', [ChatbotController::class, 'getConversation']);

Route::get('/chatbot/delete-conversation/{title}', [ChatbotController::class, 'deleteConversation']);


//admin routes

Route::get('/admin/dashboard',[AdminController::class, 'dashboard']);
Route::post('/admin/universite/add', [AdminController::class, 'addUniversite']);
Route::post('/admin/universite/delete', [AdminController::class, 'deleteUniversite']);
Route::post('/admin/universite/edit', [AdminController::class, 'editUniversite']);


//require __DIR__ . '/settings.php';
/*require __DIR__ . '/auth.php';*/
