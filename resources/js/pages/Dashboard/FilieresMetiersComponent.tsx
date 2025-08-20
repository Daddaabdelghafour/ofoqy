import DashboardLayout from '@/layouts/Dashboard-layout';
import { Item } from '@radix-ui/react-dropdown-menu';
import { Pencil, Target,Lamp, Castle, Lightbulb, Banknote, ArrowRight, Backpack} from 'lucide-react';
import { format } from 'path';
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
    };
    element:{
        'nom':string;
        'description':string;
        'competences':string;
        'parcours_formation':string;
        'universite_id':number;
        'image_path':string;
    };
    type: string;
    universiteNames: string[];

}

const FilieresMetiersComponent: React.FC<Props> = ({ student,element, type, universiteNames }) => {
    let champs = [];
    let paragraphe: string = "";
    let competences: string[] = [];
    let parcours: string = "";
    let salairedeb: string= "";
    let salaireexp:string[] = [];
    let debouches: string[] = [];

    if(type=== "metier"){
        champs = element.description.split("/");
        champs[0] && (paragraphe = champs[0]);
        champs[1] && (competences = champs[1].split("*"));
        champs[2] && (parcours = champs[2]);
        champs[3] && (salairedeb = champs[3]);
        champs[4] && (salaireexp = champs[4].split("*"));
        champs[6] && (debouches = champs[6].split("*"));
    }else if(type==="filiere"){
        competences = element.competences.split(",");
        paragraphe=element.description;
        parcours = element.parcours_formation;
    }
    return (
        <DashboardLayout name={student.nom_complet} level={student.filiere}>
        <div className='m-4 pt-8 flex flex-col gap-9'>
          <div className='flex justify-start gap-10 bg-white rounded-[4px]  '>
            <div className="relative w-[350px] min-h-full">
              <img
                src={element.image_path}
                className="absolute inset-0 w-full h-full object-cover rounded-[4px]"
              />
              <span className="absolute left-0 bottom-0 w-full  font-regular text-[16px] tracking-wide text-white py-4 px-3 z-10 text-center backdrop-blur-md">
                {element.nom}
              </span>
            </div>
            <div className='flex flex-col w-full gap-5'>
                <div className='flex gap-3 mt-8'>
                    <Pencil className="w-[30px] h-[30px] rounded-[4px] p-2 text-white bg-primary-1000" />
                    <span className='font-medium text-[20px] text-[#191919]'>Résumé introductif</span>
                </div>
                <p className='font-medium text-[18px] text-[#739194] mt-5 pb-6 pr-3'>{paragraphe}</p>
            </div>
          </div>
          <div className='flex justify-start p-8 bg-white rounded-[4px] mt-7 gap-2'>
            <div className='flex flex-col w-full gap-5'>
                <div className='flex gap-3 '>
                    <Target className="w-[30px] h-[30px] rounded-[4px] p-2 text-white bg-primary-1000" />
                    <span className='font-medium text-[20px] text-[#191919] mb-5'> Compétences clés à maîtriser</span>
                </div>
                <div className='grid grid-cols-2 gap-3 mb-6'>
                    {competences.map((competence, index) => (
                            <span key={index} className='font-regular text-[13,28px] text-primary-1000 border border-primary-1000 border-l-[4px] rounded-[4px] bg-[#1D7A850F] h-[45px] py-2 px-4 '>{competence}</span>
                    ))}
                </div>
            </div>
          </div>
        <div className='flex justify-between gap-3'>
            <div className='flex flex-1 justify-start p-8 pr-5 bg-white rounded-[4px] mt-7 '>
                <div className='flex flex-col w-full gap-5'>
                    <div className='flex gap-3 '>
                        <Lightbulb className="w-[30px] h-[30px] rounded-[4px] p-2 text-white bg-primary-1000" />
                        <span className='font-medium text-[20px] text-[#191919] mb-5'> Parcours de formation</span>
                    </div>
                    <div className='flex justify-start'>
                        <div className='w-[30px] h-[30px] rounded-full bg-[#1D7A8529] p-1 flex justify-center mt-2'>
                        <Castle className=" w-[15px] text-primary-1000 " />
                        </div>
                        <div className='flex flex-col gap-3 ml-4'>
                            <span className='font-regular text-[13.5px] text-[#739194]'>Niveau d’accès :</span>
                            <span className='font-medium text-[15px] text-[#191919]'>{parcours}</span>
                        </div>
                    </div>
                </div>
            </div>
            {type==='metier' ? (
            <div className='flex justify-between gap-'>
                <div className='flex flex-1 justify-start p-8 bg-white rounded-[4px] mt-7'>
                    <div className='flex flex-col w-full gap-5'>
                        <div className='flex gap-3 '>
                            <Banknote className="w-[30px] h-[30px] rounded-[4px] p-2 text-white bg-primary-1000" />
                            <span className='font-medium text-[20px] text-[#191919] mb-5'>Salaire indicatif (Maroc)</span>
                        </div>
                        <div className='flex flex-col'>
                            <div className='flex items-center gap-2'>
                                <span className='font-regular text-[13.5px] text-[#739194]'>{salairedeb.split(":")[0]}</span>
                                <ArrowRight className='text-[#739194] w-[13px]' />
                                <span className='font-regular text-[#191919] text-[13px]'>{salairedeb.split(":")[1]}/mois</span>


                            </div>
                            <div className='flex gap-3 items-center mt-4'>
                                <span className='font-regular text-[13.5px] text-[#739194]'>{salaireexp[1].split(":")[0]}</span>
                                <ArrowRight className='text-[#739194] w-[13px]' />
                                <span className='font-regular text-[#191919] text-[13px]'>{salaireexp[1].split(":")[1]}/mois</span>


                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className='flex justify-start p-8 bg-white rounded-[4px] mt-7'>
                    <div className='flex flex-col w-full gap-5'>
                        <div className='flex gap-3 '>
                            <Backpack className="w-[30px] h-[30px] rounded-[4px] p-2 text-white bg-primary-1000" />
                            <span className='font-medium text-[20px] text-[#191919]'>Débouchés professionnels</span>
                        </div>
                        <div className='mt-5'>
                            {debouches.map((debouché, index) => (
                                <div key={index} className='flex flex-col '>
                                    <span className='font-medium text-[13.5px] text-[#739194] mb-2'> •{debouché}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </div>):
                    (<div className='flex justify-start p-8 bg-white rounded-[4px] mt-7'>
                    <div className='flex flex-col w-full gap-5'>
                        <div className='flex gap-3 '>
                            <Backpack className="w-[30px] h-[30px] rounded-[4px] p-2 text-white bg-primary-1000" />
                            <span className='font-medium text-[20px] text-[#191919]'>Universités</span>
                        </div>
                        <div className='mt-5'>
                            {universiteNames.map((universite, index) => (
                                <div key={index} className='flex flex-col '>
                                    <span className='font-medium text-[13.5px] text-[#739194] mb-2'> •{universite}</span>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>)}
        
        
        </div>
    </div>

        </DashboardLayout>
    );
};

export default FilieresMetiersComponent;