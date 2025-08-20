import { getUniversityImagePath } from '@/helpers/UniversityImageHelper';
import { ChevronDown, Heart } from 'lucide-react';
import React, { useState } from 'react';
type UniversityCardProps = {
    id: number;
    nom: string;
    type: string;
    localisation: string;
    seuils_admission: Record<string, Record<string, string>>;
    onViewDetails: (id: number) => void;
    onToggleFavorite: (id: number, isFavorite: boolean) => void;
    isFavorite?: boolean;
};

const UniversityCard: React.FC<UniversityCardProps> = ({
    id,
    nom,
    type,
    localisation,
    seuils_admission,
    onViewDetails,
    onToggleFavorite,
    isFavorite = false,
}) => {
    const [favorite, setFavorite] = useState(isFavorite);
    const [selectedYear, setSelectedYear] = useState<string>(Object.keys(seuils_admission)[0] || '');
    const [showSeuils, setShowSeuils] = useState(false);

    const isPublic = type.toLowerCase() === 'publique';

    const handleToggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        const newState = !favorite;
        setFavorite(newState);
        onToggleFavorite(id, newState);
    };

    const toggleShowSeuils = () => {
        setShowSeuils(!showSeuils);
    };

    return (
        <div className="relative flex w-[330px] flex-col overflow-hidden rounded-lg border border-[#1D7A85] bg-white shadow-md transition-all duration-300 hover:shadow-lg md:min-w-[330px] md:max-w-[370px]">
            {/* Favorite button */}
            <button onClick={handleToggleFavorite} className="absolute right-3 top-3 z-10">
                <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
            </button>

            {/* Image */}

            <div className="relative h-[160px] overflow-hidden">
                <img
                    src={getUniversityImagePath(id)}
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

                <div className="mb-2 flex items-center justify-between">
                    <p className="text-sm font-normal">Type :</p>
                    <span
                        className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${isPublic ? 'border-b-primary border bg-[#1D7A8533] text-[#1D7A85]' : 'bg-blue-100 text-blue-800'}`}
                    >
                        {type}
                    </span>
                </div>

                <hr className="my-2 border-gray-200" />

                {/* Frais information */}
                <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Frais:</span>
                    <span className={`text-sm font-semibold ${isPublic ? 'font-medium text-[#1D7A85]' : 'font-medium text-blue-600'}`}>
                        {isPublic ? 'Gratuit' : 'Payant'}
                    </span>
                </div>

                <hr className="my-2 border-gray-200" />

                {/* Seuils dropdown - collapsed by default */}
                {Object.keys(seuils_admission).length > 0 && (
                    <div className="mb-3 rounded-lg border border-b-[#1D7A85] bg-white">
                        <button
                            onClick={toggleShowSeuils}
                            className="flex w-full items-center justify-between bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                        >
                            <span>Seuils d'admission</span>
                            <ChevronDown className={`h-4 w-4 transition-transform ${showSeuils ? 'rotate-180' : ''}`} />
                        </button>

                        {showSeuils && (
                            <div className="rounded-b-md border-t border-gray-200 bg-white p-2 shadow-sm">
                                <div className="mb-2">
                                    <select
                                        className="w-full rounded border border-b-[#1D7A85] bg-white px-2 py-1 text-xs"
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(e.target.value)}
                                    >
                                        {Object.keys(seuils_admission).map((year) => (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {selectedYear && (
                                    <div className="max-h-[100px] overflow-y-auto text-xs">
                                        {Object.entries(seuils_admission[selectedYear] || {}).map(([filiere, seuil]) => (
                                            <div key={filiere} className="flex justify-between border-b border-gray-100 py-1">
                                                <span className="max-w-[65%] truncate text-gray-700">{filiere}:</span>
                                                <span className="font-medium text-[#1D7A85]">{seuil}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                <hr className="mb-3 mt-auto border-gray-200" />

                <div>
                    <button
                        onClick={() => onViewDetails(id)}
                        className="w-full rounded-md bg-[#1D7A85] px-3 py-1.5 text-sm font-medium text-white transition-all duration-300 ease-in-out hover:bg-[#18656e]"
                    >
                        Voir plus de détails
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UniversityCard;
