import React from 'react';
import { ArrowRight } from 'lucide-react';
import logo from '../../../../../public/images/Logo.png';
import Boutton from '../../../components/Boutton';

function NavBar(){
    return (
            <div className="container-custom flex flex-col md:flex-row justify-between items-center py-8 px-2 md:px-2 md:py-10 lg:py-10 gap-4 md:gap-0">
                <img className='w-[70px] h-full' src={logo}/>
            <ul className=" font-poppins font-regular container-custom flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8 font-normal text-[16px] ">
                <a href="#acceuil">Acceuil</a>
                <a href="#services">Services</a>
                <a href="#about">à propos de nous</a>
                <a href="#temoignage">Témoignage</a>
                <a href="#faq">FAQ</a>
            </ul>

            <Boutton />
            </div>

    );
};
export default NavBar;