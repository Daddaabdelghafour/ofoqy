import { usePage } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';

const ImportUniversities = () => {
    const { csrf_token } = usePage<{ csrf_token: string }>().props;
    const [status, setStatus] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [fileData, setFileData] = useState<any>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.type !== 'application/json') {
            setStatus('Erreur: Veuillez sélectionner un fichier JSON');
            return;
        }

        setIsLoading(true);
        setStatus('Lecture du fichier...');
        setValidationErrors([]);

        try {
            // Read file
            const text = await file.text();

            try {
                const data = JSON.parse(text);

                // Validate the required fields and data types
                const errors = validateData(data);

                if (errors.length > 0) {
                    setValidationErrors(errors);
                    setStatus('Erreurs de validation détectées. Veuillez corriger le fichier JSON.');
                } else {
                    setFileData(data);
                    setStatus(
                        `Fichier chargé avec succès. ${Array.isArray(data) ? data.length : 0} universités trouvées. Cliquez sur "Importer" pour continuer.`,
                    );
                }
            } catch (parseError) {
                console.error('Parse error:', parseError);
                setStatus('Erreur: Le fichier JSON est mal formaté');
            }
        } catch (error) {
            console.error('File read error:', error);
            setStatus('Erreur: Impossible de lire le fichier');
        } finally {
            setIsLoading(false);
        }
    };

    // Validate data to ensure all required fields are present and properly formatted
    const validateData = (data: any[]): string[] => {
        if (!Array.isArray(data)) {
            return ["Le fichier doit contenir un tableau d'universités"];
        }

        const errors: string[] = [];

        data.forEach((university, index) => {
            // Check required fields
            if (!university.id) errors.push(`Université #${index + 1}: ID manquant`);
            if (!university.nom) errors.push(`Université #${index + 1}: Nom manquant`);

            // Validate type - CRITICAL: Must be "Public" or "Private" exactly

            // Ensure formations_proposees is an array
            if (university.formations_proposees && !Array.isArray(university.formations_proposees)) {
                errors.push(`Université #${index + 1}: formations_proposees doit être un tableau`);
            }

            // Ensure conditions_admission is an array
            if (university.conditions_admission && !Array.isArray(university.conditions_admission)) {
                errors.push(`Université #${index + 1}: conditions_admission doit être un tableau`);
            }

            // Ensure deroulement_concours is an array
            if (university.deroulement_concours && !Array.isArray(university.deroulement_concours)) {
                errors.push(`Université #${index + 1}: deroulement_concours doit être un tableau`);
            }
        });

        return errors;
    };

    const handleImport = async () => {
        if (!fileData) {
            setStatus('Aucune donnée à importer');
            return;
        }

        setIsLoading(true);
        setStatus('Importation en cours...');

        try {
            // Ensure the data is properly stringified
            const response = await axios.post('/universites-import', fileData, {
                headers: {
                    'X-CSRF-TOKEN': csrf_token,
                    'Content-Type': 'application/json',
                },
                timeout: 120000, // 2 minutes
            });

            setStatus(`Succès: ${response.data.message || 'Importation réussie'}`);
            setFileData(null);

            // Clear file input
            const fileInput = document.getElementById('fileInput') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
        } catch (error: any) {
            console.error('Import error:', error);

            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                setStatus(`Erreur ${error.response.status}: ${error.response.data.error || error.response.data.message || 'Erreur serveur'}`);
                console.error('Server response:', error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                setStatus('Erreur: Le serveur ne répond pas, peut-être que le fichier est trop volumineux');
            } else {
                // Something happened in setting up the request
                setStatus(`Erreur: ${error.message}`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="mb-6 text-xl font-bold text-[#1D7A85]">Importer des universités</h1>

            <div className="mb-4 rounded-lg border border-gray-300 bg-white p-4">
                <div className="mb-4">
                    <label htmlFor="fileInput" className="mb-2 block font-medium">
                        Sélectionnez un fichier JSON:
                    </label>
                    <input
                        id="fileInput"
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileChange}
                        disabled={isLoading}
                        className="w-full rounded border p-2"
                    />
                </div>

                {status && (
                    <div
                        className={`mb-4 rounded p-3 ${status.includes('Erreur') ? 'bg-red-100 text-red-700' : status.includes('Succès') ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-700'}`}
                    >
                        {status}
                    </div>
                )}

                {validationErrors.length > 0 && (
                    <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                        <h3 className="mb-2 font-bold">Erreurs de validation:</h3>
                        <ul className="list-disc pl-5">
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {fileData && validationErrors.length === 0 && (
                    <button onClick={handleImport} disabled={isLoading} className="rounded bg-[#1D7A85] px-4 py-2 text-white disabled:opacity-50">
                        {isLoading ? 'Importation en cours...' : 'Importer'}
                    </button>
                )}
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-500">
                <h3 className="mb-2 font-medium">Notes importantes:</h3>
                <ul className="list-disc space-y-1 pl-5">
                    <li>Le fichier doit être au format JSON valide</li>
                    <li>Chaque université doit avoir au minimum un ID et un nom</li>
                    <li>
                        Le champ <code className="rounded bg-gray-200 px-1">type</code> doit être exactement{' '}
                        <code className="rounded bg-gray-200 px-1">"Public"</code> ou <code className="rounded bg-gray-200 px-1">"Private"</code>
                    </li>
                    <li>
                        Les champs <code className="rounded bg-gray-200 px-1">formations_proposees</code>,{' '}
                        <code className="rounded bg-gray-200 px-1">conditions_admission</code> et{' '}
                        <code className="rounded bg-gray-200 px-1">deroulement_concours</code> doivent être des tableaux
                    </li>
                    <li>Les données existantes avec le même ID seront mises à jour</li>
                </ul>
            </div>
        </div>
    );
};

export default ImportUniversities;
