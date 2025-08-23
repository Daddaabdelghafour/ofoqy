import PostulationCard from '@/components/PostulationCard';
import DashboardLayout from '@/layouts/Dashboard-layout';
import { useState } from 'react';

type Universite = {
    id: number;
    nom: string;
    type: string;
    localisation: string;
    etat_postulation: string;
    date_ouverture: string | null;
    date_fermeture: string | null;
    site_web: string | null;
};

type PostulationsProps = {
    student: {
        nom_complet: string;
        filiere: string;
        profile_photo_path: string | null;
    };
    universites: Universite[];
};

const Postulations: React.FC<PostulationsProps> = ({ student, universites }) => {
    const [etatFilter, setEtatFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');

    const handleViewDetails = (id: number) => {
        window.location.href = `/dashboard/universities/${id}`;
    };

    // Filtering logic
    const filteredUniversites = universites.filter((u) => {
        const etatMatch = etatFilter ? u.etat_postulation === etatFilter : true;
        const typeMatch = typeFilter ? u.type.toLowerCase().includes(typeFilter.toLowerCase()) : true;
        const nameMatch = nameFilter ? u.nom.toLowerCase().includes(nameFilter.toLowerCase()) : true;
        return etatMatch && typeMatch && nameMatch;
    });

    return (
        <DashboardLayout name={student.nom_complet} level={student.filiere} profile_picture_path={student.profile_photo_path || ''}>
            <div className="mt-10 min-h-screen w-full px-3 sm:px-4 md:px-6">
                <h1 className="mb-4 text-xl font-bold text-gray-800 sm:mb-6 sm:text-2xl">Postulations</h1>
                {/* Filters */}
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <select value={etatFilter} onChange={(e) => setEtatFilter(e.target.value)} className="w-full rounded border px-3 py-2 sm:w-auto">
                        <option value="">Tous les états</option>
                        <option value="ouvert">Ouvert</option>
                        <option value="ferme">Fermé</option>
                    </select>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full rounded border px-3 py-2 sm:w-auto">
                        <option value="">Tous les types</option>
                        <option value="publique">Publique</option>
                        <option value="privee">Privée</option>
                    </select>
                    <select value={nameFilter} onChange={(e) => setNameFilter(e.target.value)} className="w-full rounded border px-3 py-2 sm:w-auto">
                        <option value="">Tous les noms</option>
                        {universites.map((u) => (
                            <option key={u.id} value={u.nom}>
                                {u.nom}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="grid grid-cols-1 gap-x-[1px] gap-y-[10px] sm:grid-cols-2 lg:grid-cols-3">
                    {filteredUniversites.map((u) => (
                        <PostulationCard
                            key={u.id}
                            id={u.id}
                            nom={u.nom}
                            type={u.type}
                            localisation={u.localisation}
                            etat_postulation={u.etat_postulation}
                            date_ouverture={u.date_ouverture}
                            date_fermeture={u.date_fermeture}
                            site_web={u.site_web}
                            onViewDetails={handleViewDetails}
                        />
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Postulations;
