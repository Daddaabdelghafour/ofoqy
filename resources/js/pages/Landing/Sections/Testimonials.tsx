import React from 'react';
import Boutton from '../../../components/Boutton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function Testimonials() {
    const TestimonialsData = [
        {
            name: "Hanane - Maman d’un lycéen",
            username: "@Hanane175",
            text: "En tant que parent, j’étais un peu perdue avec toutes les options. Ofoqy m’a beaucoup aidée à comprendre les choix possibles et à guider mon fils. C’est rassurant d’avoir une plateforme aussi bien pensée.",
        },
        {
            name: "Salma - Terminale Sciences Maths",
            username: "@Salam.elmouden",
            text: "Avant, j’étais complètement perdue sur mon orientation. Avec Ofoqy, j’ai pu découvrir les filières qui me correspondent vraiment. Aujourd’hui, je sais exactement ce que je veux faire après le bac !",
        },
        {
            name: "Youssef - 1ère année université",
            username: "@Youssef.Mad15",
            text: "Pendant ma terminale, j’ai utilisé Ofoqy pour m’aider à choisir entre plusieurs écoles. Le contenu est clair, bien organisé, et adapté à la réalité marocaine. C’est grâce à ça que j’ai pu faire un choix réfléchi.",
        },
        {
            name: "Amina - Maman d’un lycéen",
            username: "@Amina175",
            text: "En tant que parent, j’étais un peu perdue avec toutes les options. Ofoqy m’a beaucoup aidée à comprendre les choix possibles et à guider mon fils. C’est rassurant d’avoir une plateforme aussi bien pensée.",
        },
    ];
    return (
        <div className=' py-20 w-full'>
        <div className='container-custom flex flex-col items-center overflow-hidden max-w-screen'>
            <span className='text-gradient font-semibold text-[32px] md:text-[40px] leading-[38px] md:leading-[44px] text-center mb-8'>
                Ils l'ont fait, pourquoi pas vous ?
            </span>
            <Swiper
                modules={[Navigation, Pagination]}
                spaceBetween={10}
                slidesPerView={1}
                breakpoints={{
                    640: { slidesPerView: 1 },
                    768: { slidesPerView: 2 },
                    900: { slidesPerView: 3 }
                }}
                centeredSlides={true}
                navigation
                pagination={{ clickable: true }}
                loop={true}
                className="w-full"
            >
                {TestimonialsData.map((testimonial, index) => (
                    <SwiperSlide key={index} className="p-4 w-full my-9">
                        <div className="bg-white rounded-lg shadow-md p-8">
                            <div className='flex justify-center'>
                                <img src={"/images/testimony" + (index + 1) + ".png"} className='w-[50px] h-[50px] mr-4' />
                                <div className='w-full'>
                                    <span className="font-medium text-[12.15px]">{testimonial.name}</span>
                                    <p className="text-[#1D7A85] text-[12.1px] tracking-wide leading-[22.18px] ">{testimonial.username}</p>
                                </div>
                            </div>
                            <p className="mt-4 font-light text-[12px] tracking-wide leading-[22.18px] text-black ">{testimonial.text}</p>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
        </div>
    );
}

export default Testimonials;