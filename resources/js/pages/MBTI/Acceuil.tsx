import React from 'react';
import { ArrowRight } from 'lucide-react';
function Acceuil(){
    return(
        <div className='flex items-center min-h-screen w-full flex-col p-8'>
          <nav className='flex justify-end h-[55px] w-full mb-8'>
            <img src="/images/registerlogo.png"/>
          </nav>
          <span className='font-normal italic text-[32px] tracking-[2%] leading-[1.4] mb-5' data-aos='fade-in' data-aos-duration="1000">Quel est ton profil de personnalité En 3 minutes ?</span>
          <span className='w-full text-center font-bold text-[50px] leading-[1.4] text-primary-1000 mb-6 'data-aos='fade-in' data-aos-duration="1000">Commencer le test de personnalité MBTI</span>
          <img className='w-[266px] h-[266px] mb-6'data-aos='fade-in' data-aos-duration="1000" src="/images/speedtest.png"/> 
          <img src="/images/bar.png"/> 
          <span className='w-[814px] mt-12 mb-10 font-medium text-[18px] text-[#797979] text-center' data-aos='fade-in' data-aos-duration="1000" >Chez Ofoqy, nous croyons que bien se connaître permet de mieux choisir son avenir. Ce test de personnalité t’aidera à mieux comprendre ton mode de fonctionnement pour t’orienter vers des études ou métiers qui te correspondent.</span>
          <div className='flex w-auto gap-10'>
            <button onClick={()=>window.location.href='/questions'} className="btn btn-primary px-7 p-4 flex justify-center mt-4 md:mt-0 hover:bg-white hover:text-primary-1000 border-primary-1000 font-normal leading-24px] text-[18px]">
            Commencer le test
            <ArrowRight className="pt-1 pb-1 ml-1 font-medium" />
            </button>
            <div className='text-center flex flex-col justify-end '>
            <a href="/dashboard" className='text-primary-1000 font-normal h-[50px] pt-[10px]'>Passer</a>
            </div>
          </div>
        </div>
    )
}

export default Acceuil;
