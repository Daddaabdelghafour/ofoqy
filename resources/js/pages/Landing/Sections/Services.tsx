function Services() {
    const services = [
        {
            icon: '/images/speedometer.png',
            title: "Test d'orientation",
            description:
                'Passez un test complet, conçu par des experts, pour découvrir vos talents cachés, vos valeurs et les domaines faits pour vous',
        },
        {
            icon: '/images/chat.png',
            title: 'Chatbot IA',
            description: "Besoin d'un conseil à n'importe quelle heure ? Notre assistant IA vous répond en continu pour vous guider à chaque étape",
        },
        {
            icon: '/images/profile.png',
            title: 'Profil Personnalisé',
            description: 'Profil détaillé regroupant vos compétences, préférences et recommandations personnalisées',
        },
        {
            icon: '/images/uni.png',
            title: 'Explorer les Universités',
            description:
                "Accédez à une base de données complète d'établissements scolaires, universités et écoles de formation à travers le pays et au-delà",
        },
        {
            icon: '/images/dashboard.png',
            title: 'Tableau de Bord',
            description: 'Suivez vos résultats, explorez vos parcours possibles et planifiez votre avenir dans une interface claire et intuitive',
        },
        {
            icon: '/images/filtrage.png',
            title: 'Filtres Avancés de Recherche',
            description: 'Utilisez des filtres pour affiner vos recherches : localisation, spécialités, seuils, etc.',
        },
    ];

    return (
        <div className="w-full bg-[#1D7A850A]">
            <div className="container-custom section-padding">
                {/* Header Section */}
                <div className="mx-auto mb-12 flex max-w-4xl flex-col text-center lg:mb-16">
                    <h3 className="text-gradient mb-4 text-2xl font-bold text-secondary-800 sm:text-3xl lg:text-4xl">Nos Services</h3>
                    <p className="text-sm leading-relaxed text-secondary-700 sm:text-base lg:text-lg">
                        Un accompagnement complet et intelligent pour votre orientation
                    </p>
                </div>

                {/* Services Grid */}
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                    {services.map((service, index) => {
                        return (
                            <div
                                key={index}
                                className="card rounded-xs group mx-auto flex h-auto min-h-[280px] w-full max-w-[320px] flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-medium sm:min-h-[320px] lg:min-h-[300px] lg:p-8"
                            >
                                {/* Icon Container */}
                                <div className="h-30 w-30 mb-6 flex items-center justify-center sm:h-24 sm:w-24 lg:h-20 lg:w-20">
                                    <img
                                        src={service.icon}
                                        alt={service.title}
                                        className="h-12 w-12 transition-all duration-300 group-hover:scale-110 sm:h-16 sm:w-16 lg:h-14 lg:w-14"
                                    />
                                </div>

                                {/* Title */}
                                <h4 className="mb-4 text-lg font-semibold leading-tight text-secondary-800 lg:text-xl">{service.title}</h4>

                                {/* Description */}
                                <p className="flex-grow text-sm leading-relaxed text-gray-600 lg:text-sm">{service.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Services;
