import React from 'react';
import { ArrowRight } from 'lucide-react';    
import Boutton from '@/components/Boutton';

function AboutUs() {
    return (
        <div data-aos="fade-left" className="container-custom justify-between w-full max-w-[1000px] mx-auto py-10 shadow-medium">
            <div className='flex flex-col md:flex-row justify-between items-center'>
                <span className='font-semibold text-[32px] md:text-[40px] leading-[116%] tracking-normal text-gradient text-center md:text-left'>
                    À propos d'OFOQY
                </span>
                <img src='/images/vector.png' className='mt-10 md:mt-20 w-[150px] md:w-auto mr-6' />
            </div>  
            <div className='flex flex-col md:flex-row justify-between gap-6 md:gap-4 mt-6'>
                <div className='overflow-hidden w-full md:w-[265px] h-[350px] md:h-[410px] rounded-br-[200px] md:rounded-br-[300px] mx-auto md:mx-0'>
                    <img src='/images/about.png' className='w-full h-full object-cover' />
                </div>
                <div className='w-full md:w-[600px] mt-6 md:mt-10'>
                    <span className='font-normal text-[24px] md:text-[30px] leading-[32px] tracking-[0]'>
                        Qu'est-ce qu'OFOQY ?
                    </span>
                    <p className='mt-6 md:mt-9 mb-6 md:mb-8 font-light text-black italic text-[18px] md:text-[20px] leading-[32px] md:leading-[41px] tracking-[0px]'>
                        “ <span className='text-primary-1000 font-medium'>OFOQY</span> est une plateforme web et mobile conçue pour accompagner les bacheliers marocains dans leur orientation académique et professionnelle. Grâce à une approche interactive et personnalisée, elle aide les jeunes à découvrir leurs talents, à explorer les parcours existants, et à faire des choix éclairés pour leur avenir.”
                    </p>
                    <Boutton />
                </div>
            </div>
        </div>
    )
}

export default AboutUs;
