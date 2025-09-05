import Notification from '@/components/Notification';
import Steps from '@/components/Steps';
import { useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import React, { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, reset } = useForm({
        nom_complet: '',
        ville: '',
        age: '',
        genre: '',
        email: '',
        password: '',
        password_confirmation: '',
        niveau_etude: '',
        filiere: '',
        langue_bac: '',
        moyenne_general_bac: '',
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [isCheckingEmail, setIsCheckingEmail] = useState(false);
    const [registrationSuccessful, setRegistrationSuccessful] = useState(false);

    // Function to check if email already exists
    const checkEmailExists = async (email: string): Promise<boolean> => {
        try {
            setIsCheckingEmail(true);
            const response = await fetch('/check-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ email }),
            });
            const result = await response.json();
            return result.exists;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        } finally {
            setIsCheckingEmail(false);
        }
    };

    function nextStep() {
        setCurrentStep((prev) => Math.min(prev + 1, 4));
    }

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const newErrors: { [key: string]: string } = {};
        setData('niveau_etude', 'baccalaureat');

        if (currentStep === 1) {
            let isValid = true;
            if (!data.email) {
                newErrors.email = 'Email requis.';
                isValid = false;
            } else {
                // Basic email format validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(data.email)) {
                    newErrors.email = "Format d'email invalide.";
                    isValid = false;
                } else {
                    // Check if email already exists
                    const emailExists = await checkEmailExists(data.email);
                    if (emailExists) {
                        newErrors.email = 'Cet email est déjà utilisé.';
                        isValid = false;
                    }
                }
            }

            if (!data.password) {
                newErrors.password = 'Mot de passe requis.';
                isValid = false;
            }
            if (data.password.length < 8) {
                newErrors.password = '8 caractères min.';
                isValid = false;
            }
            if (!data.password_confirmation) {
                newErrors.password_confirmation = 'Confirmation requise.';
                isValid = false;
            }
            if (data.password !== data.password_confirmation) {
                newErrors.password_confirmation = 'Les mots de passe ne correspondent pas.';
                isValid = false;
            }

            if (!isValid) {
                setFormErrors(newErrors);
                return;
            } else {
                setFormErrors({});
                nextStep();
            }
        } else if (currentStep === 2) {
            let isValid = true;
            if (!data.nom_complet) {
                newErrors.nom_complet = 'Nom requis.';
                isValid = false;
            }
            if (!data.ville) {
                newErrors.ville = 'Ville requise.';
                isValid = false;
            }
            if (!data.age) {
                newErrors.age = 'Âge requis.';
                isValid = false;
            }
            if (!data.genre) {
                newErrors.genre = 'Genre requis.';
                isValid = false;
            }

            if (!isValid) {
                setFormErrors(newErrors);
                return;
            } else {
                setFormErrors({});
                nextStep();
            }
        } else if (currentStep === 3) {
            let isValid = true;
            if (!data.filiere) {
                newErrors.filiere = 'Filière requise.';
                isValid = false;
            }
            if (!data.langue_bac) {
                newErrors.langue_bac = 'Langue requise.';
                isValid = false;
            }
            if (!data.moyenne_general_bac) {
                newErrors.moyenne_general_bac = 'Moyenne requise.';
                isValid = false;
            }
            if (!isValid) {
                setFormErrors(newErrors);
                return;
            } else {
                post('/register', {
                    preserveScroll: true,
                    onFinish: () => reset('password', 'password_confirmation'),
                    onSuccess: () => {
                        setRegistrationSuccessful(true);
                        reset('password', 'password_confirmation');
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 8000);
                    },
                });
            }
        }
    }

    return (
        <div className="flex min-h-screen w-full flex-col p-8">
             {registrationSuccessful && (
                <div className="fixed inset-x-0 top-4 z-50 mx-auto w-full max-w-md px-4">
                    <Notification
                        notification={{
                            show: true,
                            type: 'success',
                            title: 'Succès',
                            message: 'Inscription réussie ! Vous allez être redirigé vers la page de connexion.',
                        }}
                    />
                </div>
            )}
            <div className="flex flex-wrap items-center justify-between lg:flex-nowrap">
                <a href="/">
                    <ArrowLeft className="border-2.25 h-[20px] w-[20px] text-black" />
                </a>
                <img src="/images/registerlogo.png" className="mt-2 hidden h-[50px] w-[30px] sm:block lg:mt-0" alt="Logo" />
            </div>

            <div className="flex flex-col items-center">
                <div className="mx-4 flex max-w-full flex-grow flex-col items-center lg:max-w-[342px]">
                    <span className="text-center text-[40px] font-medium leading-[50px]">Créer un compte</span>
                    <span className="mt-1 w-full text-center text-[16px] font-normal leading-[28px] text-[#666666]">
                        Vous avez déjà un compte ?{' '}
                        <a href="/login" className="text-primary-1000">
                            Se connecter
                        </a>
                    </span>
                </div>
                {/* line of steps on top */}
                <div className="relative mt-[3px] w-full max-w-[1000px] px-4">
                    <div className="flex flex-col items-center justify-between sm:flex-row">
                        {/* Step 1 */}
                        <div className="relative mt-[30px] flex min-w-[80px] flex-1 flex-col items-center">
                            <div
                                style={{
                                    backgroundColor: currentStep === 1 ? '#1D7A85' : '#1d7b855b',
                                }}
                                className="flex h-8 w-8 items-center justify-center text-[14px] font-semibold text-white"
                            >
                                1
                            </div>
                            <p className="mt-2 text-center text-[14px] font-light text-[#191919]">Ajouter Email et mot de passe</p>
                        </div>

                        {/* Line */}
                        <div className="relative z-20 -mx-20 hidden h-0.5 flex-1 bg-gray-300 sm:block"></div>

                        {/* Step 2 */}
                        <div className="relative mt-6 flex min-w-[80px] flex-1 flex-col items-center">
                            <div
                                style={{
                                    backgroundColor: currentStep === 2 ? '#1D7A85' : '#1d7b855b',
                                }}
                                className="flex h-8 w-8 items-center justify-center text-[14px] font-semibold text-white"
                            >
                                2
                            </div>
                            <p className="mt-2 text-center text-[14px] font-light text-[#191919]">Ajouter les infos personnels</p>
                        </div>

                        {/* Line */}
                        <div className="relative z-20 -mx-20 hidden h-0.5 flex-1 bg-gray-300 sm:block"></div>

                        {/* Step 3 */}
                        <div className="relative mt-6 flex min-w-[80px] flex-1 flex-col items-center">
                            <div
                                style={{
                                    backgroundColor: currentStep === 3 ? '#1D7A85' : '#1d7b855b',
                                }}
                                className="flex h-8 w-8 items-center justify-center text-[14px] font-semibold text-white"
                            >
                                3
                            </div>
                            <p className="mt-2 text-center text-[14px] font-light text-[#191919]">Ajouter les infos éducatifs</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={submit} className="mt-6 flex w-full max-w-[950px] flex-col px-4">
                    <Steps currentStep={currentStep} data={data} setData={setData} processing={processing} errors={formErrors} />
                    <button
                        type="submit"
                        className="my-6 h-[51px] rounded-[3px] bg-primary-1000 px-4 text-[16px] font-normal text-white"
                        disabled={processing || isCheckingEmail}
                    >
                        {isCheckingEmail ? "Vérification de l'email..." : currentStep === 3 ? 'Terminer' : 'Suivant'}
                    </button>
                </form>

                <div className="my-6 mb-10 mt-4 flex w-full max-w-[1000px] items-center px-4" data-aos="fade-up" data-aos-delay="200">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-3 text-xs text-gray-500 md:px-4 md:text-sm">Ou</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                <div className="flex w-full max-w-[1000px] flex-col gap-4 px-4 sm:flex-row sm:gap-[70px]" data-aos="fade-up" data-aos-delay="200">
                    {/* Google Login Button */}
                    <button
                        type="button"
                        className="btn btn-secondary flex h-[51px] flex-1 items-center justify-center gap-2 rounded-[3px] border border-b-4 border-primary-1000 bg-white px-3 pt-3 text-[14px] font-normal text-primary-1000 transition-all duration-200 hover:scale-105 hover:border-primary-1000 hover:bg-gray-50 active:scale-95 md:px-4 md:py-2.5 lg:px-6 lg:py-3"
                        onClick={() => {
                            window.location.href = route('auth.google');
                        }}
                    >
                        <svg className="h-[24px] w-[24px] md:h-5 md:w-5" viewBox="0 0 24 24">
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
                        <span className="ml-2 text-xs font-normal md:text-sm lg:text-base">Avec Google</span>
                    </button>

                    {/* Instagram Login Button */}
                    <button
                        type="button"
                        className="btn btn-secondary flex h-[51px] flex-1 items-center justify-center gap-2 rounded-[3px] border border-b-4 border-primary-1000 bg-white px-3 pt-3 text-[14px] font-normal text-primary-1000 transition-all duration-200 hover:scale-105 hover:border-primary-1000 hover:bg-gray-50 active:scale-95 md:px-4 md:py-2.5 lg:px-6 lg:py-3"
                        onClick={() => {
                            window.location.href = route('auth.instagram');
                        }}
                    >
                        <svg className="h-[24px] w-[24px] md:h-5 md:w-5" viewBox="0 0 24 24">
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
                        <span className="ml-2 text-xs font-normal md:text-sm lg:text-base">Avec Instagram</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
