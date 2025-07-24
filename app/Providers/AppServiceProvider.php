<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        Log::info('🔥 AppServiceProvider register() called');
        $this->app->register(\App\Providers\FortifyServiceProvider::class);
        Log::info('🎯 FortifyServiceProvider registered');
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Log::info('🔥 AppServiceProvider boot() called');
    }
}
