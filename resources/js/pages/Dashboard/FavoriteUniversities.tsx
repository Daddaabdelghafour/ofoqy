import UniversityCard from '@/components/UniversityCard';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../layouts/Dashboard-layout';

type Universite = {
    id: number;
    nom: string;
    type: string;
    localisation: string;
    site_web: string | null;
    seuils_admission: Record<string, Record<string, string>>;
    formations_proposees: string[];
    concours: boolean;
    etat_postulation: string;
};

type UniversitiesProps = {
    student: {
        nom_complet: string;
        filiere: string;
        profile_photo_path: string | null;
    };
};

const FavoriteUniversities: React.FC<UniversitiesProps> = ({ student }) => {
    const [favorites, setFavorites] = useState<Universite[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                setLoading(true);
                // Fetch favorite universities from your backend
                const response = await axios.get('/favorite-list');
                setFavorites(response.data.data);
                console.log(favorites);
            } catch (error) {
                console.error('Error fetching favorite universities:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFavorites();
    }, []);

    const handleViewDetails = (id: number) => {
        window.location.href = `/dashboard/universities/${id}`;
    };

    return (
        <DashboardLayout profile_picture_path={student.profile_photo_path || ''} name={student.nom_complet} level={student.filiere}>
            <div className="min-h-screen w-full px-3 sm:px-4 md:px-6">
                <h1 className="mb-4 mt-10 text-xl font-bold text-gray-800 sm:mb-6 sm:text-2xl">Mes universités favorites</h1>
                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
                    </div>
                ) : (
                    <>
                        <div className="rounded-lg bg-white p-[80px] shadow-sm">
                            {favorites.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                    {favorites.map((university) => (
                                        <div key={university.id} className="flex justify-between">
                                            <UniversityCard
                                                id={university.id}
                                                nom={university.nom}
                                                type={university.type}
                                                localisation={university.localisation}
                                                seuils_admission={university.seuils_admission}
                                                onViewDetails={handleViewDetails}
                                                isFavorite={true}
                                                onToggleFavorite={() => {
                                                    setFavorites((prev) => prev.filter((u) => u.id !== university.id));
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 text-center">
                                    <p className="text-gray-500">Aucune université favorite trouvée</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FavoriteUniversities;
