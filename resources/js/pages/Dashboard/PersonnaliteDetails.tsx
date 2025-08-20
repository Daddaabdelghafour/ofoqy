import DashboardLayout from '@/layouts/Dashboard-layout';
import { ArrowLeft, ArrowRight, BadgeCheck, Brain, Eye, Heart, Lightbulb, Scale, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
const mbtiIcons: Record<string, React.ReactNode> = {
    S: <Eye className="h-6 w-6 text-[#1D7A85]" />, // Sensation
    C: <BadgeCheck className="h-6 w-6 text-[#1D7A85]" />, // Conscience
    P: <Brain className="h-6 w-6 text-[#1D7A85]" />, // Pensée
    L: <Lightbulb className="h-6 w-6 text-[#1D7A85]" />, // Logique
    T: <Scale className="h-6 w-6 text-[#1D7A85]" />, // Tempérance
    J: <BadgeCheck className="h-6 w-6 text-[#1D7A85]" />, // Jugement
    I: <Sparkles className="h-6 w-6 text-[#1D7A85]" />, // Intuition
    H: <Heart className="h-6 w-6 text-[#1D7A85]" />, // Humanisme
};

const mbtiMeanings: Record<string, string> = {
    S: 'Sensation',
    C: 'Conscience',
    P: 'Pensée',
    L: 'Logique',
    T: 'Tempérance',
    J: 'Jugement',
    I: 'Intuition',
    H: 'Humanisme',
};

interface Metier {
    id: number;
    nom: string;
    description: string;
    image_path?: string | null;
}

interface PersonnaliteDetailsProps {
    student: {
        id: number;
        nom_complet: string;
        email: string;
        ville: string;
        age: number;
        niveau_etude: string;
        filiere: string;
        moyenne_general_bac: number;
        profile_photo_path: string | null;
    };
    mbtiResult: {
        id: number;
        type_mbti: string;
        percentages: Record<string, number>; // <-- Ajoute cette ligne

        resultat_json: {
            message: string;
            generated_at: string;
            generated_by: string;
        };
        created_at: string;
    } | null;
    hasCompletedTest: boolean;
    mbtiType: string | null;
    shortName: string;
    metiers: Metier[];
}

const PersonnaliteDetails = ({ student, mbtiResult, shortName, metiers }: PersonnaliteDetailsProps) => {
    const [favoritesMetiers, setFavoritesMetiers] = useState<number[]>([]);

    // Favoris métiers
    const handleToggleFavoriteMetier = (id: number) => {
        setFavoritesMetiers((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    };

    useEffect(() => {
        const saved = localStorage.getItem('favoritesMetiers');
        if (saved) {
            setFavoritesMetiers(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('favoritesMetiers', JSON.stringify(favoritesMetiers));
    }, [favoritesMetiers]);

    const percentagesArray = mbtiResult?.percentages
        ? Object.entries(mbtiResult.percentages).map(([letter, percent]) => ({
              letter,
              percent,
          }))
        : [
              { letter: 'S', percent: 65 },
              { letter: 'C', percent: 35 },
              { letter: 'P', percent: 40 },
              { letter: 'L', percent: 60 },
          ];
    return (
        <DashboardLayout profile_picture_path={student.profile_photo_path || ''} name={student.nom_complet} level={student.filiere}>
            <div className="flex min-h-screen w-[1200px] flex-col items-start gap-5">
                {/* Informations de l'étudiant + button 'commencer le test' */}
                <div className="flex w-full items-center justify-between p-10">
                    <div className="flex flex-col gap-5">
                        <div className="flex gap-3">
                            <a href="/Profile">
                                <ArrowLeft />
                            </a>

                            <p className="text-lg font-bold">
                                Bienvenu , <span className="uppercase text-primary-1000">{student.nom_complet}</span>
                            </p>
                        </div>
                        <div>
                            <p className="px-9 text-sm font-semibold">
                                Tu est un {mbtiResult?.type_mbti} - {shortName}{' '}
                            </p>
                        </div>
                    </div>
                    <div>
                        {mbtiResult?.type_mbti ? (
                            <button
                                type="submit"
                                className="flex items-center gap-3 rounded-md border border-b-2 border-[#1D7A85] bg-white px-6 py-3 text-sm font-medium text-[#1D7A85] hover:bg-[#ffffff4d]"
                                onClick={() => {
                                    window.location.href = '/MBTI';
                                }}
                            >
                                <img src="/images/speed.png" alt="" />
                                Recommencer Le test
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="flex items-center gap-3 rounded-md border border-b-2 border-[#1D7A85] bg-white px-6 py-3 text-sm font-medium text-[#1D7A85] hover:bg-[#ffffff4d]"
                            >
                                <img src="/images/speed.png" alt="" />
                                Commencer Le test
                            </button>
                        )}
                    </div>
                </div>
                {/* Résultats du test */}
                <div className="px-[78px] text-3xl font-semibold text-[#1D7A85]">Le résultat de votre test de personnalité MBTI</div>
                {/* Contenu des détails */}
                <div className="grid grid-cols-1 gap-8 px-[78px] py-10 md:grid-cols-2">
                    {/* Colonne 1 */}
                    <div className="min-h-[554px] rounded-lg bg-white p-6 shadow">
                        <p className="mb-5 text-xl font-semibold text-[#191919]">Votre personnalité est la suivante : </p>
                        {mbtiResult?.type_mbti ? (
                            // split characters
                            <div className="flex items-center gap-[30px]">
                                {mbtiResult?.type_mbti.split('').map((char, index) => (
                                    <span
                                        key={index}
                                        className={`mb-2 mr-2 inline-block rounded-sm bg-[#70809029] px-9 py-7 text-xl font-medium text-[#4682B4]`}
                                    >
                                        {char}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-700">Aucun résultat disponible.</p>
                        )}
                        {/* Détails supplémentaires */}
                        <div className="mt-8 min-h-full">
                            <p className="text-md line-height-[0.8px] text-[16px] font-normal text-[#708090]">
                                {mbtiResult?.resultat_json.message}
                            </p>{' '}
                        </div>
                    </div>
                    {/* Colonne 2 */}
                    <div className="rounded-lg bg-white p-6 shadow">
                        <ul className="space-y-5">
                            {percentagesArray.map(({ letter, percent }) => (
                                <li key={letter} className="flex items-center gap-4">
                                    {/* Icône Lucide à gauche */}
                                    <span className="mt-5 flex h-10 w-10 items-center justify-center rounded-sm bg-gray-300">
                                        {mbtiIcons[letter]}
                                    </span>
                                    {/* Percentage and bar */}
                                    <div className="ml-auto w-full">
                                        <div className="mb-1 flex items-center justify-between">
                                            <span className="font-semibold text-gray-700">
                                                {mbtiMeanings[letter] || letter} {'(' + letter + ')'}
                                            </span>
                                            <span className="text-sm text-[#1D7A85]">{percent}%</span>
                                        </div>
                                        <div className="h-5 w-full rounded-sm bg-gray-200">
                                            <div
                                                className="h-5 rounded-sm bg-[#1D7A85] transition-all duration-500"
                                                style={{ width: `${percent}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                {/* Recommendations */}
                <div className="">
                    <p className="px-[80px] text-2xl font-semibold">Recommendations Pour vous</p>

                    {/* Carte de recommendations selon le type mbti */}
                    {/* Recommendations Métiers */}
                    <div className="mt-8 px-[80px]">
                        <p className="mb-6 text-xl font-semibold">Métiers recommandés</p>
                        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                            {metiers.map((item) => (
                                <div
                                    key={item.id}
                                    className="relative flex flex-col items-center rounded-lg border border-primary-1000 bg-white shadow-sm transition-shadow hover:shadow-md"
                                >
                                    {item.image_path ? (
                                        <img src={item.image_path} className="h-40 w-full rounded object-cover" alt={item.nom} />
                                    ) : (
                                        <img className="h-40 w-full rounded object-cover" src="/images/SpaceMan.png" alt="default" />
                                    )}
                                    <button onClick={() => handleToggleFavoriteMetier(item.id)} className="absolute right-3 top-3 z-10">
                                        <Heart
                                            className="h-7 w-7 rounded bg-primary-1000 p-0.5 text-white"
                                            fill={favoritesMetiers.includes(item.id) ? 'white' : 'none'}
                                        />
                                    </button>
                                    <div className="m-3 min-w-full pl-4 text-start text-[15px] font-semibold tracking-[0.37px]">{item.nom}</div>
                                    <div className="min-w-full pl-4 text-start text-[12px] font-medium tracking-[0.37px] text-[#7C7C7C]">
                                        {item.description.split('.')[0]}
                                    </div>
                                    <div className="my-5 min-w-full p-4">
                                        <button
                                            onClick={() => (window.location.href = '')}
                                            className="btn btn-primary mt-4 flex min-w-full justify-center border-primary-600 px-10 text-[15px] font-medium leading-[19.95px] tracking-[0.37px] hover:bg-white hover:text-primary-1000 md:mt-0"
                                        >
                                            Découvrir
                                            <ArrowRight className="ml-1 pb-1 pt-1" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PersonnaliteDetails;
