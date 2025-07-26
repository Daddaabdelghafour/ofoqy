import { Head, useForm } from '@inertiajs/react';
import { CheckCircle, Eye, EyeOff, LoaderCircle, Shield, XCircle } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ResetPasswordProps {
    token: string;
    email: string;
}

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const cleanEmail = (email: string): string => {
        // Supprimer tout après '](' si présent
        const cleaned = email.split('](')[0];
        // Supprimer les espaces en début/fin
        return cleaned.trim();
    };

    const { data, setData, post, processing, errors, reset } = useForm<Required<ResetPasswordForm>>({
        token: token,
        email: cleanEmail(email), // 🎯 Email nettoyé
        password: '',
        password_confirmation: '',
    });

    // Password strength validation
    const getPasswordStrength = (password: string) => {
        const checks = {
            length: password.length >= 8,
        };

        const score = password.length >= 8 ? 5 : 0;
        return { checks, score };
    };

    const passwordStrength = getPasswordStrength(data.password);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <Head title="Nouveau mot de passe" />

            {/* Left side - Same design pattern as login */}
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
                    <h3 className="text-center text-xl font-semibold text-white md:text-2xl lg:text-3xl">Nouveau Mot de Passe</h3>
                    <p className="text-center text-sm font-normal leading-relaxed text-white md:text-base">
                        Choisissez un mot de passe fort pour sécuriser votre compte et protéger vos données.
                    </p>
                </div>

                {/* Features list - Password context */}
                <div className="mt-8 space-y-4 text-sm lg:text-base" data-aos="fade-up" data-aos-delay="1200">
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-yellow-300" />
                        <span className="text-white">Sécurité renforcée</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-yellow-300" />
                        <span className="text-white">Mot de passe fort recommandé</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Eye className="h-5 w-5 text-yellow-300" />
                        <span className="text-white">Visibilité contrôlée</span>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex flex-1 items-center justify-center p-4 md:p-6 lg:p-8" data-aos="fade-left" data-aos-duration="1000">
                <div className="w-full max-w-md md:max-w-lg lg:max-w-[80%]">
                    {/* Header */}
                    <div className="mb-8 text-center lg:text-left" data-aos="fade-up" data-aos-delay="200">
                        <h2 className="text-2xl font-bold text-gray-900 md:text-3xl lg:text-4xl">Nouveau mot de passe</h2>
                        <p className="mt-2 text-gray-600 md:text-lg">Créez un mot de passe fort pour sécuriser votre compte.</p>
                    </div>

                    {/* Form */}
                    <form className="space-y-6" onSubmit={submit} data-aos="fade-up" data-aos-delay="400">
                        {/* Email (readonly) */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 md:text-base">
                                Adresse email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="h-12 rounded-sm border-gray-300 bg-gray-50 text-gray-600 md:h-14 md:text-base lg:h-16"
                                readOnly
                            />
                            <InputError message={errors.email} />
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700 md:text-base">
                                Nouveau mot de passe
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="h-12 rounded-sm border-gray-500 pr-10 md:h-14 md:text-base lg:h-16"
                                    required
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                                </button>
                            </div>
                            <InputError message={errors.password} />
                        </div>

                        {/* Password Strength Indicator */}
                        {data.password && (
                            <div className="space-y-3 rounded-sm border border-gray-200 bg-gray-50 p-4" data-aos="fade-in">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700 md:text-base">Force du mot de passe</span>
                                    <span
                                        className={`text-xs font-medium md:text-sm ${
                                            passwordStrength.score >= 4
                                                ? 'text-green-600'
                                                : passwordStrength.score >= 3
                                                  ? 'text-yellow-600'
                                                  : 'text-red-600'
                                        }`}
                                    >
                                        {passwordStrength.score >= 4 ? 'Fort' : passwordStrength.score >= 3 ? 'Moyen' : 'Faible'}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                                    {Object.entries({
                                        '8+ caractères': passwordStrength.checks.length,
                                    }).map(([label, valid]) => (
                                        <div key={label} className="flex items-center space-x-2">
                                            {valid ? (
                                                <CheckCircle className="h-3 w-3 text-green-500 md:h-4 md:w-4" />
                                            ) : (
                                                <XCircle className="h-3 w-3 text-gray-300 md:h-4 md:w-4" />
                                            )}
                                            <span className={valid ? 'text-green-600' : 'text-gray-500'}>{label}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Confirm Password */}
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 md:text-base">
                                Confirmer le mot de passe
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="••••••••"
                                    className="h-12 rounded-sm border-gray-500 pr-10 md:h-14 md:text-base lg:h-16"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4 md:h-5 md:w-5" /> : <Eye className="h-4 w-4 md:h-5 md:w-5" />}
                                </button>
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        {/* Password Match Indicator */}
                        {data.password_confirmation && (
                            <div
                                className={`flex items-center space-x-2 text-sm md:text-base ${
                                    data.password === data.password_confirmation ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                                {data.password === data.password_confirmation ? (
                                    <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                                ) : (
                                    <XCircle className="h-4 w-4 md:h-5 md:w-5" />
                                )}
                                <span>
                                    {data.password === data.password_confirmation
                                        ? 'Les mots de passe correspondent'
                                        : 'Les mots de passe ne correspondent pas'}
                                </span>
                            </div>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            disabled={processing || passwordStrength.score < 3 || data.password !== data.password_confirmation}
                            className="h-12 w-full rounded-sm bg-green-600 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-green-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 md:h-14 md:text-base lg:h-16 lg:text-lg"
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin md:h-5 md:w-5" />
                                    <span>Mise à jour...</span>
                                </>
                            ) : (
                                <>
                                    <Shield className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                                    <span>Mettre à jour le mot de passe</span>
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Security tip */}
                    <div className="mt-8 rounded-sm border border-green-200 bg-green-50 p-4" data-aos="fade-up" data-aos-delay="600">
                        <div className="flex items-start space-x-3">
                            <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                            <div className="text-sm text-green-800">
                                <p className="mb-2 font-medium">Conseils de sécurité :</p>
                                <ul className="space-y-1 text-xs md:text-sm">
                                    <li>• Utilisez une combinaison unique pour ce compte</li>
                                    <li>• Évitez les informations personnelles évidentes</li>
                                    <li>• Considérez l'utilisation d'un gestionnaire de mots de passe</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
