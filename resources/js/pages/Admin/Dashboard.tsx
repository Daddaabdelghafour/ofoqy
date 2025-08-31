import DashboardLayout from '@/layouts/Dashboard-layout';
import Notification from '@/components/Notification';
import React, { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';


interface DashboardProps {
    universities: {
        id: number;
        nom: string;
        type: string;
        mission_objectifs: string;
        universite_rattachement: string;
        annee_creation: string;
        accreditation: boolean;
        concours: boolean;
        nombre_annees_etude: string;
        bac_obligatoire: boolean;
        localisation: string;
        site_web: string;
        seuils_admission: string[];
        etat_postulation: string;
        date_ouverture: string;
        date_fermeture: string;
        conditions_admission: string[];
        formations_proposees: string[];
        deroulement_concours: string[];
        logo: string;
    }[];
    admin: {
        nom_complet: string;
    };
}
function Dashboard({ admin, universities }: DashboardProps ) {
    const [notification, setNotification] = useState({
        show: false,
        type: 'success' as 'success' | 'error' | 'warning',
        title: '',
        message: ''
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [addData, setAddData] = useState<{
        nom: string;
        universite_rattachement: string;
        type: string;
        annee_creation: string;
        accreditation: boolean;
        concours: boolean;
        nombre_annees_etude: string;
        bac_obligatoire: boolean;
        localisation: string;
        site_web: string;
        seuils_admission: string[];
        etat_postulation: string;
        date_ouverture: string;
        date_fermeture: string;
        mission_objectifs: string;
        conditions_admission: string;
        formations_proposees: string;
        deroulement_concours: string;
        logo: string | File;
    }>({
        nom: '',
        universite_rattachement: '',
        type: '',
        annee_creation: '',
        accreditation: false,
        concours: false,
        nombre_annees_etude: '',
        bac_obligatoire: false,
        localisation: '',
        site_web: '',
        seuils_admission: ['', '', ''], // [sciences maths, sciences physique, economique]
        etat_postulation: '',
        date_ouverture: '',
        date_fermeture: '',
        mission_objectifs: '',
        conditions_admission: '',
        formations_proposees: '',
        deroulement_concours: '',
        logo: '',
    });

    const handleEdit = (id: number) => {
        const uni = universities.find(u => u.id === id);
        if (uni) {
            setEditData({
                ...uni,
                universite_rattachement: uni.universite_rattachement || '',
                annee_creation: uni.annee_creation || '',
                accreditation: uni.accreditation || false,
                concours: uni.concours || false,
                nombre_annees_etude: uni.nombre_annees_etude || '',
                bac_obligatoire: uni.bac_obligatoire || false,
                localisation: uni.localisation || '',
                site_web: uni.site_web || '',
                seuils_admission: Array.isArray(uni.seuils_admission) ? uni.seuils_admission : ['', '', ''],
                etat_postulation: uni.etat_postulation || '',
                date_ouverture: uni.date_ouverture || '',
                date_fermeture: uni.date_fermeture || '',
                mission_objectifs: uni.mission_objectifs || '',
                conditions_admission: uni.conditions_admission || '',
                formations_proposees: uni.formations_proposees || '',
                deroulement_concours: uni.deroulement_concours || '',
            });
            setShowEditModal(true);
        }
    };
const handleDelete = async (id: number) => {
    setNotification({
        show: true,
        type: 'warning',
        title: 'Suppression',
        message: 'Suppression en cours...'
    });
    try {
        const res = await fetch('/admin/universite/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({ id })
        });
        const data = await res.json();
        if (data.success) {
            setNotification({
                show: true,
                type: 'success',
                title: 'Supprimé',
                message: 'Université supprimée avec succès.'
            }) 
            window.location.reload();
            
            // Optionally refresh the list here
        } else {
            setNotification({
                show: true,
                type: 'error',
                title: 'Erreur',
                message: 'La suppression a échoué.'
            });
        }
    } catch {
        setNotification({
            show: true,
            type: 'error',
            title: 'Erreur',
            message: 'Erreur réseau lors de la suppression.'
        });
    }
    setTimeout(() => setNotification(n => ({ ...n, show: false })), 2000);
};

    return(
        <>
            <Notification notification={notification} />
            <div>
            <DashboardLayout name='admin' level="admin" profile_picture_path="">
                <div className="mt-4 min-w-full pl-4 pt-5">
                    <span className="text-[32px] font-semibold tracking-wide text-black">Tableau de modification des Universités</span>
                    <div className='mt-10'>
                        <div className='flex justify-between bg-white p-5'>
                            <div className='flex justify-start items-center '>
                                <span className='font-semibold text-[20px] p-2 '>Liste des Universités</span>
                                <span className='bg-[#1D7A851C] font-regular text-[9px] text-primary-1000 p-1 h-auto '>{universities.length} établissements</span>
                            </div>
                            <button
    className='btn btn-primary text-[14px] font-regular tracking-wide'
    onClick={() => setShowAddModal(true)}
>
    +  Ajouter une université
</button>
                        </div>
                        <table className="min-w-full border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100 text-gray-700 px-2 ">
                                        <th className="text-[14px] font-medium border-r border-2 text-[#19191975] border-b text-start px-7  py-4">Nom</th>
                                        <th className="text-[14px] font-medium border-r border-2 text-[#19191975] border-b text-start px-7  py-4">Type</th>
                                        <th className="text-[14px] font-medium border-r border-2 text-[#19191975] border-b text-start px-7  py-4">Description</th>
                                        <th className="text-[14px] font-medium border-r border-2 text-[#19191975] border-b text-start px-7  py-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                     { universities.map((university) => (
                                    <tr key={university.id}>
                                        <td className="py-2 px-4 border-r border-b">
                                            <div className='flex justify-start items-center gap-2 p-2'>
                                                <img src={university.logo ? `/images/Schools/${university.logo}` : '/images/SpaceMan.png'} alt="Logo" className="w-[150px] h-14 object-fill mr-2" />
                                                <span className='font-medium text-[14px] tracking-wide'>{university.nom}</span>
                                            </div>
                                        </td>
                                        <td className="py-2 px-4 border-r border-b ">{university.type}</td>
                                        <td className="py-4 px-4 border-r border-2 border-b ">{university.site_web}</td>
                                        <td className='border-2 border-b'>
                                            <div className='flex justify-center items-center gap-5 '>
                                                <button onClick={() => handleEdit(university.id)}>
                                                <Pencil className='text-primary-600 cursor-pointer w-[18px] h-[18px]'/>
                                                </button>
                                                <button onClick={() => { setDeleteId(university.id); setShowDeleteModal(true); }}>
    <Trash2 className='text-red-600 cursor-pointer w-[18px] h-[18px]' />
</button>
                                            </div>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                        </table>
                    </div>
               </div>
            </DashboardLayout>
        </div>
        {showEditModal && editData && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Modifier une Université</h2>
            <label className="block mb-2 text-sm">Nom <span className="text-red-600">*</span></label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={editData.nom} onChange={e => setEditData({ ...editData, nom: e.target.value })} />
            <label className="block mb-2 text-sm">Université de rattachement</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={editData.universite_rattachement} onChange={e => setEditData({ ...editData, universite_rattachement: e.target.value })} />
            <label className="block mb-2 text-sm">Type <span className="text-red-600">*</span></label>
            <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editData.type === 'publique'} onChange={e => setEditData({ ...editData, type: e.target.checked ? 'publique' : '' })} />
                    Publique
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editData.type === 'privee'} onChange={e => setEditData({ ...editData, type: e.target.checked ? 'privee' : '' })} />
                    Privée
                </label>
            </div>
            <label className="block mb-2 text-sm">Année de création</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={editData.annee_creation} onChange={e => setEditData({ ...editData, annee_creation: e.target.value })} />
            <label className="block mb-2 text-sm">Accréditation</label>
            <input type="checkbox" className="mr-2" checked={editData.accreditation} onChange={e => setEditData({ ...editData, accreditation: e.target.checked })} /> Oui
            <label className="block mb-2 text-sm">Concours</label>
            <input type="checkbox" className="mr-2" checked={editData.concours} onChange={e => setEditData({ ...editData, concours: e.target.checked })} /> Oui
            <label className="block mb-2 text-sm">Nombre d'années d'étude <span className="text-red-600">*</span></label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={editData.nombre_annees_etude} onChange={e => setEditData({ ...editData, nombre_annees_etude: e.target.value })} />
            <label className="block mb-2 text-sm">Bac obligatoire</label>
            <input type="checkbox" className="mr-2" checked={editData.bac_obligatoire} onChange={e => setEditData({ ...editData, bac_obligatoire: e.target.checked })} /> Oui
            <label className="block mb-2 text-sm">Localisation <span className="text-red-600">*</span></label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={editData.localisation} onChange={e => setEditData({ ...editData, localisation: e.target.value })} />
            <label className="block mb-2 text-sm">Site web</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={editData.site_web} onChange={e => setEditData({ ...editData, site_web: e.target.value })} />
            <label className="block mb-2 text-sm">Seuils d'admission</label>
            <div className="mb-3">
                <label className="block text-xs mb-1">Sciences Maths</label>
                <input className="w-full border px-2 py-1 mb-2 rounded" value={editData.seuils_admission[0]} onChange={e => setEditData({ ...editData, seuils_admission: [e.target.value, editData.seuils_admission[1], editData.seuils_admission[2]] })} />
                <label className="block text-xs mb-1">Sciences Physique</label>
                <input className="w-full border px-2 py-1 mb-2 rounded" value={editData.seuils_admission[1]} onChange={e => setEditData({ ...editData, seuils_admission: [editData.seuils_admission[0], e.target.value, editData.seuils_admission[2]] })} />
                <label className="block text-xs mb-1">Sciences Economiques</label>
                <input className="w-full border px-2 py-1 mb-2 rounded" value={editData.seuils_admission[2]} onChange={e => setEditData({ ...editData, seuils_admission: [editData.seuils_admission[0], editData.seuils_admission[1], e.target.value] })} />
            </div>
            <label className="block mb-2 text-sm">État de postulation <span className="text-red-600">*</span></label>
            <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editData.etat_postulation === 'ouvert'} onChange={e => setEditData({ ...editData, etat_postulation: e.target.checked ? 'ouvert' : '' })} />
                    Ouvert
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editData.etat_postulation === 'ferme'} onChange={e => setEditData({ ...editData, etat_postulation: e.target.checked ? 'ferme' : '' })} />
                    Fermé
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={editData.etat_postulation === 'bientot'} onChange={e => setEditData({ ...editData, etat_postulation: e.target.checked ? 'bientot' : '' })} />
                    Bientôt
                </label>
            </div>
            <label className="block mb-2 text-sm">Date d'ouverture</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" type="date" value={editData.date_ouverture} onChange={e => setEditData({ ...editData, date_ouverture: e.target.value })} />
            <label className="block mb-2 text-sm">Date de fermeture</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" type="date" value={editData.date_fermeture} onChange={e => setEditData({ ...editData, date_fermeture: e.target.value })} />
            <label className="block mb-2 text-sm">Mission/Objectifs</label>
            <textarea className="w-full border px-2 py-1 mb-3 rounded" value={editData.mission_objectifs} onChange={e => setEditData({ ...editData, mission_objectifs: e.target.value })} />
            <label className="block mb-2 text-sm">Conditions d'admission</label>
            <textarea className="w-full border px-2 py-1 mb-3 rounded" value={editData.conditions_admission} onChange={e => setEditData({ ...editData, conditions_admission: e.target.value })} />
            <label className="block mb-2 text-sm">Formations proposées</label>
            <textarea className="w-full border px-2 py-1 mb-3 rounded" value={editData.formations_proposees} onChange={e => setEditData({ ...editData, formations_proposees: e.target.value })} />
            <label className="block mb-2 text-sm">Déroulement du concours</label>
            <textarea className="w-full border px-2 py-1 mb-3 rounded" value={editData.deroulement_concours} onChange={e => setEditData({ ...editData, deroulement_concours: e.target.value })} />
            <label className="block mb-2 text-sm">Logo (PNG)</label>
            <input
                type="file"
                accept="image/png"
                className="w-full border px-2 py-1 mb-3 rounded"
                onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setEditData({ ...editData, logo: file }); // store the file object (Blob)
                    }
                }}
            />
            <div className="flex justify-end gap-2">
                <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setShowEditModal(false)}>Annuler</button>
                <button className="px-3 py-1 rounded bg-primary-1000 text-white" onClick={async () => {
                    const formData = new FormData();
                    Object.entries(editData).forEach(([key, value]) => {
                        if (key === 'logo' && value instanceof Blob) {
                            formData.append('logo', value);
                        } else if (key === 'seuils_admission') {
                            formData.append(key, JSON.stringify(value));
                        } else if (typeof value === 'string') {
                            formData.append(key, value);
                        } else if (typeof value === 'boolean') {
                            formData.append(key, value ? 'true' : 'false');
                        }
                    });
                    formData.append('id', editData.id); // Make sure to send the university ID

                    const res = await fetch('/admin/universite/edit', {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                        },
                        body: formData
                    });
                    const data = await res.json();
                    setShowEditModal(false);
                    if (data.success) {
                        setNotification({ show: true, type: 'success', title: 'Modifié', message: 'Université modifiée avec succès.' });
                        window.location.reload();
                    } else {
                        setNotification({ show: true, type: 'error', title: 'Erreur', message: data.message || 'La modification a échoué.' });
                    }
                    setTimeout(() => setNotification(n => ({ ...n, show: false })), 2000);
                }}>Sauvegarder</button>
            </div>
        </div>
    </div>
)}
{showDeleteModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg p-6 w-[350px] shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-red-600">Êtes-vous sûr ?</h2>
            <p className="mb-6">Voulez-vous vraiment supprimer cette université ? Cette action est irréversible.</p>
            <div className="flex justify-end gap-2">
                <button
                    className="px-3 py-1 rounded bg-gray-200"
                    onClick={() => setShowDeleteModal(false)}
                >
                    Annuler
                </button>
                <button
                    className="px-3 py-1 rounded bg-red-600 text-white"
                    onClick={async () => {
                        setShowDeleteModal(false);
                        if (deleteId !== null) {
                            await handleDelete(deleteId);
                            setDeleteId(null);
                        }
                    }}
                >
                    Supprimer
                </button>
            </div>
        </div>
    </div>
)}
{showAddModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg p-6 w-[400px] max-h-[90vh] overflow-y-auto shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Ajouter une université</h2>
            <label className="block mb-2 text-sm">Nom <span className="text-red-600">*</span></label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={addData.nom} onChange={e => setAddData({ ...addData, nom: e.target.value })} />
            <label className="block mb-2 text-sm">Université de rattachement</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={addData.universite_rattachement} onChange={e => setAddData({ ...addData, universite_rattachement: e.target.value })} />
            <label className="block mb-2 text-sm">Type <span className="text-red-600">*</span></label>
            <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={addData.type === 'publique'} onChange={e => setAddData({ ...addData, type: e.target.checked ? 'publique' : '' })} />
                    Publique
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={addData.type === 'privee'} onChange={e => setAddData({ ...addData, type: e.target.checked ? 'privee' : '' })} />
                    Privée
                </label>
            </div>
            <label className="block mb-2 text-sm">Année de création</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={addData.annee_creation} onChange={e => setAddData({ ...addData, annee_creation: e.target.value })} />
            <label className="block mb-2 text-sm">Accréditation</label>
            <input type="checkbox" className="mr-2" checked={addData.accreditation} onChange={e => setAddData({ ...addData, accreditation: e.target.checked })} /> Oui
            <label className="block mb-2 text-sm">Concours</label>
            <input type="checkbox" className="mr-2" checked={addData.concours} onChange={e => setAddData({ ...addData, concours: e.target.checked })} /> Oui
            <label className="block mb-2 text-sm">Nombre d'années d'étude <span className="text-red-600">*</span></label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={addData.nombre_annees_etude} onChange={e => setAddData({ ...addData, nombre_annees_etude: e.target.value })} />
            <label className="block mb-2 text-sm">Bac obligatoire</label>
            <input type="checkbox" className="mr-2" checked={addData.bac_obligatoire} onChange={e => setAddData({ ...addData, bac_obligatoire: e.target.checked })} /> Oui
            <label className="block mb-2 text-sm">Localisation <span className="text-red-600">*</span></label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={addData.localisation} onChange={e => setAddData({ ...addData, localisation: e.target.value })} />
            <label className="block mb-2 text-sm">Site web</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" value={addData.site_web} onChange={e => setAddData({ ...addData, site_web: e.target.value })} />
            <label className="block mb-2 text-sm">Seuils d'admission</label>
            <div className="mb-3">
                <label className="block text-xs mb-1">Sciences Maths</label>
                <input className="w-full border px-2 py-1 mb-2 rounded" value={addData.seuils_admission[0]} onChange={e => setAddData({ ...addData, seuils_admission: [e.target.value, addData.seuils_admission[1], addData.seuils_admission[2]] })} />
                <label className="block text-xs mb-1">Sciences Physique</label>
                <input className="w-full border px-2 py-1 mb-2 rounded" value={addData.seuils_admission[1]} onChange={e => setAddData({ ...addData, seuils_admission: [addData.seuils_admission[0], e.target.value, addData.seuils_admission[2]] })} />
                <label className="block text-xs mb-1">Sciences Economiques</label>
                <input className="w-full border px-2 py-1 mb-2 rounded" value={addData.seuils_admission[2]} onChange={e => setAddData({ ...addData, seuils_admission: [addData.seuils_admission[0], addData.seuils_admission[1], e.target.value] })} />
            </div>
            <label className="block mb-2 text-sm">État de postulation <span className="text-red-600">*</span></label>
            <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={addData.etat_postulation === 'ouvert'} onChange={e => setAddData({ ...addData, etat_postulation: e.target.checked ? 'ouvert' : '' })} />
                    Ouvert
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={addData.etat_postulation === 'ferme'} onChange={e => setAddData({ ...addData, etat_postulation: e.target.checked ? 'ferme' : '' })} />
                    Fermé
                </label>
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={addData.etat_postulation === 'bientot'} onChange={e => setAddData({ ...addData, etat_postulation: e.target.checked ? 'bientot' : '' })} />
                    Bientôt
                </label>
            </div>
            <label className="block mb-2 text-sm">Date d'ouverture</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" type="date" value={addData.date_ouverture} onChange={e => setAddData({ ...addData, date_ouverture: e.target.value })} />
            <label className="block mb-2 text-sm">Date de fermeture</label>
            <input className="w-full border px-2 py-1 mb-3 rounded" type="date" value={addData.date_fermeture} onChange={e => setAddData({ ...addData, date_fermeture: e.target.value })} />
            <label className="block mb-2 text-sm">Mission/Objectifs</label>
            <textarea className="w-full border px-2 py-1 mb-3 rounded" value={addData.mission_objectifs} onChange={e => setAddData({ ...addData, mission_objectifs: e.target.value })} />
            <label className="block mb-2 text-sm">Conditions d'admission</label>
            <textarea className="w-full border px-2 py-1 mb-3 rounded" value={addData.conditions_admission} onChange={e => setAddData({ ...addData, conditions_admission: e.target.value })} />
            <label className="block mb-2 text-sm">Formations proposées</label>
            <textarea className="w-full border px-2 py-1 mb-3 rounded" value={addData.formations_proposees} onChange={e => setAddData({ ...addData, formations_proposees: e.target.value })} />
            <label className="block mb-2 text-sm">Déroulement du concours</label>
            <textarea className="w-full border px-2 py-1 mb-3 rounded" value={addData.deroulement_concours} onChange={e => setAddData({ ...addData, deroulement_concours: e.target.value })} />
            <label className="block mb-2 text-sm">Logo (PNG)</label>
            <input
                type="file"
                accept="image/png"
                className="w-full border px-2 py-1 mb-3 rounded"
                onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                        setAddData({ ...addData, logo: file }); // store the file object (Blob)
                    }
                }}
            />
            <div className="flex justify-end gap-2">
                <button className="px-3 py-1 rounded bg-gray-200" onClick={() => setShowAddModal(false)}>Annuler</button>
        <button className="px-3 py-1 rounded bg-primary-1000 text-white" onClick={async () => {
            setNotification({ show: true, type: 'warning', title: 'Ajout', message: 'Ajout en cours...' });

            const formData = new FormData();
            Object.entries(addData).forEach(([key, value]) => {
                if (key === 'logo' && value) {
                    if (value instanceof Blob) {
                        formData.append('logo', value); // send file as 'logo'
                    }
                } else if (key === 'seuils_admission') {
                    formData.append(key, JSON.stringify(value));
                } else if (typeof value === 'string') {
                    formData.append(key, value);
                } else if (typeof value === 'boolean') {
                    formData.append(key, value ? 'true' : 'false');
                }
            });
            const res = await fetch('/admin/universite/add', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                },
                body: formData
            });
            const data = await res.json();
            if (data.success) {
                setNotification({ show: true, type: 'success', title: 'Ajouté', message: 'Université ajoutée avec succès.' });
                setShowAddModal(false);
                window.location.reload();
            } else {
                setNotification({ show: true, type: 'error', title: 'Erreur', message: data.message || "L'ajout a échoué." });
            }
            setTimeout(() => setNotification(n => ({ ...n, show: false })), 2000);
        }}>
            Ajouter
        </button>
        </div>
        </div>
    </div>
)}
        </>
    )
}

export default Dashboard;
