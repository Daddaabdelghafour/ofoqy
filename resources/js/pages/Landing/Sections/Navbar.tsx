import React from 'react';
import { ArrowRight } from 'lucide-react';

function NavBar(){
    return (
            <div className="container-custom flex flex-col md:flex-row justify-between items-center font-normal py-8 px-2 md:px-2 md:py-10 lg:py-10 gap-4 md:gap-0">
            <div>logo</div>

            <ul className="container-custom flex flex-col md:flex-row justify-center items-center gap-4 md:gap-8">
                <a href="#acceuil">Acceuil</a>
                <a href="#services">Services</a>
                <a href="#about">A propos de nous</a>
                <a href="#temoignage">Temoignage</a>
                <a href="#faq">FAQ</a>
            </ul>

            <button className="btn btn-primary px-6 flex justify-center mt-4 md:mt-0">
                Commencer
                <ArrowRight className="pt-1 pb-0.5 ml-2" />
            </button>
            </div>

    );
};
export default NavBar;