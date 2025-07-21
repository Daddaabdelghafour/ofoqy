import { Filter, Gauge, GraduationCap, LayoutDashboard, MessageCircle, User } from 'lucide-react';

function Services() {
    const services = [
        {
            icon: Gauge,
            title: "Test d'orientation",
            description:
                'Passez un test complet, conçu par des experts, pour découvrir vos talents cachés, vos valeurs et les domaines faits pour vous',
        },
        {
            icon: MessageCircle,
            title: 'Chatbot IA',
            description: "Besoin d'un conseil à n'importe quelle heure ? Notre assistant IA vous répond en continu pour vous guider à chaque étape",
        },
        {
            icon: User,
            title: 'Profil Personnalisé',
            description: 'Profil détaillé regroupant vos compétences, préférences et recommandations personnalisées',
        },
        {
            icon: GraduationCap,
            title: 'Explorer les Universités',
            description:
                "Accédez à une base de données complète d'établissements scolaires, universités et écoles de formation à travers le pays et au-delà",
        },
        {
            icon: LayoutDashboard,
            title: 'Tableau de Bord',
            description: 'Suivez vos résultats, explorez vos parcours possibles et planifiez votre avenir dans une interface claire et intuitive',
        },
        {
            icon: Filter,
            title: 'Filtres Avancés de Recherche',
            description: 'Utilisez des filtres pour affiner vos recherches : localisation, spécialités, seuils, etc.',
        },
    ];

    return (
        <div className="container-custom bg-gradient-secondary section-padding">
            {/* Header Section */}
            <div className="mx-auto mb-12 flex max-w-4xl flex-col text-center lg:mb-16">
                <h3 className="mb-4 text-2xl font-bold text-secondary-800 sm:text-3xl lg:text-4xl">Nos Services</h3>
                <p className="text-sm leading-relaxed text-secondary-700 sm:text-base lg:text-lg">
                    Un accompagnement complet et intelligent pour votre orientation
                </p>
            </div>

            {/* Services Grid */}
            <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
                {services.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                        <div
                            key={index}
                            className="card rounded-xs group flex h-auto min-h-[280px] w-[320px] flex-col items-center p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-medium sm:min-h-[320px] lg:min-h-[300px] lg:p-8"
                        >
                            {/* Icon Container */}
                            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 transition-colors duration-300 group-hover:bg-primary-200 lg:h-12 lg:w-12">
                                <IconComponent className="h-8 w-8 text-primary-600 transition-colors duration-300 group-hover:text-primary-700 lg:h-7 lg:w-7" />
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
    );
}

export default Services;
