import React from 'react';
import Boutton from '../../../components/Boutton';

function Orientation() {
    return (
        <div data-aos="fade" data-aos-duration="1000" className="section-padding container-custom bg-[#1D7A850A] flex flex-col items-center">
            <span className='text-gradient font-semibold text-[32px] md:text-[40px] leading-[38px] md:leading-[44px] text-center'>Comment s'orienter ?</span>
            <span className='font-normal leading-[24px] mt-4 text-[#717171] mb-4 text-center px-2'>Ofoqy, c’est simple et rapide. Quelques clics suffisent pour commencer ton parcours !</span>
            <div className='flex flex-col md:flex-row justify-center my-12 gap-6 md:gap-0 w-full items-center'>
                <div className='flex flex-col items-center bg-white rounded-[4px] p-6 w-full max-w-xs'>
                    <img src="/images/orientation1.png" />
                    <span className='font-medium text-[20px] md:text-[24px] leading-[30px] md:leading-[36px] text-[#4D4D4D] my-2 text-center'>Création du compte</span>
                    <p className='font-normal text-[14px] leading-[20px] text-[#717171] py-1 px-3 md:px-6 text-center mb-4'>Créez votre compte Ofoqy en un rien de temps ! Une inscription simple, rapide et intuitive en quelques clics seulement.</p>
                </div>
                <div className='p-4 md:p-3 flex flex-col items-center justify-center'>
                    <img src="/images/arrow.png" className='w-[60px] md:w-[94px] h-[60px] md:h-[94px]' />
                </div>
                <div className='flex flex-col items-center bg-white rounded-[4px] p-6 w-full max-w-xs md:max-w-sm'>
                    <img src="/images/orientation2.png" />
                    <span className='font-medium text-[20px] md:text-[24px] leading-[30px] md:leading-[36px] text-[#4D4D4D] my-2 text-center'>Test de personnalité</span>
                    <p className='font-normal text-[14px] leading-[20px] text-[#717171] py-1 px-3 md:px-3 text-center mb-4'>Passez un test conçu spécialement pour vous. Notre système analyse votre personnalité, vos intérêts et vos compétences pour vous aider à mieux vous connaître et à définir votre voie.</p>
                </div>
                <div className='p-4 md:p-3 flex flex-col items-center justify-center'>
                    <img src="/images/arrow.png" className='w-[60px] md:w-[94px] h-[60px] md:h-[94px]' />
                </div>
                <div className='flex flex-col items-center bg-white rounded-[4px] p-6 w-full max-w-xs'>
                    <img src="/images/orientation3.png" />
                    <span className='font-medium text-[20px] md:text-[24px] leading-[30px] md:leading-[36px] text-[#4D4D4D] my-2 text-center'>Voie idéale</span>
                    <p className='font-normal text-[14px] leading-[20px] text-[#717171] py-1 px-3 md:px-6 text-center mb-4'>Recevez votre orientation personnalisée et explorez les parcours qui vous correspondent.</p>
                </div>
            </div>
            <Boutton />
        </div>
    )
}

export default Orientation;