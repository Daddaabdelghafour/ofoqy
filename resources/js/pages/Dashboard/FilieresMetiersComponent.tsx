import DashboardLayout from '@/layouts/Dashboard-layout';
import { ArrowRight, Backpack, Banknote, Castle, Lightbulb, Pencil, Target } from 'lucide-react';
import React from 'react';
interface Props {
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
    element: {
        nom: string;
        description: string;
        competences: string;
        parcours_formation: string;
        universite_id: number;
        image_path: string;
    };
    type: string;
    universiteNames: string[];
}

const FilieresMetiersComponent: React.FC<Props> = ({ student, element, type, universiteNames }) => {
    let champs = [];
    let paragraphe: string = '';
    let competences: string[] = [];
    let parcours: string = '';
    let salairedeb: string = '';
    let salaireexp: string[] = [];
    let debouches: string[] = [];

    if (type === 'metier') {
        champs = element.description.split('/');
        champs[0] && (paragraphe = champs[0]);
        champs[1] && (competences = champs[1].split('*'));
        champs[2] && (parcours = champs[2]);
        champs[3] && (salairedeb = champs[3]);
        champs[4] && (salaireexp = champs[4].split('*'));
        champs[6] && (debouches = champs[6].split('*'));
    } else if (type === 'filiere') {
        competences = element.competences.split(',');
        paragraphe = element.description;
        parcours = element.parcours_formation;
    }
    return (
        <DashboardLayout profile_picture_path={student.profile_photo_path || ''} name={student.nom_complet} level={student.filiere}>
            <div className="m-4 flex flex-col gap-9 pt-8">
                <div className="flex justify-start gap-10 rounded-[4px] bg-white">
                    <div className="relative min-h-full w-[350px]">
                        <img src={element.image_path} className="absolute inset-0 h-full w-full rounded-[4px] object-cover" />
                        <span className="font-regular absolute bottom-0 left-0 z-10 w-full px-3 py-4 text-center text-[16px] tracking-wide text-white backdrop-blur-md">
                            {element.nom}
                        </span>
                    </div>
                    <div className="flex w-full flex-col gap-5">
                        <div className="mt-8 flex gap-3">
                            <Pencil className="h-[30px] w-[30px] rounded-[4px] bg-primary-1000 p-2 text-white" />
                            <span className="text-[20px] font-medium text-[#191919]">Résumé introductif</span>
                        </div>
                        <p className="mt-5 pb-6 pr-3 text-[18px] font-medium text-[#739194]">{paragraphe}</p>
                    </div>
                </div>
                <div className="mt-7 flex justify-start gap-2 rounded-[4px] bg-white p-8">
                    <div className="flex w-full flex-col gap-5">
                        <div className="flex gap-3">
                            <Target className="h-[30px] w-[30px] rounded-[4px] bg-primary-1000 p-2 text-white" />
                            <span className="mb-5 text-[20px] font-medium text-[#191919]"> Compétences clés à maîtriser</span>
                        </div>
                        <div className="mb-6 grid grid-cols-2 gap-3">
                            {competences.map((competence, index) => (
                                <span
                                    key={index}
                                    className="font-regular h-[45px] rounded-[4px] border border-l-[4px] border-primary-1000 bg-[#1D7A850F] px-4 py-2 text-[13,28px] text-primary-1000"
                                >
                                    {competence}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-3">
                    <div className="mt-7 flex flex-1 justify-start rounded-[4px] bg-white p-8 pr-5">
                        <div className="flex w-full flex-col gap-5">
                            <div className="flex gap-3">
                                <Lightbulb className="h-[30px] w-[30px] rounded-[4px] bg-primary-1000 p-2 text-white" />
                                <span className="mb-5 text-[20px] font-medium text-[#191919]"> Parcours de formation</span>
                            </div>
                            <div className="flex justify-start">
                                <div className="mt-2 flex h-[30px] w-[30px] justify-center rounded-full bg-[#1D7A8529] p-1">
                                    <Castle className="w-[15px] text-primary-1000" />
                                </div>
                                <div className="ml-4 flex flex-col gap-3">
                                    <span className="font-regular text-[13.5px] text-[#739194]">Niveau d’accès :</span>
                                    <span className="text-[15px] font-medium text-[#191919]">{parcours}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {type === 'metier' ? (
                        <div className="gap- flex justify-between">
                            <div className="mt-7 flex flex-1 justify-start rounded-[4px] bg-white p-8">
                                <div className="flex w-full flex-col gap-5">
                                    <div className="flex gap-3">
                                        <Banknote className="h-[30px] w-[30px] rounded-[4px] bg-primary-1000 p-2 text-white" />
                                        <span className="mb-5 text-[20px] font-medium text-[#191919]">Salaire indicatif (Maroc)</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <span className="font-regular text-[13.5px] text-[#739194]">{salairedeb.split(':')[0]}</span>
                                            <ArrowRight className="w-[13px] text-[#739194]" />
                                            <span className="font-regular text-[13px] text-[#191919]">{salairedeb.split(':')[1]}/mois</span>
                                        </div>
                                        <div className="mt-4 flex items-center gap-3">
                                            <span className="font-regular text-[13.5px] text-[#739194]">{salaireexp[1].split(':')[0]}</span>
                                            <ArrowRight className="w-[13px] text-[#739194]" />
                                            <span className="font-regular text-[13px] text-[#191919]">{salaireexp[1].split(':')[1]}/mois</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-7 flex justify-start rounded-[4px] bg-white p-8">
                                <div className="flex w-full flex-col gap-5">
                                    <div className="flex gap-3">
                                        <Backpack className="h-[30px] w-[30px] rounded-[4px] bg-primary-1000 p-2 text-white" />
                                        <span className="text-[20px] font-medium text-[#191919]">Débouchés professionnels</span>
                                    </div>
                                    <div className="mt-5">
                                        {debouches.map((debouché, index) => (
                                            <div key={index} className="flex flex-col">
                                                <span className="mb-2 text-[13.5px] font-medium text-[#739194]"> •{debouché}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-7 flex justify-start rounded-[4px] bg-white p-8">
                            <div className="flex w-full flex-col gap-5">
                                <div className="flex gap-3">
                                    <Backpack className="h-[30px] w-[30px] rounded-[4px] bg-primary-1000 p-2 text-white" />
                                    <span className="text-[20px] font-medium text-[#191919]">Universités</span>
                                </div>
                                <div className="mt-5">
                                    {universiteNames.map((universite, index) => (
                                        <div key={index} className="flex flex-col">
                                            <span className="mb-2 text-[13.5px] font-medium text-[#739194]"> •{universite}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default FilieresMetiersComponent;
