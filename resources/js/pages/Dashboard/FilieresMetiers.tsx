// resources/js/components/FilterForm.tsx
import React, { useRef, useState } from 'react';
import DashboardLayout from '@/layouts/Dashboard-layout'; 
import { ArrowRight, Heart } from 'lucide-react';
import { StringToBoolean } from 'class-variance-authority/types';
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
        profile_picture_path: string | null;
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
    metiers:{
        id: number;
        nom: string;
        description: string;
        image_path: string;
        type: string;
    }[];
    filieres:{
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
    const [filteredResults, setFilteredResults] = useState<{
        id:number;
        nom: string;
        description: string;
        image_path: string;
        type: string;
    }[]>([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [page, setPage] = useState(1);
    const pageSize = 12;
    const contentRef = useRef<HTMLDivElement>(null);


    // Include both metiers and filieres names
    const allNames = [
        ...metiers.map(metier => metier.nom),
        ...filieres.map(filiere => filiere.nom)
    ].sort((a, b) => a.localeCompare(b));
    const allOptions = [...metiers, ...filieres];
    const domaines = [
        "Audit",
        "Civil",
        "Commerce",
        "Communication",
        "Comptabilit",
        "Droit",
        "Finance",
        "Gestion",
        "Génie",
        "Industrie",
        "Informatique",
        "Ingénieur",
        "Logistique",
        "Marketing",
        "Mécanique",
        "Procédés",
        "Production",
        "Programmation",
        "Ressources",
        "Réseaux",
        "Télécommunications"
        ];
    const handleToggleFavorite = (index: number) => {
        setFavorites(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };    
        
    const handleSearch = async () => {
        if (!search && !secteur && !mbti) {
            setIsFiltered(false);
            return;
        }
    
        const filters = {
            search,
            secteur,
            mbti
        };
        try {
            const response = await fetch('/filter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: JSON.stringify(filters)
                });

                const data = await response.json();
                setFilteredResults(data); 
                setIsFiltered(true); 
                console.log('Résultats:', data);
                
            } catch (error) {
                console.error('Erreur:', error);
                setIsFiltered(false);
            }
        }

        const items = isFiltered ? filteredResults : allOptions;
        const totalPages = Math.ceil(items.length / pageSize);
        const paginatedItems = items.slice((page - 1) * pageSize, page * pageSize);

    return (
        <DashboardLayout name={student.nom_complet} level={student.filiere} profile_picture_path={student.profile_picture_path || ''}>
            <div className='mt-4 pt-5 min-w-full pl-4'>
                <span className='font-medium text-[28px] text-[#191919]'>Acceuil</span>
                <div className='min-w-full border border-primary-1000 border-l-[4px] rounded-[4px] my-6'>
                    <div className='p-4 pl-8 tracking-normal bg-[#1D7A8530] font-medium text-[16px] h-[58px]'>Afficher tous les filtres</div>
                    <div className='px-10 py-4 flex justify-around gap 4'>
                        <div className='flex flex-col gap-2 font-medium text-[14px] text-[#5B5B5B]'>
                            <label>Recherche par Nom</label>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Commencez à taper..."
                                list="name-options"
                                className="w-full p-2 pl-4 border border-gray-300 rounded-[3px]"
                            />
                            <datalist id="name-options">
                                {allNames.map((option, index) => (
                                    <option key={index} value={option} />
                                ))}
                            </datalist>
                        </div>
                        <div className='flex flex-col gap-2 font-medium text-[14px] text-[#5B5B5B]'>
                            <label>Recherche par Branche</label>
                            <select
                                value={secteur}
                                onChange={(e) => setSecteur(e.target.value)}
                                className="w-full p-2 pl-4 border border-gray-300 rounded"
                            >
                                <option value="">Tous les secteurs</option>
                                {domaines.map((domaine, index) => (
                                    <option key={index} value={domaine}>{domaine}</option>
                                ))}
                            </select>
                        </div>
                        <div className='flex flex-col gap-2 font-medium text-[14px] text-[#5B5B5B]'>
                            <label>Recherche par Type de Personnalité</label>
                            <select
                                value={mbti}
                                onChange={(e) => setMbti(e.target.value)}
                                className="w-full p-2 pl-4 border border-gray-300 rounded"
                            >
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
                        <div className='flex flex-col'>
                            <div className='flex-1'></div>
                            <button
                                onClick={handleSearch}
                                className="bg-[#1D7A85] text-white px-6 py-2 rounded-[3px] hover:bg-[#155B60] text-[14px] font-normal"
                            >
                                Recherche
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className=' min-w-full '>
                <span className='font-medium text-[28px] text-[#191919] p-5'>Filières et métiers</span>
                <div className="grid grid-cols-3 gap-7 p-8 bg-white m-5 mt-7">
                    {paginatedItems.map((item, index) => (
                    <div
                        key={index}
                        className="  border relative border-primary-1000 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col items-center "
                    >
                        {item.image_path ? (
                        <img
                            src={item.image_path}
                            className=" w-full h-40 object-cover rounded"
                        />
                        ) : (
                        <img className=" w-full h-40 object-cover rounded" src="/images/SpaceMan.png"></img>
                        )}
                        <button onClick={() => handleToggleFavorite(index)} key={index}>
                            <Heart
                                className="h-7 w-7 absolute right-3 top-3 z-10 text-white bg-primary-1000 p-0.5"
                                fill={favorites.includes(index) ? 'white' : 'none'}
                            />
                        </button>
                        <div className=' min-w-full text-start font-semibold text-[15px] tracking-[0.37px] m-3 pl-4 pb-2 '>{item.nom}</div>
                        <div className=' min-w-full text-start font-medium text-[12px] tracking-[0.37px] pl-4 text-[#7C7C7C] h-[70px] mb-2'>{item.description.split('.')[0]}</div>
                        <div className=' min-w-full my-5 py-4 px-4  '>
                            <button onClick={()=>window.location.href='/dashboard/filieres-metiers/' + item.id+'/'+item.type} className="btn btn-primary min-w-full px-10 flex justify-center mt-4 md:mt-0 hover:bg-white hover:text-primary-1000 border-primary-600 font-medium text-[15px] leading-[19.95px] tracking-[0.37px]">
                                Découvrir
                                <ArrowRight className="pt-1 pb-1 ml-1" />
                            </button>
                        </div>
                    
                    </div>
                    ))}
                </div>
                <div className="flex justify-center items-center gap-2 my-4">
                    <button
                        disabled={page === 1}
                        onClick={() => {
                            setPage(page - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn btn-primary px-4 py-2 rounded bg-primary-1000 text-white hover:bg-white hover:text-primary-1000 border border-primary-1000 border-3 disabled:opacity-50"
                    >
                        Précédent
                    </button>
                    <span>{page} / {totalPages}</span>
                    <button
                        disabled={page === totalPages}
                        onClick={() => {
                            setPage(page + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="btn btn-primary px-4 py-2 rounded bg-primary-1000 text-white hover:bg-white hover:text-primary-1000 border border-primary-1000 border-3  disabled:opacity-50"
                    >
                        Suivant
                    </button>
                </div>
            </div>
        </DashboardLayout>
    );
} 

export default FilieresMetiers;