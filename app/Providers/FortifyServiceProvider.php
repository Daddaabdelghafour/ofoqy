<?php
namespace App\Providers;

use App\Actions\Fortify\CreateNewStudent;
use Inertia\Inertia;

use App\Actions\Fortify\ResetStudentPassword;
use App\Actions\Fortify\UpdateStudentPassword;
use App\Actions\Fortify\UpdateStudentProfileInformation;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Fortify;
use Illuminate\Support\Facades\Log;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Log::info('🚀 FortifyServiceProvider booting...');

        Fortify::createUsersUsing(CreateNewStudent::class);
        Log::info('✅ Fortify createUsersUsing set to CreateNewStudent');

        Fortify::updateUserProfileInformationUsing(UpdateStudentProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateStudentPassword::class);
        Fortify::resetUserPasswordsUsing(ResetStudentPassword::class);
        Fortify::redirectUserForTwoFactorAuthenticationUsing(RedirectIfTwoFactorAuthenticatable::class);

        Fortify::loginView(function () {
            Log::info('📄 Fortify serving login view');
            return Inertia::render('Auth/Login');
        });

        Fortify::registerView(function () {
            Log::info('📄 Fortify serving register view');
            return Inertia::render('Auth/Register');
        });

        Fortify::requestPasswordResetLinkView(function () {
            return Inertia::render('Auth/ForgotPassword');
        });

        Fortify::resetPasswordView(function ($request) {
            return Inertia::render('Auth/ResetPassword', ['request' => $request]);
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())) . '|' . $request->ip());
            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        Log::info('✅ FortifyServiceProvider boot completed');
    }
}
