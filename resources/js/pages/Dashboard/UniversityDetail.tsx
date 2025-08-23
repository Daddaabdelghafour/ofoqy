import { getUniversityImagePath } from '@/helpers/UniversityImageHelper';
import DashboardLayout from '@/layouts/Dashboard-layout';
import axios from 'axios';
import { ArrowRight, Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

type UniversitiesProps = {
    student: {
        nom_complet: string;
        filiere: string;
        profile_photo_path: string | null;
    };
    id: string;
};

// Define types for our university data
type University = {
    id: number;
    nom: string;
    type: string;
    localisation: string;
    site_web: string | null;
    annee_creation: string | null;
    universite_rattachement: string | null;
    accreditation: boolean;
    nombre_annees_etude: number | null;
    bac_obligatoire: boolean;
    concours: boolean;
    seuils_admission: string;
    formations_proposees: string;
    mission_objectifs: string | null;
    conditions_admission: string;
    deroulement_concours: string;
    date_fermeture: string | null;
    date_ouverture: string | null;
    etat_postulation: string;
};

const UniversityDetail = ({ student, id }: UniversitiesProps) => {
    const [university, setUniversity] = useState<University | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [currentYear, setCurrentYear] = useState<string>('');

    // Helper function to safely parse JSON
    const safeJsonParse = <T,>(jsonString: string | null, defaultValue: T): T => {
        if (!jsonString) return defaultValue;
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            console.error('Error parsing JSON:', e);
            return defaultValue;
        }
    };

    const fetchFavoriteStatus = async () => {
        try {
            const response = await axios.get(`/is-favorite/${id}`);
            setIsFavorite(response.data.is_favorite);
        } catch (error) {
            console.error('Error fetching favorite status:', error);
        }
    };

    function formatDate(dateStr: string | null) {
        if (!dateStr) return 'N/A';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return 'N/A';
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    useEffect(() => {
        // Fetch university data
        const fetchUniversity = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/universites/${id}`);
                console.log('University data:', response.data);
                setUniversity(response.data);

                // Set current year for seuils if available
                const seuilsData = safeJsonParse<Record<string, Record<string, string>>>(response.data.seuils_admission, {});

                if (Object.keys(seuilsData).length > 0) {
                    setCurrentYear(Object.keys(seuilsData)[0]);
                }
            } catch (err) {
                console.error('Error fetching university details:', err);
                setError('Impossible de charger les détails de cette université.');
            } finally {
                setLoading(false);
            }
        };

        fetchUniversity();
        fetchFavoriteStatus();
    }, [id]);

    const handleToggleFavorite = async () => {
        try {
            await axios.post('/favorite', {
                universite_id: Number(id),
                is_favorite: !isFavorite,
            });
            setIsFavorite(!isFavorite);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du favori:', error);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen">
                <DashboardLayout profile_picture_path={student.profile_photo_path || ''} name={student.nom_complet} level={student.filiere}>
                    <div className="flex h-screen items-center justify-center">
                        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#1D7A85]"></div>
                    </div>
                </DashboardLayout>
            </div>
        );
    }

    // Error state
    if (error || !university) {
        return (
            <div className="min-h-screen">
                <DashboardLayout name={student.nom_complet} level={student.filiere}>
                    <div className="flex h-screen flex-col items-center justify-center px-4 text-center">
                        <img src="/images/Logo.png" alt="Error" className="mb-6 h-24 w-24" />
                        <h2 className="mb-2 text-xl font-bold text-gray-800">Oups! Une erreur s'est produite</h2>
                        <p className="mb-6 text-gray-600">{error || "Cette université n'a pas pu être trouvée."}</p>
                        <a
                            href="/dashboard/universities"
                            className="rounded-md bg-[#1D7A85] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#166770]"
                        >
                            Retour à la liste des universités
                        </a>
                    </div>
                </DashboardLayout>
            </div>
        );
    }

    // Parse JSON data from string fields
    const seuilsAdmission = safeJsonParse<Record<string, Record<string, string>>>(university.seuils_admission, {});
    const formationsProposees = safeJsonParse<string[]>(university.formations_proposees, []);
    const conditionsAdmission = safeJsonParse<string[]>(university.conditions_admission, []);
    const deroulementConcours = safeJsonParse<{ etape: string; description: string }[]>(university.deroulement_concours, []);

    // Check if seuils_admission is valid
    const hasSeuils = Object.keys(seuilsAdmission).length > 0;

    // Helper to check if array is valid and non-empty
    const isValidArray = <T,>(arr: T[]) => arr && Array.isArray(arr) && arr.length > 0;

    // Helper to check if string is not empty
    const isValidString = (str: string | null | undefined) => str && str.trim() !== '';

    return (
        <div className="min-h-screen">
            <DashboardLayout name={student.nom_complet} level={student.filiere}>
                <div className="min-h-screen px-4 py-6 md:p-8 lg:p-10">
                    {/* Header Section with Background and Logo */}
                    <div className="relative mb-6 w-full">
                        <div
                            className="h-[180px] w-full rounded-lg bg-cover bg-center bg-no-repeat sm:h-[200px] md:h-[233px]"
                            style={{
                                backgroundImage: `url('/${getUniversityImagePath(university.id)}')`,
                            }}
                        >
                            {/* School Logo - Responsive Positioning */}
                            <div className="absolute bottom-0 left-5 h-[100px] w-[100px] translate-y-1/2 overflow-hidden rounded-full border-4 border-white bg-white shadow-md sm:h-[130px] sm:w-[130px] md:h-[150px] md:w-[150px]">
                                <img
                                    src={'/' + getUniversityImagePath(university.id)}
                                    className="h-full w-full object-contain p-2"
                                    alt={university.nom}
                                />
                            </div>
                        </div>
                    </div>

                    {/* School Name - With space for the logo */}
                    <div className="mb-8 ml-[120px] sm:ml-[150px] md:ml-[180px]">
                        <h1 className="text-xl font-bold text-gray-800 sm:text-2xl md:text-3xl">{university.nom}</h1>
                    </div>

                    {/* Info and Action Buttons */}
                    <div className="flex flex-col gap-6 sm:flex-row sm:justify-between">
                        {/* School Information */}
                        <div className="flex flex-wrap gap-6">
                            <div className="flex items-center gap-2">
                                <img src="/images/localisation.png" className="h-5 w-5" alt="Location icon" />
                                <p className="font-semibold text-gray-700">{university.localisation || 'Maroc'}</p>
                            </div>

                            <div className="flex items-center gap-2">
                                <img src="/images/campus.png" className="h-5 w-5" alt="Campus icon" />
                                <p className="font-semibold text-gray-700">1 Campus</p>
                            </div>

                            {isValidString(university.date_ouverture) ? (
                                <div className="flex items-center gap-2">
                                    <img src="/images/calendry.png" className="h-5 w-5" alt="Calendar icon" />
                                    <p className="font-semibold text-red-600">Date de postulation : {formatDate(university.date_ouverture)}</p>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <img src="/images/calendry.png" className="h-5 w-5" alt="Calendar icon" />
                                    <p className="font-semibold text-gray-600">Date de postulation non spécifiée</p>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={handleToggleFavorite}
                                className="flex items-center justify-center gap-2 rounded-md border border-[#1D7A85] bg-white px-4 py-2 text-sm font-medium text-[#1D7A85] transition-colors hover:bg-gray-50"
                            >
                                <Heart size={16} className={isFavorite ? 'fill-[#1D7A85]' : ''} />
                                <span>Ajouter Aux Favoris</span>
                            </button>
                            <button className="rounded-md bg-[#1D7A85] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#166770]">
                                Postuler
                            </button>
                        </div>
                    </div>

                    {/* Custom Grid Layout - 7 sections as requested */}
                    <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {/* First row - 2 equal width sections */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="mb-6">
                                <div className="mb-4 flex items-center gap-3">
                                    <img src="/images/missions.png" className="h-6 w-6" alt="Missions icon" />
                                    <p className="text-lg font-semibold text-gray-800">Missions et objectifs</p>
                                </div>
                                <div className="mb-4 text-gray-600">
                                    {university.mission_objectifs ||
                                        "Former des ingénieurs hautement qualifiés dans les domaines de l'informatique et des systèmes d'information, capables de répondre aux besoins du marché national et international."}
                                </div>
                                <hr className="my-4 border-gray-200" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                    <img src="/images/conditions.png" className="h-6 w-6" alt="Conditions icon" />
                                    <p className="text-lg font-semibold text-gray-800">Conditions d'admission</p>
                                </div>
                                <div className="mt-2 text-gray-600">
                                    {isValidArray(conditionsAdmission) ? (
                                        <ul className="ml-4 list-disc space-y-1">
                                            {conditionsAdmission.map((condition, index) => (
                                                <li key={index}>{condition}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <ul className="ml-4 list-disc space-y-1">
                                            <li>Être titulaire d'un baccalauréat scientifique</li>
                                            <li>Réussir le concours national commun</li>
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <img src="/images/infos.png" className="h-6 w-6" alt="Info icon" />
                                <p className="text-lg font-semibold text-gray-800">Informations générales</p>
                            </div>
                            <div className="flex flex-col gap-4">
                                {university.universite_rattachement && (
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                        <div className="flex-shrink-0">
                                            <img src="/images/uniratt.png" className="h-6 w-6" alt="University icon" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-[#739194]">Université de rattachement</p>
                                            <p className="font-medium text-gray-800">{university.universite_rattachement}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                    <div className="flex-shrink-0">
                                        <img src="/images/type.png" className="h-6 w-6" alt="Type icon" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-[#739194]">Type</p>
                                        <p className="font-medium text-gray-800">
                                            {university.type === 'publique'
                                                ? 'Public'
                                                : university.type === 'privée'
                                                  ? 'Privé'
                                                  : university.type || 'Non spécifié'}
                                        </p>
                                    </div>
                                </div>

                                {university.annee_creation && (
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                        <div className="flex-shrink-0">
                                            <img src="/images/creation.png" className="h-6 w-6" alt="Creation icon" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-[#739194]">Année de création</p>
                                            <p className="font-medium text-gray-800">{university.annee_creation}</p>
                                        </div>
                                    </div>
                                )}

                                {university.accreditation && (
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                        <div className="flex-shrink-0">
                                            <img src="/images/accreditation.png" className="h-6 w-6" alt="Accreditation icon" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-[#739194]">Accréditations</p>
                                            <p className="font-medium text-gray-800">Établissement accrédité</p>
                                        </div>
                                    </div>
                                )}

                                {university.concours && (
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                        <div className="flex-shrink-0">
                                            <img src="/images/concours.png" className="h-6 w-6" alt="Competition icon" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-[#739194]">Concours</p>
                                            <p className="font-medium text-gray-800">Admission sur concours</p>
                                        </div>
                                    </div>
                                )}

                                {university.nombre_annees_etude && (
                                    <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                        <div className="flex-shrink-0">
                                            <img src="/images/etudes.png" className="h-6 w-6" alt="Studies icon" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-[#739194]">Nombre d'années d'études</p>
                                            <p className="font-medium text-gray-800">{university.nombre_annees_etude} ans</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                    <div className="flex-shrink-0">
                                        <img src="/images/bacoblig.png" className="h-6 w-6" alt="Baccalaureate icon" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-[#739194]">Bac Obligatoire</p>
                                        <p className="font-medium text-gray-800">{university.bac_obligatoire ? 'Oui' : 'Non'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 border-b border-gray-100 pb-3">
                                    <div className="flex-shrink-0">
                                        <img src="/images/localisationicon.png" className="h-6 w-6" alt="Location icon" />
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="text-sm text-[#739194]">Localisation</p>
                                        <p className="font-medium text-gray-800">{university.localisation || 'Non spécifiée'}</p>
                                    </div>
                                </div>

                                {university.site_web ? (
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0">
                                            <img src="/images/siteweb.png" className="h-6 w-6" alt="Website icon" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-[#739194]">Site Web</p>
                                            <a
                                                href={university.site_web}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium text-[#1D7A85] hover:underline"
                                            >
                                                {university.site_web.replace(/^https?:\/\/(www\.)?/, '')}
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0">
                                            <img src="/images/siteweb.png" className="h-6 w-6" alt="Website icon" />
                                        </div>
                                        <div className="flex flex-col">
                                            <p className="text-sm text-[#739194]">Site Web</p>
                                            <p className="font-medium text-gray-500">Non disponible</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Second row - 1 large section on left, 3 smaller sections on right */}
                        <div className="rounded-lg bg-white p-6 shadow-sm md:col-span-1 md:row-span-2">
                            <div className="mb-4 flex items-center gap-3">
                                <img src="/images/formations.png" className="h-6 w-6" alt="Formations icon" />
                                <h2 className="text-lg font-semibold text-gray-800">Formations Proposées</h2>
                            </div>
                            <div className="mt-4 space-y-4">
                                {isValidArray(formationsProposees) ? (
                                    formationsProposees.map((formation, index) => (
                                        <div key={index} className="flex items-center justify-between rounded-md p-4">
                                            <div>
                                                <h3 className="mb-2 text-sm font-semibold text-black">{formation}</h3>
                                                <p className="text-sm text-gray-600">Formation spécialisée dans ce domaine.</p>
                                                <hr />
                                            </div>
                                            <a href={university.site_web ? university.site_web : '#'} className="text-sm text-[#1D7A85]">
                                                Voir plus de détails
                                                <ArrowRight size={16} className="ml-1 inline-block" />
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <img src="/images/nodata.png" alt="No data" className="mb-4 h-16 w-16 opacity-50" />
                                        <p className="text-gray-500">Information sur les formations non disponible.</p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Veuillez contacter directement l'établissement pour plus de détails.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm md:col-span-1">
                            <div className="mb-4 flex items-center gap-3">
                                <img src="/images/seuils.png" className="h-6 w-6" alt="Thresholds icon" />
                                <h2 className="text-lg font-semibold text-gray-800">Seuils d'admission {currentYear || ''}</h2>
                            </div>

                            {/* Year selector if multiple years available */}
                            {hasSeuils && Object.keys(seuilsAdmission).length > 1 && (
                                <div className="mb-3">
                                    <select
                                        className="w-full rounded border border-gray-300 px-2 py-1 text-sm"
                                        value={currentYear}
                                        onChange={(e) => setCurrentYear(e.target.value)}
                                    >
                                        {Object.keys(seuilsAdmission).map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-3">
                                {hasSeuils && currentYear && seuilsAdmission[currentYear] && Object.keys(seuilsAdmission[currentYear]).length > 0 ? (
                                    Object.entries(seuilsAdmission[currentYear]).map(([filiere, seuil], index, arr) => (
                                        <div
                                            key={filiere}
                                            className={`flex items-center justify-between ${index < arr.length - 1 ? 'border-b border-gray-100 pb-2' : ''}`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <img src="/images/seuilsadm.png" className="h-5 w-5" alt="Subject icon" />
                                                <p className="text-sm text-[#739194]">{filiere}</p>
                                            </div>
                                            <p className="font-semibold text-[#1D7A85]">{seuil}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <img src="/images/Logo.png" alt="No data" className="mb-4 h-16 w-16 opacity-50" />
                                        <p className="text-gray-500">Aucun seuil d'admission disponible.</p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            Les informations sur les seuils d'admission seront ajoutées prochainement.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-lg bg-white p-6 shadow-sm md:col-span-1">
                            <div className="mb-4 flex items-center gap-3">
                                <img src="/images/deroulement.png" className="h-6 w-6" alt="Process icon" />
                                <h2 className="text-lg font-semibold text-gray-800">Déroulement du concours</h2>
                            </div>
                            <div className="space-y-4">
                                {isValidArray(deroulementConcours) ? (
                                    deroulementConcours.map((etape, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1D7A85] text-sm font-bold text-white">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-800">{etape.etape}</p>
                                                <p className="mt-1 text-sm text-gray-600">{etape.description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : university.concours ? (
                                    <>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1D7A85] text-sm font-bold text-white">
                                                1
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">Présélection sur dossier</p>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Étude des relevés de notes du baccalauréat et des années préparatoires.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#1D7A85] text-sm font-bold text-white">
                                                2
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">Épreuves écrites</p>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    Épreuves de mathématiques, physique, informatique et langues.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <img src="/images/Logo.png" alt="No data" className="mb-4 h-16 w-16 opacity-50" />
                                        <p className="text-gray-500">Aucun concours requis.</p>
                                        <p className="mt-2 text-sm text-gray-500">
                                            L'admission se fait sur étude de dossier ou selon d'autres critères spécifiques à l'établissement.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
};

export default UniversityDetail;
