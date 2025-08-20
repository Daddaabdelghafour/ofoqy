<?php

namespace App\Providers;

use Dotenv\Validator as DotenvValidator;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator as FacadesValidator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->register(\App\Providers\FortifyServiceProvider::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        FacadesValidator::extend('current_password', function ($attribute, $value, $parameters, $validator) {
            $guard = $parameters[0] ?? null;
            $user = auth($guard)->user();

            return Hash::check($value, $user->password);
        });
    }
}
