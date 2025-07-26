import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, CheckCircle, LoaderCircle, Mail, Shield } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ForgotPasswordProps {
    status?: string;
}

export default function ForgotPassword({ status }: ForgotPasswordProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'), {
            onSuccess: () => reset('email'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col lg:flex-row">
            <Head title="Mot de passe oublié" />

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
                    <h3 className="text-center text-xl font-semibold text-white md:text-2xl lg:text-3xl">Récupération Sécurisée</h3>
                    <p className="text-center text-sm font-normal leading-relaxed text-white md:text-base">
                        Pas de souci ! Nous allons vous aider à récupérer l'accès à votre compte en toute sécurité.
                    </p>
                </div>

                {/* Features list - Added for forgot password context */}
                <div className="mt-8 space-y-4 text-sm lg:text-base" data-aos="fade-up" data-aos-delay="1200">
                    <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-yellow-300" />
                        <span className="text-white">Processus sécurisé et rapide</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-yellow-300" />
                        <span className="text-white">Lien envoyé par email</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-yellow-300" />
                        <span className="text-white">Accès restauré en quelques minutes</span>
                    </div>
                </div>
            </div>

            {/* Right side - Form */}
            <div className="flex flex-1 items-center justify-center p-4 md:p-6 lg:p-8" data-aos="fade-right" data-aos-duration="1000">
                <div className="w-full max-w-md md:max-w-lg lg:max-w-[60%]">
                    {/* Back button */}
                    <div className="mb-6" data-aos="fade-up" data-aos-delay="100">
                        <Link href={route('login')}>
                            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Retour à la connexion
                            </Button>
                        </Link>
                    </div>

                    {/* Header */}
                    <div className="mb-8 text-center md:text-left lg:mb-[50px]" data-aos="fade-up" data-aos-delay="200">
                        <h2 className="text-2xl font-semibold md:text-3xl lg:text-4xl">Mot de passe oublié ?</h2>
                        <p className="mt-2 text-center text-sm text-gray-600 md:text-left md:text-base">
                            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                        </p>
                    </div>

                    {/* Success Status */}
                    {status && (
                        <div className="mb-6 rounded-sm border border-green-200 bg-green-50 p-4" data-aos="fade-in" data-aos-delay="300">
                            <div className="flex items-center space-x-3">
                                <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" />
                                <p className="font-medium text-green-800">{status}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form className="space-y-6" onSubmit={submit} data-aos="fade-up" data-aos-delay="400">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 md:text-base">
                                Adresse email
                            </Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400 md:h-5 md:w-5" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="votre@email.com"
                                    className="rounded-sm border border-gray-500 pl-10 text-sm md:pl-12 md:text-base lg:p-6 lg:pl-12"
                                    required
                                    autoFocus
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full rounded-sm bg-[#1D7A85] px-4 py-3 font-medium text-white transition-all duration-200 hover:scale-105 hover:bg-[#155e68] active:scale-95 md:px-6 md:py-4 md:text-base lg:px-4 lg:py-2.5 lg:text-lg"
                        >
                            {processing ? (
                                <>
                                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin md:h-5 md:w-5" />
                                    <span>Envoi en cours...</span>
                                </>
                            ) : (
                                <>
                                    <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                                    <span>Envoyer le lien de réinitialisation</span>
                                </>
                            )}
                        </Button>
                    </form>

                    {/* Divider */}
                    <div className="my-6 flex items-center md:my-8" data-aos="fade-up" data-aos-delay="500">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-xs text-gray-500 md:px-4 md:text-sm">ou</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {/* Back to login */}
                    <div className="text-center" data-aos="fade-up" data-aos-delay="600">
                        <p className="text-sm text-gray-600 md:text-base">
                            Vous vous souvenez de votre mot de passe ?{' '}
                            <Link href={route('login')} className="font-medium text-[#1D7A85] underline transition-colors hover:text-[#155e68]">
                                Retour à la connexion
                            </Link>
                        </p>
                    </div>

                    {/* Security info */}
                    <div className="mt-8 rounded-sm border border-blue-200 bg-blue-50 p-4" data-aos="fade-up" data-aos-delay="700">
                        <div className="flex items-start space-x-3">
                            <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                            <div className="text-sm text-blue-800">
                                <p className="mb-2 font-medium">Informations importantes :</p>
                                <ul className="space-y-1 text-xs md:text-sm">
                                    <li>• Le lien expire dans 60 minutes</li>
                                    <li>• Vérifiez votre dossier spam si nécessaire</li>
                                    <li>• Le lien ne peut être utilisé qu'une seule fois</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
