import axios from 'axios';
import React, { useEffect, useState } from 'react';
import UniversityCard from '../../components/UniversityCard';
import DashboardLayout from '../../layouts/Dashboard-layout';

// Define types based on your model
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

type PaginationData = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
};

type UniversitiesProps = {
    student: {
        nom_complet: string;
        filiere: string;
        profile_photo_path: string | null;
    };
};

const Universities: React.FC<UniversitiesProps> = ({ student }) => {
    const [universities, setUniversities] = useState<Universite[]>([]);
    const [loading, setLoading] = useState(true);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [pagination, setPagination] = useState<PaginationData>({
        total: 0,
        per_page: 12,
        current_page: 1,
        last_page: 1,
    });

    // Updated filters with new fields
    const [filters, setFilters] = useState({
        nom: '',
        filiere: '',
        branche: '',
        ville: '',
        seuil: '',
        type: '',
        concours: false,
        ouvert: false,
    });

    const fetchFavoriteIds = async () => {
        try {
            const response = await axios.get('/favorite-ids');
            setFavorites(response.data.favorites);
            console.log(favorites);
        } catch (error) {
            console.error('Error fetching favorite IDs:', error);
        }
    };

    const fetchUniversities = async (page = 1) => {
        try {
            setLoading(true);

            // Build query parameters with all filters
            const params = new URLSearchParams();
            params.append('page', page.toString());

            if (filters.nom) params.append('nom', filters.nom);
            if (filters.filiere) params.append('filiere', filters.filiere);
            if (filters.branche) params.append('branche', filters.branche);
            if (filters.ville) params.append('ville', filters.ville);
            if (filters.seuil) params.append('seuil', filters.seuil);
            if (filters.type) params.append('type', filters.type);
            if (filters.concours) params.append('concours', 'true');
            if (filters.ouvert) params.append('ouvert', 'true');

            const response = await axios.get(`/universites?${params.toString()}`);
            console.log(response.data.data[0].seuils_admission);
            setUniversities(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching universities:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniversities();
        fetchFavoriteIds();
    }, []);

    const handleViewDetails = (id: number) => {
        window.location.href = `/dashboard/universities/${id}`;
    };

    const handleToggleFavorite = async (id: number, isFavorite: boolean) => {
        try {
            await axios.post('/favorite', {
                universite_id: id,
                is_favorite: isFavorite,
            });
            // Optionally update local state for UI feedback
            setFavorites(isFavorite ? [...favorites, id] : favorites.filter((favId) => favId !== id));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du favori:', error);
        }
    };

    const handlePageChange = (page: number) => {
        fetchUniversities(page);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;

        setFilters((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleFilterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchUniversities(1);
    };

    return (
        <DashboardLayout name={student.nom_complet} level={student.filiere}>
            <div className="min-h-screen w-full px-3 sm:px-4 md:px-6">
                <h1 className="mb-4 text-xl font-bold text-gray-800 sm:mb-6 sm:text-2xl">Universités</h1>

                {/* Enhanced Filters */}
                <div className="mb-4 rounded-lg bg-white p-3 shadow-sm sm:mb-6 sm:p-4">
                    <form onSubmit={handleFilterSubmit}>
                        <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Nom</label>
                                <input
                                    type="text"
                                    name="nom"
                                    value={filters.nom}
                                    onChange={handleFilterChange}
                                    placeholder="Nom de l'université..."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Filière</label>
                                <input
                                    type="text"
                                    name="filiere"
                                    value={filters.filiere}
                                    onChange={handleFilterChange}
                                    placeholder="Filière..."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Branche</label>
                                <select
                                    name="branche"
                                    value={filters.branche}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                >
                                    <option value="">Toutes les branches</option>
                                    <option value="sciences_maths_a">Sciences Mathématiques A</option>
                                    <option value="sciences_maths_b">Sciences Mathématiques B</option>
                                    <option value="sciences_physiques">Sciences Physiques</option>
                                    <option value="sciences_svt">Sciences SVT</option>
                                    <option value="economie">Sciences Économiques</option>
                                    <option value="lettres">Lettres</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Ville</label>
                                <input
                                    type="text"
                                    name="ville"
                                    value={filters.ville}
                                    onChange={handleFilterChange}
                                    placeholder="Ville..."
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Seuil minimum</label>
                                <input
                                    type="number"
                                    name="seuil"
                                    value={filters.seuil}
                                    onChange={handleFilterChange}
                                    placeholder="Ex: 13.5"
                                    min="0"
                                    max="20"
                                    step="0.1"
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Type</label>
                                <select
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                                >
                                    <option value="">Tous</option>
                                    <option value="publique">Publique</option>
                                    <option value="privee">Privée</option>
                                </select>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="concours"
                                    id="concours"
                                    checked={filters.concours}
                                    onChange={handleFilterChange}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor="concours" className="ml-2 block text-sm text-gray-700">
                                    Avec concours
                                </label>
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="ouvert"
                                    id="ouvert"
                                    checked={filters.ouvert}
                                    onChange={handleFilterChange}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                                <label htmlFor="ouvert" className="ml-2 block text-sm text-gray-700">
                                    Ouvert aux inscriptions
                                </label>
                            </div>

                            <div className="flex items-end">
                                <button type="submit" className="rounded-md bg-[#1D7A85] px-4 py-2 text-sm font-medium text-white hover:bg-[#18656e]">
                                    Filtrer
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {loading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-500"></div>
                    </div>
                ) : (
                    <>
                        {/* Card Layout - FIXED */}
                        <div className="rounded-lg bg-white p-[150px] shadow-sm sm:p-[80px]">
                            {universities.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                                    {universities.map((university) => (
                                        <div key={university.id} className="flex justify-between">
                                            <UniversityCard
                                                id={university.id}
                                                nom={university.nom}
                                                type={university.type}
                                                localisation={university.localisation}
                                                seuils_admission={university.seuils_admission}
                                                onViewDetails={handleViewDetails}
                                                onToggleFavorite={handleToggleFavorite}
                                                isFavorite={favorites.includes(university.id)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-10 text-center">
                                    <p className="text-gray-500">Aucune université trouvée</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination - Responsive */}
                        {pagination.last_page > 1 && (
                            <div className="mt-4 flex justify-center sm:mt-8">
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm" aria-label="Pagination">
                                    {/* Previous Page Arrow */}
                                    <button
                                        onClick={() => handlePageChange(Math.max(1, pagination.current_page - 1))}
                                        disabled={pagination.current_page === 1}
                                        className={`relative inline-flex items-center rounded-l-md border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 ${
                                            pagination.current_page === 1
                                                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">Page précédente</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 sm:h-5 sm:w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>

                                    {/* Page Indicator */}
                                    <span className="relative inline-flex items-center border-y border-gray-300 bg-white px-2 py-1 text-xs font-medium text-gray-700 sm:px-4 sm:py-2 sm:text-sm">
                                        {pagination.current_page} / {pagination.last_page}
                                    </span>

                                    {/* Next Page Arrow */}
                                    <button
                                        onClick={() => handlePageChange(Math.min(pagination.last_page, pagination.current_page + 1))}
                                        disabled={pagination.current_page === pagination.last_page}
                                        className={`relative inline-flex items-center rounded-r-md border border-gray-300 px-2 py-1 sm:px-3 sm:py-2 ${
                                            pagination.current_page === pagination.last_page
                                                ? 'cursor-not-allowed bg-gray-100 text-gray-400'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <span className="sr-only">Page suivante</span>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 sm:h-5 sm:w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Universities;
