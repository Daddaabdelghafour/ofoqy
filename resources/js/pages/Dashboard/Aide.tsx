import DashboardLayout from '@/layouts/Dashboard-layout';
import { ArrowLeft } from 'lucide-react';

const Help = () => {
    return (
        <DashboardLayout name="" level="">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-[40px] flex h-[25px] gap-3">
                    <a className="" href="/profile">
                        <ArrowLeft />
                    </a>
                    <h1 className="mb-6 text-2xl font-bold text-gray-800">Centre d'aide</h1>
                </div>

                <div className="container-custom min-h-screen p-5">
                    <div className="min-h-[769px] rounded-xl">
                        <div className="flex h-[80px] min-w-full flex-col items-center rounded-xl bg-gradient-to-r from-[#1D7A85] to-[#071C1F]"></div>

                        <div className="bg-white p-6">
                            <h2 className="mb-6 text-xl font-semibold text-gray-800">Guide d'utilisation Ofoqy</h2>

                            {/* Section 1: Bienvenue */}
                            <div className="mb-8 rounded-lg border border-gray-200 p-6">
                                <h3 className="mb-4 text-lg font-medium text-[#1D7A85]">1. Bienvenue sur Ofoqy</h3>
                                <p className="mb-4 text-gray-700">
                                    Ofoqy est une plateforme innovante conçue pour vous aider à trouver les établissements d'enseignement supérieur
                                    qui correspondent le mieux à votre personnalité et à votre parcours académique.
                                </p>
                                <p className="text-gray-700">
                                    Notre mission est de simplifier votre orientation universitaire en vous proposant des recommandations
                                    personnalisées basées sur votre profil MBTI (Myers-Briggs Type Indicator) et vos résultats scolaires.
                                </p>
                            </div>

                            {/* Section 2: Compte */}
                            <div className="mb-8 rounded-lg border border-gray-200 p-6">
                                <h3 className="mb-4 text-lg font-medium text-[#1D7A85]">2. Gérer votre compte</h3>

                                <h4 className="mb-2 font-medium text-gray-800">Profil</h4>
                                <p className="mb-4 text-gray-700">
                                    Vous pouvez mettre à jour vos informations personnelles et académiques à tout moment en cliquant sur "Profile"
                                    dans le menu latéral. Assurez-vous que ces informations sont à jour pour obtenir les meilleures recommandations.
                                </p>

                                <h4 className="mb-2 font-medium text-gray-800">Photo de profil</h4>
                                <p className="mb-4 text-gray-700">
                                    Vous pouvez ajouter ou modifier votre photo de profil en cliquant sur l'icône d'édition à côté de votre photo
                                    actuelle dans la page de profil.
                                </p>

                                <h4 className="mb-2 font-medium text-gray-800">Mot de passe</h4>
                                <p className="text-gray-700">
                                    Pour changer votre mot de passe, allez dans la section "Profile" et remplissez les champs "Mot de passe actuel",
                                    "Nouveau mot de passe" et "Confirmer le mot de passe".
                                </p>
                            </div>

                            {/* Section 3: Test MBTI */}
                            <div className="mb-8 rounded-lg border border-gray-200 p-6">
                                <h3 className="mb-4 text-lg font-medium text-[#1D7A85]">3. Test de personnalité MBTI</h3>
                                <p className="mb-4 text-gray-700">
                                    Le test MBTI (Myers-Briggs Type Indicator) est un outil qui vous aide à identifier vos préférences naturelles dans
                                    quatre dimensions de la personnalité:
                                </p>

                                <ul className="mb-4 list-inside list-disc space-y-2 text-gray-700">
                                    <li>
                                        <strong>E/I</strong> - Extraversion ou Introversion: comment vous rechargez votre énergie
                                    </li>
                                    <li>
                                        <strong>S/N</strong> - Sensation ou iNtuition: comment vous recueillez l'information
                                    </li>
                                    <li>
                                        <strong>T/F</strong> - Thinking (pensée) ou Feeling (sentiment): comment vous prenez des décisions
                                    </li>
                                    <li>
                                        <strong>J/P</strong> - Jugement ou Perception: comment vous interagissez avec le monde extérieur
                                    </li>
                                </ul>

                                <p className="text-gray-700">
                                    Répondez aux questions de manière honnête et spontanée. Il n'y a pas de bonnes ou mauvaises réponses, seulement
                                    des préférences personnelles.
                                </p>
                            </div>

                            {/* Section 4: Universités */}
                            <div className="mb-8 rounded-lg border border-gray-200 p-6">
                                <h3 className="mb-4 text-lg font-medium text-[#1D7A85]">4. Explorer les universités</h3>
                                <p className="mb-4 text-gray-700">
                                    Après avoir passé le test MBTI, vous recevrez des recommandations d'universités personnalisées basées sur votre
                                    type de personnalité et vos résultats académiques.
                                </p>

                                <p className="mb-4 text-gray-700">
                                    Vous pouvez explorer toutes les universités disponibles en cliquant sur "Universités" dans le menu. Utilisez les
                                    filtres pour affiner votre recherche selon différents critères:
                                </p>

                                <ul className="mb-4 list-inside list-disc space-y-2 text-gray-700">
                                    <li>Type d'établissement (public, privé)</li>
                                    <li>Localisation</li>
                                    <li>Domaine d'études</li>
                                    <li>Note minimale requise</li>
                                </ul>

                                <p className="text-gray-700">
                                    Cliquez sur une université pour voir ses détails, ses programmes et ses conditions d'admission.
                                </p>
                            </div>

                            {/* Nouvelle section 5: Chatbot Assistant */}
                            <div className="mb-8 rounded-lg border border-gray-200 p-6">
                                <h3 className="mb-4 text-lg font-medium text-[#1D7A85]">5. Chatbot Assistant Ofoqy</h3>
                                <p className="mb-4 text-gray-700">
                                    Notre chatbot intelligent est disponible 24/7 pour répondre à vos questions et vous guider dans votre parcours
                                    d'orientation.
                                </p>

                                <h4 className="mb-2 font-medium text-gray-800">Comment utiliser le chatbot</h4>
                                <p className="mb-4 text-gray-700">
                                    Cliquez sur l'icône de chat située en bas à droite de votre écran pour démarrer une conversation. Vous pouvez
                                    poser des questions sur:
                                </p>

                                <ul className="mb-4 list-inside list-disc space-y-2 text-gray-700">
                                    <li>Les filières universitaires</li>
                                    <li>Les débouchés professionnels</li>
                                    <li>Les conditions d'admission</li>
                                    <li>Votre type MBTI et ses implications</li>
                                    <li>Les fonctionnalités de la plateforme Ofoqy</li>
                                </ul>

                                <h4 className="mb-2 font-medium text-gray-800">Assistance personnalisée</h4>
                                <p className="text-gray-700">
                                    Si le chatbot ne peut pas répondre à votre question, vous avez la possibilité de demander une assistance humaine
                                    en cliquant sur "Contacter un conseiller".
                                </p>
                            </div>

                            {/* Nouvelle section 6: Packs d'orientation */}
                            <div className="mb-8 rounded-lg border border-gray-200 p-6">
                                <h3 className="mb-4 text-lg font-medium text-[#1D7A85]">6. Packs d'orientation Ofoqy</h3>
                                <p className="mb-4 text-gray-700">
                                    Pour vous accompagner dans votre orientation, Ofoqy propose plusieurs formules adaptées à vos besoins.
                                </p>

                                <h4 className="mb-2 font-medium text-gray-800">Pack Découverte (Gratuit)</h4>
                                <ul className="mb-4 list-inside list-disc space-y-2 text-gray-700">
                                    <li>Test MBTI complet</li>
                                    <li>Recommandations d'universités de base</li>
                                    <li>Accès au chatbot (limité)</li>
                                </ul>

                                <h4 className="mb-2 font-medium text-gray-800">Pack Premium</h4>
                                <ul className="mb-4 list-inside list-disc space-y-2 text-gray-700">
                                    <li>Analyse détaillée de votre personnalité</li>
                                    <li>Recommandations d'universités avancées</li>
                                    <li>Accès illimité au chatbot</li>
                                    <li>1 session de consultation individuelle avec un conseiller d'orientation</li>
                                    <li>Rapports PDF personnalisés</li>
                                </ul>

                                <h4 className="mb-2 font-medium text-gray-800">Pack Excellence</h4>
                                <ul className="mb-4 list-inside list-disc space-y-2 text-gray-700">
                                    <li>Tous les avantages du Pack Premium</li>
                                    <li>3 sessions de consultation individuelle</li>
                                    <li>Aide à la préparation des dossiers d'admission</li>
                                    <li>Ateliers exclusifs sur l'orientation professionnelle</li>
                                    <li>Mise en relation avec des étudiants et des professionnels</li>
                                </ul>

                                <p className="mt-4 text-gray-700">
                                    Pour plus d'informations sur nos packs ou pour souscrire, visitez la section "Offres" dans votre tableau de bord.
                                </p>
                            </div>

                            {/* Section déplacée en 7: FAQ */}
                            <div className="rounded-lg border border-gray-200 p-6">
                                <h3 className="mb-4 text-lg font-medium text-[#1D7A85]">7. Foire aux questions</h3>

                                <h4 className="mb-2 font-medium text-gray-800">Comment sont générées les recommandations?</h4>
                                <p className="mb-4 text-gray-700">
                                    Nos recommandations sont basées sur une analyse croisée entre votre type MBTI, vos résultats académiques et les
                                    caractéristiques des différentes filières universitaires.
                                </p>

                                <h4 className="mb-2 font-medium text-gray-800">Puis-je refaire le test MBTI?</h4>
                                <p className="mb-4 text-gray-700">
                                    Oui, vous pouvez refaire le test à tout moment en accédant à la section MBTI de votre profil.
                                </p>

                                <h4 className="mb-2 font-medium text-gray-800">Mes données sont-elles sécurisées?</h4>
                                <p className="mb-4 text-gray-700">
                                    Oui, nous prenons la sécurité de vos données très au sérieux. Toutes les informations sont cryptées et nous ne
                                    partageons jamais vos données personnelles avec des tiers sans votre consentement explicite.
                                </p>

                                <h4 className="mb-2 font-medium text-gray-800">Comment supprimer mon compte?</h4>
                                <p className="text-gray-700">
                                    Pour supprimer votre compte, cliquez sur "Supprimer le compte" dans votre profil. Attention, cette action est
                                    irréversible et toutes vos données seront définitivement supprimées.
                                </p>

                                <h4 className="mb-2 mt-4 font-medium text-gray-800">Les packs d'orientation sont-ils remboursables?</h4>
                                <p className="mb-4 text-gray-700">
                                    Oui, nous offrons un remboursement complet dans les 14 jours suivant l'achat si vous n'êtes pas satisfait de nos
                                    services.
                                </p>

                                <h4 className="mb-2 font-medium text-gray-800">Le chatbot peut-il remplacer un conseiller d'orientation?</h4>
                                <p className="text-gray-700">
                                    Le chatbot est un outil complémentaire mais ne remplace pas l'expertise d'un conseiller d'orientation
                                    professionnel. C'est pourquoi nos packs Premium et Excellence incluent des sessions avec de vrais conseillers.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Help;
