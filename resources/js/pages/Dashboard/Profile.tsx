import DashboardLayout from '@/layouts/Dashboard-layout';
import { router, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { FiHelpCircle, FiLogOut, FiSettings, FiTrash2, FiUser } from 'react-icons/fi';
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
    } | null;
    hasCompletedTest: boolean;
    mbtiType: string | null;
}
function Profile({ student, mbtiResult }: DashboardProps) {
    const resultat = mbtiResult?.type_mbti ?? '';
    const message = mbtiResult?.resultat_json.message ?? '';
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const {
        data,
        setData,
        delete: destroy,
        processing,
        errors,
    } = useForm({
        password: '',
    });
    const handleLogout = () => {
        router.post(
            '/logout',
            {},
            {
                onSuccess: () => {
                    window.location.href = '/login';
                },
                onError: (errors) => {
                    console.error('Logout failed:', errors);
                },
            },
        );
    };

    const confirmDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();
        destroy(route('account.delete'), {
            preserveScroll: true,
            onSuccess: () => setDeleteModalOpen(false),
            onError: () => document.getElementById('password')?.focus(),
        });
    };

    return (
        <DashboardLayout profile_picture_path={student.profile_photo_path || ''} name={student.nom_complet} level={student.filiere}>
            <div className="mt-4 min-w-full pl-4 pt-5">
                <span className="text-[29px] font-medium tracking-wide">Profile</span>
                <div className="flex items-start justify-between gap-10">
                    <div className="flex-1.25 mt-5 flex flex-col items-center rounded-[3px] bg-white p-8">
                        <img
                            className="m-2 h-48 w-48 rounded-[400px] border-[3px] border-primary-1000 p-[2px]"
                            src={student.profile_photo_path ? student.profile_photo_path : '/images/spaceMan.png'}
                        />
                        <span className="m-3 text-[16px] font-bold text-[#4B4B4B]">{student.nom_complet}</span>
                        <span className="font-regular text-[16px] text-[#4B4B4B]">{student.filiere}</span>

                        <div className="mt-10 flex w-full flex-col justify-start gap-3 border-t-2 border-[#EAEAEA] py-8 pl-10">
                            <div className="mb-3 flex items-center justify-start gap-4 hover:cursor-pointer">
                                <FiUser />
                                <span
                                    onClick={() => {
                                        window.location.href = '/profileDetails';
                                    }}
                                    className="font-regular text-[16px] text-[#4B4B4B]"
                                >
                                    Profile
                                </span>
                            </div>
                        </div>
                        <div className="flex w-full flex-col justify-start gap-3 border-t-2 border-[#EAEAEA] py-8 pl-10 hover:cursor-pointer">
                            <div className="mb-3 flex items-center justify-start gap-4">
                                <FiSettings />
                                <span className="font-regular text-[16px] text-[#4B4B4B]">Paramètres</span>
                            </div>
                            <div className="mb-3 flex items-center justify-start gap-4 hover:cursor-pointer">
                                <FiHelpCircle />
                                <span
                                    className="font-regular text-[16px] text-[#4B4B4B]"
                                    onClick={() => {
                                        window.location.href = '/help';
                                    }}
                                >
                                    Aide
                                </span>
                            </div>
                            <div className="mb-3 flex items-center justify-start gap-4 hover:cursor-pointer" onClick={() => setDeleteModalOpen(true)}>
                                <FiTrash2 />
                                <span className="font-regular text-[16px] text-[#4B4B4B]">Supprimer le compte</span>
                            </div>
                        </div>
                        <div className="flex w-full flex-col justify-start gap-3 border-t-2 border-[#EAEAEA] py-8 pl-10 hover:cursor-pointer">
                            <div className="mb-3 flex items-center justify-start gap-4">
                                <FiLogOut className="text-red-600" />
                                <span
                                    onClick={() => {
                                        handleLogout();
                                    }}
                                    className="font-regular text-[16px] text-red-600"
                                >
                                    Se deconnecter
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex h-auto flex-1 flex-col justify-start rounded-[3px] bg-white p-10">
                        <span className="text-[20px] font-medium">Votre résultat de test et recommendations</span>
                        <div className="my-7 rounded-[2px] border border-b-2 border-l-4 border-r-2 border-t-2 border-primary-1000 bg-[#fbf7f7] p-5">
                            <span className="font-regular text-[16px] text-primary-1000">Votre personnalité est :</span>
                            <div className="flex justify-start gap-2 p-3">
                                {resultat.split('').map((word, index) => (
                                    <span key={index} className="h-[25px] w-[25px] bg-primary-1000 text-center text-[16px] font-medium text-white">
                                        {word}
                                    </span>
                                ))}
                            </div>
                            <div className="p-2">
                                <span className="text-[12px] font-light text-[#708090]">Tu est un {resultat} -</span>
                                <p className="mt-2 line-clamp-3 text-[12px] font-medium text-[#708090]">{message}</p>
                            </div>
                            <div className="flex items-center justify-start hover:cursor-pointer">
                                <a href="/PersonnaliteDetails" className="m-3 text-[13px] font-medium text-primary-1000 no-underline">
                                    Voir plus d’info avec recommandations{' '}
                                </a>
                                <ArrowRight className="w-[16px] text-primary-1000" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Supprimer votre compte</h3>

                        <p className="mb-6 text-sm text-gray-600">
                            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        </p>

                        <form onSubmit={confirmDeleteAccount}>
                            <div className="mb-4">
                                <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
                                    Confirmez votre mot de passe
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                    required
                                />
                                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalOpen(false)}
                                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm"
                                >
                                    Annuler
                                </button>
                                <button type="submit" disabled={processing} className="rounded-md bg-red-600 px-4 py-2 text-sm text-white">
                                    {processing ? 'Suppression...' : 'Supprimer le compte'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}

export default Profile;
