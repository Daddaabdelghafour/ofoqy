import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <Head title="Log in" />

            {/* Right Side - Hidden on mobile, full width on tablet, half on desktop */}
            <div
                className="relative hidden flex-col items-center justify-center bg-[#1D7A85] p-4 md:flex md:flex-1 md:p-6 lg:p-8"
                data-aos="fade-left"
                data-aos-duration="1000"
            >
                {/* SpaceMan logo - Responsive positioning */}
                <div className="absolute left-4 top-4 z-40 md:left-8 md:top-8 lg:left-[50px] lg:top-[50px]" data-aos="fade-down" data-aos-delay="200">
                    <img src="/images/login-logo.png" alt="" className="h-8 w-auto md:h-10 lg:h-auto" />
                </div>

                {/* SpaceMan container - Responsive sizing */}
                <div
                    className="relative flex h-[300px] w-[300px] flex-row items-center justify-center md:h-[400px] md:w-[400px] lg:h-[500px] lg:w-[500px]"
                    data-aos="zoom-in"
                    data-aos-delay="400"
                >
                    <div>
                        <div
                            className="absolute left-[22%] top-[10%] z-10 h-[200px] w-[200px] rounded-full bg-[#114A51] md:h-[250px] md:w-[250px] lg:h-[300px] lg:w-[300px]"
                            data-aos="fade-in"
                            data-aos-delay="600"
                        ></div>
                        <img src="/images/SpaceMan.png" alt="" className="relative z-20 h-auto w-full" data-aos="bounce-in" data-aos-delay="800" />
                    </div>
                </div>

                {/* Text content - Responsive sizing */}
                <div
                    className="flex w-full max-w-[400px] flex-col gap-2 px-4 md:max-w-[500px] lg:max-w-[600px]"
                    data-aos="fade-up"
                    data-aos-delay="1000"
                >
                    <h3 className="text-center text-xl font-semibold text-white md:text-2xl lg:text-3xl">Heureux de te revoir !</h3>
                    <p className="text-center text-sm font-normal leading-relaxed text-white md:text-base">
                        Heureux de te revoir ! Connecte-toi pour continuer ton exploration et découvrir les parcours qui te ressemblent.
                    </p>
                </div>
            </div>

            {/* Left Side - Full width on mobile, half on desktop */}
            <div className="flex flex-1 items-center justify-center p-4 md:p-6 lg:p-8" data-aos="fade-right" data-aos-duration="1000">
                <div className="w-full max-w-md md:max-w-lg lg:max-w-[60%]">
                    {/* Header - Responsive text sizes */}
                    <div className="mb-8 text-center md:mb-10 md:text-left lg:mb-[50px]" data-aos="fade-down" data-aos-delay="200">
                        <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">Se Connecter</h2>
                        <p className="mt-2 text-center text-sm text-gray-600 md:text-left md:text-base">
                            Connectez-vous pour accéder à votre compte <span className="text-primary-1000">OFOQY</span>
                        </p>
                    </div>

                    <form className="flex flex-col gap-4 md:gap-6" onSubmit={submit}>
                        <div className="grid gap-4 md:gap-6">
                            {/* Email Field */}
                            <div className="grid gap-2" data-aos="fade-up" data-aos-delay="400">
                                <Label htmlFor="email" className="text-sm md:text-lg">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Ajouter votre adresse email"
                                    className="rounded-sm border border-gray-500 p-3 text-sm md:p-4 md:text-base lg:p-6"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password Field */}
                            <div className="grid gap-2" data-aos="fade-up" data-aos-delay="500">
                                <div className="flex items-center">
                                    <Label htmlFor="password" className="text-sm md:text-lg">
                                        Mot De Passe
                                    </Label>
                                    {canResetPassword && (
                                        <TextLink href={route('password.request')} className="ml-auto text-xs md:text-sm" tabIndex={5}>
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Ajouter votre mot de passe"
                                    className="rounded-sm border border-gray-500 p-3 text-sm md:p-4 md:text-base lg:p-6"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Remember me and Sign up - Responsive layout */}
                            <div
                                className="flex flex-col items-start justify-between space-y-3 sm:flex-row sm:items-center sm:space-x-5 sm:space-y-0"
                                data-aos="fade-up"
                                data-aos-delay="600"
                            >
                                <div className="flex items-center">
                                    <Checkbox
                                        id="remember"
                                        name="remember"
                                        checked={data.remember}
                                        onClick={() => setData('remember', !data.remember)}
                                        tabIndex={3}
                                        className="mr-2 rounded-sm border border-gray-500"
                                    />
                                    <Label htmlFor="remember" className="text-sm md:text-base">
                                        Se souvenir de moi
                                    </Label>
                                </div>

                                <div className="text-muted-foreground text-xs md:text-sm">
                                    <TextLink className="text-primary-1000" href={route('password.request')} tabIndex={5}>
                                        Mot de passe oublié?
                                    </TextLink>
                                </div>
                            </div>

                            {/* Login Button */}
                            <div className="w-full" data-aos="fade-up" data-aos-delay="700">
                                <button
                                    type="submit"
                                    className="btn btn-primary border-primay-600 flex w-full items-center justify-center gap-2 rounded-sm border border-primary-600 bg-[#1D7A85] px-4 py-3 text-white transition-all duration-200 hover:scale-105 hover:border-primary-700 hover:bg-white hover:text-primary-700 active:scale-95 md:px-6 md:py-4 lg:px-4 lg:py-2.5"
                                    tabIndex={4}
                                    disabled={processing}
                                >
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    <span className="text-sm font-medium md:text-base lg:text-lg">
                                        {processing ? 'Connecting...' : 'Se Connecter'}
                                    </span>
                                </button>

                                <div className="mb-10 mt-4 flex w-full items-center md:my-6" data-aos="fade-up" data-aos-delay="800">
                                    <div className="flex-1 border-t border-gray-300"></div>
                                    <span className="px-3 text-xs text-gray-500 md:px-4 md:text-sm">Ou</span>
                                    <div className="flex-1 border-t border-gray-300"></div>
                                </div>

                                <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4" data-aos="fade-up" data-aos-delay="900">
                                    {/* Google Login Button */}
                                    <button
                                        type="button"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-b-4 border-primary-1000 bg-white px-3 py-3 text-gray-700 transition-all duration-200 hover:scale-105 hover:border-gray-400 hover:bg-gray-50 active:scale-95 md:px-4 md:py-3"
                                        onClick={() => {
                                            window.location.href = route('auth.google');
                                        }}
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <path
                                                fill="#4285F4"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="#EA4335"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-primary-1000 md:text-base"> Avec Google</span>
                                    </button>

                                    {/* Instagram Login Button */}
                                    <button
                                        type="button"
                                        className="flex flex-1 items-center justify-center gap-2 rounded-sm border border-b-4 border-gray-300 border-primary-1000 bg-white px-3 py-3 text-gray-700 transition-all duration-200 hover:scale-105 hover:border-gray-400 hover:bg-gray-50 active:scale-95 md:px-4 md:py-3"
                                        onClick={() => {
                                            window.location.href = route('auth.instagram');
                                        }}
                                    >
                                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                                            <defs>
                                                <radialGradient id="ig-gradient" cx="0.5" cy="1" r="1">
                                                    <stop offset="0%" stopColor="#f09433" />
                                                    <stop offset="25%" stopColor="#e6683c" />
                                                    <stop offset="50%" stopColor="#dc2743" />
                                                    <stop offset="75%" stopColor="#cc2366" />
                                                    <stop offset="100%" stopColor="#bc1888" />
                                                </radialGradient>
                                            </defs>
                                            <path
                                                fill="url(#ig-gradient)"
                                                d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"
                                            />
                                        </svg>
                                        <span className="text-sm font-medium text-primary-1000 md:text-base">Avec Instagram</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Bottom text and button */}
                        <div className="text-muted-foreground mt-4 text-center text-xs md:text-sm" data-aos="fade-up" data-aos-delay="1000">
                            Vous n'avez pas encore de compte ?
                        </div>
                        <TextLink
                            href={route('register')}
                            className="btn btn-outline flex w-full items-center justify-center gap-2 rounded-sm border border-primary-600 bg-white px-4 py-3 text-primary-600 transition-all duration-200 hover:scale-105 hover:bg-primary-600 hover:text-white active:scale-95 md:px-6 md:py-4 lg:px-4 lg:py-2.5"
                            data-aos="fade-up"
                            data-aos-delay="1100"
                        >
                            <span className="text-sm font-medium md:text-base lg:text-lg">S'identifier</span>
                        </TextLink>
                    </form>

                    {status && (
                        <div className="mb-4 mt-4 text-center text-xs font-medium text-green-600 md:text-sm" data-aos="fade-in">
                            {status}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
