import React from 'react';
import DashboardLayout from '@/layouts/Dashboard-layout'; 
import { FiUser,FiLock,FiSettings,FiHelpCircle,FiTrash2,FiLogOut } from 'react-icons/fi';
import {ArrowRight} from 'lucide-react'; 
import {router} from '@inertiajs/react';
interface DashboardProps {
    student: {
         id: number;
        nom_complet: string;
        email: string;
        ville: string;
        age: number;
        niveau_etude: string;
        filiere: string;
        moyenne_general_bac: number;
    };
    mbtiResult: {
        id: number;
        type_mbti: string;
        resultat_json: {
            message: string;
            generated_at: string;
            generated_by: string;
        };
        created_at: string;
    } | null;
    hasCompletedTest: boolean;
    mbtiType: string | null;
}
function Profile({ student, mbtiResult }: DashboardProps) {
    const resultat = mbtiResult?.type_mbti ?? '';
    const message = mbtiResult?.resultat_json.message ?? '';
    const handleLogout = () => {
             router.post('/logout', {}, {
            onSuccess: () => {
            window.location.href = '/login';
            },
            onError: (errors) => {
            console.error('Logout failed:', errors);
            }
        });
        };

    return (
        <DashboardLayout name={student.nom_complet} level={student.filiere}>
           <div className='mt-4 pt-5 min-w-full pl-4'>
                <span className='font-medium text-[29px] tracking-wide'>Profile</span>
                <div className='flex justify-between gap-10 items-start'>
                    <div className='bg-white rounded-[3px] p-8 flex-1.25 flex flex-col items-center mt-5'> 
                        <img className='rounded-[400px] border-[3px] p-[2px] border-primary-1000 w-[184px] m-2' src='/images/SpaceMan.png'/>
                        <span className='font-bold text-[16px] text-[#4B4B4B] m-3'>{student.nom_complet}</span>
                        <span className='font-regular text-[16px] text-[#4B4B4B] '>{student.filiere}</span>
                        
                        <div className='flex flex-col justify-start mt-10 gap-3 border-t-2 border-[#EAEAEA] py-8 w-full pl-10 '>
                            <div className='flex justify-start  gap-4 items-center mb-3 hover:cursor-pointer'>
                                <FiUser />
                                <span onClick={() => {window.location.href = '/profile'}} className='text-[16px] font-regular text-[#4B4B4B] '>Profile</span>
                            </div>
                            <div className='hover:cursor-pointer flex justify-start gap-4 items-center'>
                                <FiLock />
                                <span onClick={() => {window.location.href = '/forgot-password'}}  className='text-[16px] font-regular text-[#4B4B4B]'>Changer le mot de passe</span>
                            </div>
                        </div>
                        <div className=' hover:cursor-pointer flex flex-col justify-start gap-3 border-t-2  border-[#EAEAEA] py-8 w-full pl-10 '>
                            <div className='flex justify-start gap-4 items-center mb-3'>
                                <FiSettings />
                                <span className='text-[16px] font-regular text-[#4B4B4B]'>Paramètres</span>
                            </div>
                            <div className=' hover:cursor-pointer flex justify-start gap-4 items-center mb-3'>
                                <FiHelpCircle />
                                <span className='text-[16px] font-regular text-[#4B4B4B]'>Aide</span>
                            </div>    
                            <div className=' hover:cursor-pointer flex justify-start gap-4 items-center mb-3'>
                                <FiTrash2 />
                                <span className='text-[16px] font-regular text-[#4B4B4B]'>Supprimer le compte</span>
                            </div>
                        </div>
                        <div className=' hover:cursor-pointer flex flex-col justify-start gap-3 border-t-2 border-[#EAEAEA] py-8 w-full pl-10'>
                            <div className='flex justify-start  gap-4 items-center mb-3'>
                                <FiLogOut className='text-red-600' />
                                <span onClick={()=>{handleLogout()}} className='text-[16px] font-regular text-red-600'>Se deconnecter</span>
                            </div>
                            
                        </div>
                    </div> 
                    <div className='bg-white rounded-[3px] p-10 flex-1 flex flex-col justify-start mt-5 h-auto'> 
                        <span className='font-medium text-[20px]'>Votre résultat de test et recommendations</span>
                        <div className='bg-[#fbf7f7] border border-primary-1000 border-l-4 border-r-2 border-t-2 border-b-2 rounded-[2px] p-5 my-7'>
                            <span className='text-[16px] font-regular text-primary-1000'>Votre personnalité est :</span>
                            <div className='flex justify-start gap-2 p-3'>
                                {resultat.split('').map((word, index) => (
                                    <span key={index} className='text-[16px] font-medium bg-primary-1000 text-white text-center w-[25px] h-[25px]'>{word}</span>                                    
                                ))
                                }
                            </div>
                            <div className='p-2'>
                                <span className='font-light text-[12px] text-[#708090] '>Tu est un {resultat} -</span>
                                <p className='font-medium text-[12px] text-[#708090] mt-2'>{message}</p>
                             </div> 
                             <div className='flex justify-start items-center hover:cursor-pointer'>
                                <a href="" className='text-primary-1000 no-underline font-medium text-[13px] m-3'>Voir plus d’info avec recommandations </a>
                                <ArrowRight className='text-primary-1000 w-[16px]' />
                             </div>
                        </div>
                    </div>
                </div> 
           </div>
        </DashboardLayout> 
    );
}

export default Profile;