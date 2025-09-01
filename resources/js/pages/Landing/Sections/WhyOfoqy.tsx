import { ArrowRight } from 'lucide-react';

function WhyOfoqy() {
    const reasons = [
        {
            description: 'Plateforme 100 % marocaine, pensée pour les lycéens marocains.',
        },
        {
            description: 'Données fiables, mises à jour et validées.',
        },
        {
            description: 'Accès gratuit et simple via web ou application mobile.',
        },
        {
            description: 'Parler avec un Chatbot IA Disponible 24/7',
        },
        {
            description: " Trouvez l'Université de Vos Rêves !",
        },
        {
            description: 'Des recommandation personnalisée selon votre personnalité.',
        },
    ];

    return (
        <div id="faq" className="container-custom py-20 flex flex-col gap-8 lg:flex-row lg:gap-[150px]">
            <div className="flex w-full flex-col gap-3 lg:w-auto " data-aos="fade-right" data-aos-duration="800" data-aos-delay="1000">
                <h1 className="mb-6 bg-gradient-to-t from-gray-800 via-gray-700 to-gray-500 bg-clip-text text-center text-2xl font-semibold text-transparent sm:text-3xl lg:text-left lg:text-4xl">
                    Pourquoi Choisir <div className="leading-1 mt-2">OFOQY ?</div>
                </h1>
                {reasons.map((reason, index) => {
                    return (
                        <div key={index} className="my-2 flex items-start gap-3 overflow-hidden">
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-700">
                                <img src="/images/Subtract.png" className="bg-white" width={200} height={200} />
                            </div>
                            <p className="p text-[#191A15] mt-[5px] text-sm font-normal leading-3 sm:text-base">{reason.description}</p>
                        </div>
                    );
                })}
                <div className="mt-[60px]">
                    <button className="btn btn-primary border-primay-600 mx-auto flex w-full items-center justify-center gap-2 rounded-lg border border-primary-600 bg-white px-6 py-3 text-primary-700 transition-all duration-200 hover:scale-105 hover:border-primary-700 hover:bg-white hover:text-primary-700 active:scale-95 sm:w-[200px] lg:mx-0">
                        <span className="text-base font-medium lg:text-lg">Commencer</span>
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div
                className="relative order-first w-full p-4 sm:p-8 lg:order-last lg:w-fit lg:p-10"
                data-aos="fade-left"
                data-aos-duration="800"
                data-aos-delay="1000"
            >
                <div className="relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
                    <img src="/images/WhyOfoqy4.png" alt="" className="relative z-10 mx-auto h-auto w-full max-w-md" />
                    <div className="absolute right-[60%] top-[100px] z-20 sm:right-[50%] sm:top-[120px] lg:right-[50%] lg:top-[120px]">
                        <img
                            src="/images/WhyOfoqy3.png"
                            alt=""
                            className="h-auto w-auto max-w-none"
                            style={{ minWidth: 'auto', minHeight: 'auto' }}
                        />
                    </div>
                    <div className="absolute right-[10%] top-[150px] z-20 sm:right-[5%] sm:top-[200px] lg:right-[5%] lg:top-[200px]">
                        <img
                            src="/images/WhyOfoqy2.png"
                            alt=""
                            className="h-auto w-auto max-w-none"
                            style={{ minWidth: 'auto', minHeight: 'auto' }}
                        />
                    </div>
                    <div className="absolute bottom-[20px] left-0 z-20 sm:bottom-[25px] lg:bottom-[25px]">
                        <img
                            src="/images/WhyOfoqy1.png"
                            alt=""
                            className="h-auto w-auto max-w-none"
                            style={{ minWidth: 'auto', minHeight: 'auto' }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WhyOfoqy;
