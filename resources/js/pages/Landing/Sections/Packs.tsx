import PackCard from '@/components/PackCard';

function Packs() {
    const packs = [
        {
            icon: '/images/eclipse.png',
            packName: 'Découverte',
            description: 'Un premier pas vers votre avenir.',
            price: '100DH',
            features: ['1 consultation personnalisée', 'Accès aux ressources de base', "Rapport d'orientation simplifié"],
            bgColor: 'bg-white',
            className: 'border border-gray-200 shadow-sm',
            textColorClass: '',
            bgIcon: 'bg-[#1D7A852E]',
        },
        {
            icon: '/images/square.png',
            packName: 'Avancé',
            description: 'Pour une orientation approfondie.',
            price: '250DH',
            features: ['3 consultations personnalisées', 'Accès premium à tous nos outils', "Plan d'orientation détaillé"],
            bgColor: 'bg-[#1D7A85]',
            className: 'border-2 border-primary-700 shadow-lg',
            textColorClass: 'text-white',
            isSpecial: true,
            bgIcon: 'bg-white',
        },
        {
            icon: '/images/hexagon.png',
            packName: 'Premium',
            description: "Accompagnement complet jusqu 'à  votre choix final.",
            price: '500DH',
            features: ['5 consultations + coaching', 'Accès illimité à toutes nos ressources', 'Suivi personnalisé sur 3 mois'],
            bgColor: 'bg-white',
            className: 'border border-secondary-200 shadow-md',
            textColorClass: '',
            bgIcon: 'bg-[#1D7A852E]',
            isPremium: true,
        },
    ];

    return (
        <div className="w-full bg-[#1D7A850A]">
            <div className="container-custom section-padding">
                <h2
                    className="text-gradient mb-2 text-center text-2xl font-medium sm:text-3xl lg:text-4xl"
                    data-aos="fade-up"
                    data-aos-duration="800"
                >
                    Nos Packs d'Orientation
                </h2>
                <p
                    className="mx-auto max-w-2xl text-center text-sm font-normal text-gray-600 sm:text-base lg:text-lg"
                    data-aos="fade-up"
                    data-aos-delay="200"
                    data-aos-duration="800"
                >
                    Choisissez le pack qui correspond à vos besoins et commencez votre parcours avec Ofoqy.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 py-8 sm:flex-row sm:gap-6">
                    {packs.map((pack, index) => (
                        <div
                            key={index}
                            className={`${index === 1 ? 'transform sm:translate-y-4 sm:scale-105' : ''} w-full max-w-[320px] transition-transform duration-300 sm:w-auto sm:max-w-none`}
                            data-aos={index === 0 ? 'fade-right' : index === 1 ? 'zoom-in' : 'fade-left'}
                            data-aos-duration="800"
                            data-aos-delay={300 + index * 150}
                        >
                            <PackCard
                                icon={pack.icon}
                                packName={pack.packName}
                                description={pack.description}
                                price={pack.price}
                                features={pack.features}
                                bgColor={pack.bgColor}
                                className={pack.className}
                                textColorClass={pack.textColorClass}
                                isSpecial={pack.isSpecial}
                                bgIcon={pack.bgIcon}
                                isPremium={pack.isPremium}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Packs;
