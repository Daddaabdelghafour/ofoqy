import Notification from '@/components/Notification';
import { useForm } from '@inertiajs/react';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import DashboardLayout from '../../layouts/Dashboard-layout';
interface Props {
    student: {
        id: number;
        nom_complet: string;
        email: string;
        age: number;
        genre: string;
        ville: string;
        niveau_etude: string;
        filiere: string;
        langue_bac: string;
        moyenne_general_bac: number;
        profile_photo_path: string | null;
    };
}

const ProfileDetails: React.FC<Props> = ({ student }) => {
    // Formulaire pour toutes les données (profil + mot de passe)
    const [success, setSuccess] = React.useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageSuccess, setImageSuccess] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const photoInput = useRef<HTMLInputElement>(null);

    // Fonction pour sélectionner une nouvelle photo
    const selectNewPhoto = () => {
        photoInput.current?.click();
    };

    // Fonction pour gérer le changement de photo
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Prévisualiser l'image
        const reader = new FileReader();
        reader.onload = (e) => {
            setPhotoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Préparation pour l'upload
        const formData = new FormData();
        formData.append('photo', file);

        setImageUploading(true);
        // Soumission du formulaire avec axios ou fetch
        axios
            .post(route('profile.photo.update'), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then(() => {
                // Gérer le succès
                setSuccess(true);
                setImageUploading(false);
                setImageSuccess(true);
            })
            .catch((error) => {
                // Gérer l'erreur
                console.error("Erreur lors de l'upload:", error);
            });
    };

    const { data, setData, errors, processing, post } = useForm({
        nom_complet: student.nom_complet || '',
        email: student.email || '',
        age: student.age || '',
        genre: student.genre || '',
        ville: student.ville || '',
        niveau_etude: student.niveau_etude || '',
        filiere: student.filiere || '',
        langue_bac: student.langue_bac || '',
        moyenne_general_bac: student.moyenne_general_bac || '',
        current_password: '',
        new_password: '',
        password_confirmation: '',
    });

    // Gestionnaire pour les changements de champs
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Pour les champs numériques, convertir en nombre si nécessaire
        if (type === 'number') {
            setData(name as 'age' | 'moyenne_general_bac', value === '' ? '' : Number(value));
        } else {
            setData(
                name as
                    | 'current_password'
                    | 'new_password'
                    | 'password_confirmation'
                    | 'nom_complet'
                    | 'email'
                    | 'genre'
                    | 'ville'
                    | 'niveau_etude'
                    | 'filiere'
                    | 'langue_bac',
                value,
            );
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(false);
            }, 5000); // 5000 ms = 5 secondes

            // Nettoyer le timer si le composant se démonte avant les 5 secondes
            return () => clearTimeout(timer);
        }
        if (imageUploading) {
            const timer = setTimeout(() => {
                setImageUploading(false);
            }, 5000); // 5000 ms = 5 secondes

            // Nettoyer le timer si le composant se démonte avant les 5 secondes
            return () => clearTimeout(timer);
        }

        if (imageSuccess) {
            const timer = setTimeout(() => {
                setImageSuccess(false);
            }, 5000); // 5000 ms = 5 secondes

            // Nettoyer le timer si le composant se démonte avant les 5 secondes
            return () => clearTimeout(timer);
        }
    }, [success, imageSuccess, imageUploading]);

    // Gestionnaire de soumission du formulaire
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('profile.update'), {
            onSuccess: () => {
                // Réinitialiser les champs de mot de passe
                setData('current_password', '');
                setData('new_password', '');
                setData('password_confirmation', '');
                setSuccess(true);
            },
        });
    };

    return (
        <DashboardLayout profile_picture_path={student.profile_photo_path || ''} name={student.nom_complet} level={student.filiere}>
            {success && <Notification notification={{ title: 'Succès', show: true, type: 'success', message: 'Profil mis à jour avec succès' }} />}
            {imageUploading && (
                <Notification
                    notification={{ title: 'Chargement', show: true, type: 'success', message: 'Sauvegarde de votre photo de profil en cours...' }}
                />
            )}
            {imageSuccess && (
                <Notification notification={{ title: 'Succès', show: true, type: 'success', message: 'Photo de profil mis à jour avec succès' }} />
            )}

            <div className="container mx-auto px-4 py-8">
                <div className="mb-[80px] flex h-[25px] gap-3 mt-4">
                    <a className="" href="/dashboard">
                        <ArrowLeft />
                    </a>
                    <h1 className="mb-6 text-2xl font-bold text-gray-800 ">Profil Utilisateur</h1>
                </div>
                <div className="container-custom min-h-screen p-5">
                    <div className="min-h-[769px] rounded-xl">
                        <div className="flex h-[70px] min-w-full flex-col items-center rounded-xl bg-gradient-to-r from-[#1D7A85] to-[#071C1F]"></div>

                        {/* First section : profile picture + name + email + sauvegarder button */}
                        <div className="flex items-center justify-between bg-white p-5">
                            {/* Section photo de profil */}
                            <div className="mb-6 flex items-center justify-start gap-5">
                                <div className="relative w-32 h-32 rounded-full flex items-center justify-center">
                                    <img
                                        src={
                                            photoPreview ||
                                            (student.profile_photo_path ? `${student.profile_photo_path}` : '/images/SpaceMan.png')
                                        }
                                        alt={student.nom_complet}
                                        className="absolute inset-0 w-full h-full object-cover rounded-full"
                                    />

                                    <button
                                        type="button"
                                        onClick={selectNewPhoto}
                                        className="absolute bottom-2 right-2 rounded-full bg-[#1D7A85] p-1.5 text-white shadow-sm"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                        </svg>
                                    </button>
                                </div>

                                <div>
                                    <h2 className="text-xl font-semibold">{student.nom_complet}</h2>
                                    <p className="text-gray-600">{student.email}</p>
                                </div>

                                {/* Input file caché */}
                                <input type="file" ref={photoInput} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                            <div>
                                <button
                                    className="h-[38px] w-[135px] rounded-sm bg-[#1D7A85] text-sm font-semibold text-white hover:bg-primary-1000"
                                    onClick={handleSubmit}
                                    disabled={processing}
                                >
                                    {processing ? 'Sauvegarde...' : 'Sauvegarder'}
                                </button>
                            </div>
                        </div>

                        {/* Section des inputs de modele student - tous dans un seul div */}
                        <form onSubmit={handleSubmit} className="rounded-lg bg-white p-6 shadow-sm">
                            <h3 className="mb-6 text-xl font-semibold text-gray-800">Informations du Profil</h3>

                            <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2">
                                {/* Informations Personnelles */}
                                <div className="mb-4">
                                    <label htmlFor="nom_complet" className="mb-1 block text-sm font-medium text-gray-700">
                                        Nom Complet
                                    </label>
                                    <input
                                        type="text"
                                        id="nom_complet"
                                        name="nom_complet"
                                        value={data.nom_complet}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.nom_complet ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                        placeholder="Votre nom complet"
                                    />
                                    {errors.nom_complet && <p className="mt-1 text-xs text-red-500">{errors.nom_complet}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={data.email}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                        placeholder="votre@email.com"
                                    />
                                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="age" className="mb-1 block text-sm font-medium text-gray-700">
                                        Âge
                                    </label>
                                    <input
                                        type="number"
                                        id="age"
                                        name="age"
                                        value={data.age}
                                        onChange={handleChange}
                                        min="15"
                                        max="99"
                                        className={`w-full rounded-md border ${errors.age ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                        placeholder="Votre âge"
                                    />
                                    {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="genre" className="mb-1 block text-sm font-medium text-gray-700">
                                        Genre
                                    </label>
                                    <select
                                        id="genre"
                                        name="genre"
                                        value={data.genre}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.genre ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                    >
                                        <option value="">Sélectionnez</option>
                                        <option value="masculin">masculin</option>
                                        <option value="feminin">feminin</option>
                                    </select>
                                    {errors.genre && <p className="mt-1 text-xs text-red-500">{errors.genre}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="ville" className="mb-1 block text-sm font-medium text-gray-700">
                                        Ville
                                    </label>
                                    <input
                                        type="text"
                                        id="ville"
                                        name="ville"
                                        value={data.ville}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.ville ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                        placeholder="Votre ville"
                                    />
                                    {errors.ville && <p className="mt-1 text-xs text-red-500">{errors.ville}</p>}
                                </div>

                                {/* Informations Académiques */}
                                <div className="mb-4">
                                    <label htmlFor="niveau_etude" className="mb-1 block text-sm font-medium text-gray-700">
                                        Niveau d'études
                                    </label>
                                    <select
                                        id="niveau_etude"
                                        name="niveau_etude"
                                        value={data.niveau_etude}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.niveau_etude ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                    >
                                        <option value="">Sélectionnez</option>
                                        <option value="baccalauréat">Baccalauréat</option>
                                    </select>
                                    {errors.niveau_etude && <p className="mt-1 text-xs text-red-500">{errors.niveau_etude}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="filiere" className="mb-1 block text-sm font-medium text-gray-700">
                                        Filière
                                    </label>
                                    <select
                                        id="filiere"
                                        name="filiere"
                                        value={data.filiere}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.filiere ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                    >
                                        <option value="">-- Sélectionnez votre filière --</option>
                                        <option value="Sciences mathématiques">Sciences Mathématiques</option>
                                        <option value="Sciences physiques">Sciences physiques</option>
                                        <option value="Sciences Techniques">Sciences Techniques</option>
                                        <option value="Sciences Économiques">Sciences Économiques</option>
                                        <option value="Sciences de vie">Sciences de vie</option>
                                    </select>
                                    {errors.filiere && <p className="mt-1 text-xs text-red-500">{errors.filiere}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="langue_bac" className="mb-1 block text-sm font-medium text-gray-700">
                                        Langue du Bac
                                    </label>
                                    <select
                                        id="langue_bac"
                                        name="langue_bac"
                                        value={data.langue_bac}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.langue_bac ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                    >
                                        <option value="">Sélectionnez</option>
                                        <option value="arabe">Arabe</option>
                                        <option value="francais">Français</option>
                                        <option value="anglais">Anglais</option>
                                    </select>
                                    {errors.langue_bac && <p className="mt-1 text-xs text-red-500">{errors.langue_bac}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="moyenne_general_bac" className="mb-1 block text-sm font-medium text-gray-700">
                                        Moyenne Générale du Bac
                                    </label>
                                    <input
                                        type="number"
                                        id="moyenne_general_bac"
                                        name="moyenne_general_bac"
                                        value={data.moyenne_general_bac}
                                        onChange={handleChange}
                                        step="0.01"
                                        min="0"
                                        max="20"
                                        className={`w-full rounded-md border ${errors.moyenne_general_bac ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                        placeholder="Ex: 15.75"
                                    />
                                    {errors.moyenne_general_bac && <p className="mt-1 text-xs text-red-500">{errors.moyenne_general_bac}</p>}
                                </div>

                                {/* Section de mot de passe */}
                                <div className="col-span-full mt-6">
                                    <h3 className="mb-4 text-lg font-semibold text-gray-800">Changer le mot de passe</h3>
                                    <p className="mb-4 text-sm text-gray-600">
                                        Laissez ces champs vides si vous ne souhaitez pas changer votre mot de passe.
                                    </p>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="current_password" className="mb-1 block text-sm font-medium text-gray-700">
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        type="password"
                                        id="current_password"
                                        name="current_password"
                                        value={data.current_password}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.current_password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                        placeholder="••••••••"
                                    />
                                    {errors.current_password && <p className="mt-1 text-xs text-red-500">{errors.current_password}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="new_password" className="mb-1 block text-sm font-medium text-gray-700">
                                        Nouveau mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        id="new_password"
                                        name="new_password"
                                        value={data.new_password}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.new_password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                        placeholder="••••••••"
                                    />
                                    {errors.new_password && <p className="mt-1 text-xs text-red-500">{errors.new_password}</p>}
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="password_confirmation" className="mb-1 block text-sm font-medium text-gray-700">
                                        Confirmer le mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={handleChange}
                                        className={`w-full rounded-md border ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} px-3 py-2 focus:border-[#1D7A85] focus:outline-none focus:ring-1 focus:ring-[#1D7A85]`}
                                        placeholder="••••••••"
                                    />
                                    {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation}</p>}
                                </div>
                            </div>

                            {/* Bouton de soumission */}
                            <div className="mt-6 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-md bg-[#1D7A85] px-4 py-2 text-white hover:bg-[#18656e] focus:outline-none focus:ring-2 focus:ring-[#1D7A85] focus:ring-offset-2 disabled:opacity-70"
                                >
                                    {processing ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfileDetails;
