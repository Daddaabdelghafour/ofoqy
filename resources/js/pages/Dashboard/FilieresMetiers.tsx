// resources/js/components/FilterForm.tsx
import DashboardLayout from '@/layouts/Dashboard-layout';
import { ArrowRight, Heart } from 'lucide-react';
import { useRef, useState } from 'react';
interface DashboardProps {
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
        resultat_json: {
            message: string;
            generated_at: string;
            generated_by: string;
        };
        created_at: string;
        student_id: number;
    } | null;
    metiers: {
        id: number;
        nom: string;
        description: string;
        image_path: string;
        type: string;
    }[];
    filieres: {
        id: number;
        nom: string;
        description: string;
        image_path: string;
        type: string;
    }[];
}

function FilieresMetiers({ student, mbtiResult, metiers, filieres }: DashboardProps) {
    const [search, setSearch] = useState('');
    const [secteur, setSecteur] = useState('');
    const [mbti, setMbti] = useState('');
    const [favorites, setFavorites] = useState<number[]>([]);
    const [filteredResults, setFilteredResults] = useState<
        {
            id: number;
            nom: string;
            description: string;
            image_path: string;
            type: string;
        }[]
    >([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const contentRef = useRef<HTMLDivElement>(null);

    // Include both metiers and filieres names
    const allNames = [...metiers.map((metier) => metier.nom), ...filieres.map((filiere) => filiere.nom)].sort((a, b) => a.localeCompare(b));
    const allOptions = [...metiers, ...filieres];
    const domaines = [
        'Audit',
        'Civil',
        'Commerce',
        'Communication',
        'Comptabilit',
        'Droit',
        'Finance',
        'Gestion',
        'Génie',
        'Industrie',
        'Informatique',
        'Ingénieur',
        'Logistique',
        'Marketing',
        'Mécanique',
        'Procédés',
        'Production',
        'Programmation',
        'Ressources',
        'Réseaux',
        'Télécommunications',
    ];
    const handleToggleFavorite = (index: number) => {
        setFavorites((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
    };

    const handleSearch = async () => {
        if (!search && !secteur && !mbti) {
            setIsFiltered(false);
            return;
        }

        const filters = {
            search,
            secteur,
            mbti,
        };
        try {
            const response = await fetch('/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(filters),
            });

            const data = await response.json();
            setFilteredResults(data);
            setIsFiltered(true);
            console.log('Résultats:', data);
        } catch (error) {
            console.error('Erreur:', error);
            setIsFiltered(false);
        }
    };

    const items = isFiltered ? filteredResults : allOptions;
    const totalPages = Math.ceil(items.length / pageSize);
    const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return (
        <DashboardLayout profile_picture_path={student.profile_photo_path || ''} name={student.nom_complet} level={student.filiere}>
            <div className="mt-4 min-w-full pl-4 pt-5">
                <span className="text-[28px] font-medium text-[#191919]">Acceuil</span>
                <div className="my-6 min-w-full rounded-[4px] border border-l-[4px] border-primary-1000">
                    <div className="h-[58px] bg-[#1D7A8530] p-4 pl-8 text-[16px] font-medium tracking-normal">Afficher tous les filtres</div>
                    <div className="gap 4 flex justify-around px-10 py-4">
                        <div className="flex flex-col gap-2 text-[14px] font-medium text-[#5B5B5B]">
                            <label>Recherche par Nom</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Commencez à taper..."
                                list="name-options"
                                className="w-full rounded-[3px] border border-gray-300 p-2 pl-4"
                            />
                            <datalist id="name-options">
                                {allNames.map((option, index) => (
                                    <option key={index} value={option} />
                                ))}
                            </datalist>
                        </div>
                        <div className="flex flex-col gap-2 text-[14px] font-medium text-[#5B5B5B]">
                            <label>Recherche par Branche</label>
                            <select
                                value={secteur}
                                onChange={(e) => setSecteur(e.target.value)}
                                className="w-full rounded border border-gray-300 p-2 pl-4"
                            >
                                <option value="">Tous les secteurs</option>
                                {domaines.map((domaine, index) => (
                                    <option key={index} value={domaine}>
                                        {domaine}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2 text-[14px] font-medium text-[#5B5B5B]">
                            <label>Recherche par Type de Personnalité</label>
                            <select value={mbti} onChange={(e) => setMbti(e.target.value)} className="w-full rounded border border-gray-300 p-2 pl-4">
                                <option value="">Tous les types</option>
                                <option value="INTJ">INTJ </option>
                                <option value="INTP">INTP </option>
                                <option value="ENTJ">ENTJ </option>
                                <option value="ENTP">ENTP </option>
                                <option value="INFJ">INFJ </option>
                                <option value="INFP">INFP </option>
                                <option value="ENFJ">ENFJ </option>
                                <option value="ENFP">ENFP </option>
                                <option value="ISTJ">ISTJ </option>
                                <option value="ISFJ">ISFJ </option>
                                <option value="ESTJ">ESTJ </option>
                                <option value="ESFJ">ESFJ </option>
                                <option value="ISTP">ISTP </option>
                                <option value="ISFP">ISFP </option>
                                <option value="ESTP">ESTP </option>
                                <option value="ESFP">ESFP </option>
                            </select>
                        </div>
                        <div className="flex flex-col">
                            <div className="flex-1"></div>
                            <button
                                onClick={handleSearch}
                                className="rounded-[3px] bg-[#1D7A85] px-6 py-2 text-[14px] font-normal text-white hover:bg-[#155B60]"
                            >
                                Recherche
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-w-full">
                <span className="p-5 text-[28px] font-medium text-[#191919]">Filières et métiers</span>
                <div className="m-5 mt-7 grid grid-cols-3 gap-7 bg-white p-8">
                    {paginatedItems.map((item, index) => (
                        <div
                            key={index}
                            className="relative flex flex-col items-center rounded-lg border border-primary-1000 bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                            {item.image_path ? (
                                <img src={item.image_path} className="max-h-[200px] w-full rounded object-cover" />
                            ) : (
                                <img className="max-h-[200px] w-full rounded object-cover" src="/images/SpaceMan.png"></img>
                            )}
                            <button onClick={() => handleToggleFavorite(index)} key={index}>
                                <Heart
                                    className="absolute right-3 top-3 z-10 h-7 w-7 bg-primary-1000 p-0.5 text-white"
                                    fill={favorites.includes(index) ? 'white' : 'none'}
                                />
                            </button>
                            <div className="m-3 min-w-full pb-2 pl-4 text-start text-[15px] font-semibold tracking-[0.37px]">{item.nom}</div>
                            <div className="mb-2 h-[70px] min-w-full pl-4 text-start text-[12px] font-medium tracking-[0.37px] text-[#7C7C7C]">
                                {item.description.split('.')[0]}
                            </div>
                            <div className="my-5 min-w-full px-4 py-4">
                                <button
                                    onClick={() => (window.location.href = '/dashboard/filieres-metiers/' + item.id + '/' + item.type)}
                                    className="btn btn-primary mt-4 flex min-w-full justify-center border-primary-600 px-10 text-[15px] font-medium leading-[19.95px] tracking-[0.37px] hover:bg-white hover:text-primary-1000 md:mt-0"
                                >
                                    Découvrir
                                    <ArrowRight className="ml-1 pb-1 pt-1" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="my-4 flex items-center justify-center gap-2">
                    <button
                        disabled={page === 1}
                        onClick={() => {
                            setPage(page - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn btn-primary border-3 rounded border border-primary-1000 bg-primary-1000 px-4 py-2 text-white hover:bg-white hover:text-primary-1000 disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span>
                        {page} / {totalPages}
                    </span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => {
                            setPage(page + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn btn-primary border-3 rounded border border-primary-1000 bg-primary-1000 px-4 py-2 text-white hover:bg-white hover:text-primary-1000 disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
}

export default FilieresMetiers;
