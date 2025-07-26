import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import React from 'react';
import Steps from '@/components/Steps';
import { get } from 'http';

export default function Register() {
  const { data, setData, post, processing, errors, reset } = useForm({
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

  function nextStep() {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (currentStep === 1) {
      let isValid = true;
      if (!data.email) {
        newErrors.email = "Email requis.";
        isValid = false;
      }
      if (!data.password) {
        newErrors.password = "Mot de passe requis.";
        isValid = false;
      }
      if (data.password.length < 8) {
        newErrors.password = "8 caractères min.";
        isValid = false;
      }
      if (!data.password_confirmation) {
        newErrors.password_confirmation = "Confirmation requise.";
        isValid = false;
      }
      if (data.password !== data.password_confirmation) {
        newErrors.password_confirmation = "Les mots de passe ne correspondent pas.";
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
        newErrors.nom_complet = "Nom requis.";
        isValid = false;
      }
      if (!data.ville) {
        newErrors.ville = "Ville requise.";
        isValid = false;
      }
      if (!data.age) {
        newErrors.age = "Âge requis.";
        isValid = false;
      }
      if (!data.genre) {
        newErrors.genre = "Genre requis.";
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
      if (!data.niveau_etude) {
        newErrors.niveau_etude = "Niveau requis.";
        isValid = false;
      }
      if (!data.filiere) {
        newErrors.filiere = "Filière requise.";
        isValid = false;
      }
      if (!data.langue_bac) {
        newErrors.langue_bac = "Langue requise.";
        isValid = false;
      }
      if (!data.moyenne_general_bac) {
        newErrors.moyenne_general_bac = "Moyenne requise.";
        isValid = false;
      }
      if (!isValid) {
        setFormErrors(newErrors);
        return;
      } else {
        post('/register', {
          onFinish: () => reset('password', 'password_confirmation'),
        });
        window.location.href="/login";
      }
    }
  }

  return (
    <div className="w-full min-h-screen p-8 flex flex-col">
      <div className="flex justify-between items-center flex-wrap lg:flex-nowrap">
        <a href="/"><ArrowLeft className="text-black w-[20px] h-[20px] border-2.25" /></a>
        <img
          src="/images/registerlogo.png"
          className="w-[30px] h-[50px] mt-2 lg:mt-0 hidden sm:block"
          alt="Logo"
        />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center flex-grow max-w-full lg:max-w-[342px] mx-4 ">
          <span className="font-medium text-[40px] leading-[50px] text-center">
            Créer un compte
          </span>
          <span className="font-normal text-[16px] leading-[28px] text-[#666666] w-full text-center mt-1">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-primary-1000">
              Se connecter
            </a>
          </span>
        </div>
        {/* line of steps on top */}
        <div className="relative w-full max-w-[1000px] px-4 mt-[3px]">
          <div className="flex flex-col sm:flex-row  items-center justify-between">
            {/* Step 1 */}
            <div className="flex flex-col items-center flex-1 relative mt-[30px] min-w-[80px]">
              <div
                style={{
                  backgroundColor: currentStep === 1 ? '#1D7A85' : '#1d7b855b',
                }}
                className="w-8 h-8 flex items-center justify-center text-white font-semibold text-[14px]"
              >
                1
              </div>
              <p className="text-[14px] font-light text-[#191919] mt-2 text-center">
                Ajouter Email et mot de passe
              </p>
            </div>

            {/* Line */}
            <div className="h-0.5 bg-gray-300 flex-1 relative z-20 -mx-20 hidden sm:block"></div>

            {/* Step 2 */}
            <div className="flex flex-col items-center flex-1 relative mt-6 min-w-[80px]">
              <div
                style={{
                  backgroundColor: currentStep === 2 ? '#1D7A85' : '#1d7b855b',
                }}
                className="w-8 h-8 flex items-center justify-center text-white font-semibold text-[14px]"
              >
                2
              </div>
              <p className="text-[14px] font-light text-[#191919] mt-2 text-center">
                Ajouter les infos personnels
              </p>
            </div>

            {/* Line */}
            <div className="h-0.5 bg-gray-300 flex-1 relative z-20 -mx-20 hidden sm:block"></div>

            {/* Step 3 */}
            <div className="flex flex-col items-center flex-1 relative mt-6 min-w-[80px]">
              <div
                style={{
                  backgroundColor: currentStep === 3 ? '#1D7A85' : '#1d7b855b',
                }}
                className="w-8 h-8 flex items-center justify-center text-white font-semibold text-[14px]"
              >
                3
              </div>
              <p className="text-[14px] font-light text-[#191919] mt-2 text-center">
                Ajouter les infos éducatifs
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={submit}
          className="flex flex-col w-full max-w-[950px] px-4 mt-6"
        >
          <Steps
            currentStep={currentStep}
            data={data}
            setData={setData}
            processing={processing}
            errors={formErrors}
          />
          <button
            type="submit"
            className="px-4 h-[51px] my-6 bg-primary-1000 text-white rounded-[3px] font-normal text-[16px]"
            disabled={processing}
          >
            {currentStep === 3 ? 'Terminer' : 'Suivant'}
          </button>
        </form>

        <div
          className="mt-4 mb-10 flex my-6 w-full max-w-[1000px] items-center px-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-3 text-xs text-gray-500 md:px-4 md:text-sm">Ou</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        <div
          className="flex flex-col sm:flex-row gap-4 sm:gap-[70px] w-full max-w-[1000px] px-4"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          {/* Google Login Button */}
          <button
            type="button"
            className="btn btn-secondary flex flex-1 items-center justify-center gap-2 rounded-[3px] border border-primary-1000 border-b-4 h-[51px] bg-white px-3 pt-3 text-primary-1000 transition-all duration-200 hover:scale-105 hover:border-primary-1000 hover:bg-gray-50 active:scale-95 md:px-4 md:py-2.5 lg:px-6 lg:py-3 font-normal text-[14px]"
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
            <span className="text-xs font-normal md:text-sm lg:text-base ml-2">
              Avec Google
            </span>
          </button>

          {/* Instagram Login Button */}
          <button
            type="button"
            className="btn btn-secondary flex flex-1 items-center justify-center gap-2 rounded-[3px] border border-primary-1000 border-b-4 h-[51px] bg-white px-3 pt-3 text-primary-1000 transition-all duration-200 hover:scale-105 hover:border-primary-1000 hover:bg-gray-50 active:scale-95 md:px-4 md:py-2.5 lg:px-6 lg:py-3 font-normal text-[14px]"
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
            <span className="text-xs font-normal md:text-sm lg:text-base ml-2">
              Avec Instagram
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
