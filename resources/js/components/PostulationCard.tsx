import { getUniversityImagePath } from '@/helpers/UniversityImageHelper';
import React from 'react';

type PostulationCardProps = {
    id: number;
    nom: string;
    type: string;
    localisation: string;
    etat_postulation: string;
    date_ouverture: string | null;
    date_fermeture: string | null;
    site_web: string | null;
    onViewDetails: (id: number) => void;
};

const PostulationCard: React.FC<PostulationCardProps> = ({
    id,
    nom,
    type,
    localisation,
    etat_postulation,
    date_ouverture,
    date_fermeture,
    site_web,
    onViewDetails,
}) => {
    const isPublic = type.toLowerCase() === 'publique';

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

    return (
        <div className="relative flex w-[330px] flex-col overflow-hidden rounded-lg border border-[#1D7A85] bg-white shadow-md transition-all duration-300 hover:shadow-lg md:min-w-[330px] md:max-w-[370px]">
            {/* Image */}
            <div className="relative h-[160px] overflow-hidden">
                <img
                    src={'/' + getUniversityImagePath(id)}
                    alt={`${nom} - ${localisation}`}
                    className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/images/Schools/default.png';
                    }}
                />
                <span
                    className={`absolute left-3 top-3 rounded-sm px-2 py-0.5 text-xs font-semibold ${
                        isPublic ? 'bg-[#1D7A8533] text-[#1D7A85]' : 'bg-blue-100 text-blue-800'
                    }`}
                >
                    {type}
                </span>
            </div>

            {/* Content */}
            <div className="flex flex-grow flex-col p-4">
                <h3 className="mb-2 line-clamp-2 min-h-[50px] text-lg font-semibold text-gray-800">{nom}</h3>
                <p className="mb-1 line-clamp-1 text-sm text-gray-500">{localisation}</p>

                <hr className="my-2 border-gray-200" />

                {/* Postulation State */}
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">État postulation :</span>
                    <span
                        className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${etat_postulation === 'ouvert' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                    >
                        {etat_postulation.charAt(0).toUpperCase() + etat_postulation.slice(1)}
                    </span>
                </div>

                {/* Dates */}
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-700">Ouverture :</span>
                    <span className="text-xs text-gray-600">{formatDate(date_ouverture) || 'N/A'}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-gray-700">Fermeture :</span>
                    <span className="text-xs text-gray-600">{formatDate(date_fermeture) || 'N/A'}</span>
                </div>

                <hr className="mb-3 mt-auto border-gray-200" />

                <div className="flex flex-col items-center justify-center gap-2">
                    {site_web && (
                        <a
                            href={site_web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full items-center rounded-md bg-[#1D7A85] px-3 py-1.5 text-center text-sm font-medium text-white transition-all duration-300 ease-in-out hover:bg-[#18656e]"
                        >
                            Postuler
                        </a>
                    )}
                    <button
                        onClick={() => onViewDetails(id)}
                        className="w-full rounded-md border border-[#1D7A85] px-3 py-1.5 text-sm font-medium text-[#1D7A85] transition-all duration-300 ease-in-out hover:bg-[#f0f8fa]"
                    >
                        Voir plus de détails
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostulationCard;
