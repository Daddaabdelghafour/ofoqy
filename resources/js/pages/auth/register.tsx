import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';


import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';



import Steps from '@/components/Steps';

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

  function nextStep() {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  }

  function prevStep() {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // You can choose to only submit on last step or handle multi-step validation
    if (currentStep < 3) {
      nextStep();
    } else {
      post('/register', {
        onFinish: () => reset('password', 'password_confirmation'),
      });
    }
  }

    return (
    <div className='w-full min-h-screen p-10 flex flex-col'>
        <div className=' flex justify-between  '>
            < ArrowLeft className='text-black w-[20px] h-[20px] border-2.25'/>
            <div className='flex flex-col items-center '>
                <span className='font-medium text-[40px] leading-[100px] w-[342px] h-[50px] '>Créer un compte</span>
                <span className='font-normal text-[18px] leading-[100px] text-[#666666]'>Vous avez déjà un compte ? <a href="" className=' text-primary-1000' >Se connecter</a> </span>
            </div>
            <img src="/images/registerlogo.png" className='w-[30px] h-[50px]'></img>
        </div>
        <div className='flex flex-col items-center'>
            <div className='relative'>
                <div className="flex items-center justify-between w-[1000px]">
            
                    {/* Step 1 */}
                    <div className="flex flex-col items-center flex-1 relative mt-6">
                        <div className='w-8 h-8 flex items-center justify-center  text-white font-semibold bg-primary-1000'>
                        1
                        </div>
                        <p className="text-[14px] font-light text-[#191919] mt-2 w-auto">Ajouter Email et mot de passe</p>
                    </div>

                    {/* Line */}
                    <div className="h-0.5 bg-gray-300 flex-1 relative z-20 -mx-20 "></div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center flex-1 relative mt-6">
                        <div className=' w-8 h-8 flex items-center justify-center '>
                        2
                        </div>
                        <p className="text-[14px] font-light text-[#191919] mt-2 w-auto">Ajouter les infos personnel</p>
                    </div>

                    {/* Line */}
                    <div className="h-0.5 bg-gray-300 flex-1 relative z-20 -mx-20 "></div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center flex-1 relative mt-6">
                    <div className=' w-8 h-8 flex items-center justify-center'>
                        3
                        </div>
                        <p className="text-[14px] font-light text-[#191919] mt-2 w-auto">Ajouter les infos éducatif</p>
                    </div>
                </div>  
            </div>    
        </div>

    
    <form onSubmit={submit} >
    <Steps 
    currentStep={currentStep}
        data={data}
        setData={setData}
        processing={processing}
        errors={errors}
        submit={submit}
   />
    <button
          type="submit"
          
          className="px-4 py-2 bg-primary-1000 text-white rounded"
          disabled={processing}
        >
          {currentStep === 3 ? 'Terminer' : 'Suivant'}
        </button>
        </form>
   </div>
        
    );
}
