import React from 'react';
import InputError from '@/components/input-error';

type StepFormProps = {
  currentStep: number;
  data: any;
  setData: (field: string, value: string) => void;
  processing: boolean;
  errors: any;
};
const moroccancities=[
  "Casablanca",
  "Rabat",
  "Fès",
  "Marrakech",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Tétouan",
  "Khouribga",
  "El Jadida",
  "Kénitra",
  "Nador",
  "Safi",
  "Mohammédia",
  "Béni Mellal",
  "Taza",
  "Errachidia",
  "Ouarzazate",
  "Laâyoune",
  "Dakhla",
  "Settat",
  "Larache",
  "Guelmim",
  "Khemisset",
  "Essaouira",
  "Taourirt",
  "Berkane",
  "Al Hoceïma"
];
export default function StepForm({
  currentStep,
  data,
  setData,
  processing,
  errors,
}: StepFormProps) {
  return (
    <div className='mt-14'>
      {/* Step 1 */}
      <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
        <div className="grid gap-2">
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'>Email <span className='text-red-600'>*</span></label>
          <input
            type="email"
            value={data.email}
            onChange={e => setData('email', e.target.value)}
            disabled={processing}
            className='h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3'
            placeholder='Ajouter votre adresse email'
          />
          <InputError message={errors.email} />
        </div>
        <div className="grid gap-2">
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]' >Mot de passe <span className='text-red-600'>*</span></label>
          <input
            type="password"
            className='h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3'
            placeholder='Créer votre mot de passe'
            value={data.password}
            onChange={e => setData('password', e.target.value)}
            disabled={processing}
          />
          <InputError message={errors.password} />
        </div>
        <div className="grid gap-2">
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'>Confirmer mot de passe <span className='text-red-600'>*</span></label>
          <input
            type="password"
            className='h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3'
            placeholder='Confirmer votre mot de passe'
            value={data.password_confirmation}
            onChange={e => setData('password_confirmation', e.target.value)}
            disabled={processing}
          />
          <InputError message={errors.password_confirmation} />
        </div>
      </div>

      {/* Step 2 */}
      <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
        <div className="grid gap-2">
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'>Nom complet <span className='text-red-600'>*</span></label>
          <input
            type="text"
            className='h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3'
            placeholder='Ajouter votre nom complet'
            value={data.nom_complet}
            onChange={e => setData('nom_complet', e.target.value)}
            disabled={processing}
          />
          <InputError message={errors.nom_complet} />
        </div>
        <div className="grid gap-2">
         <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'>Ville <span className='text-red-600'>*</span></label>
          <select
            className='h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3'
            value={data.ville}
            onChange={e => setData('ville', e.target.value)}
            disabled={processing}
          >
            <option value="">Sélectionnez votre ville</option>
            {moroccancities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <InputError message={errors.ville} />
        </div>
        <div className="grid gap-2">
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'>Âge <span className='text-red-600'>*</span></label>
          <input
            type="number"
            className='h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3'
            placeholder='Ajouter votre age'
            value={data.age}
            onChange={e => setData('age', e.target.value)}
            disabled={processing}
            min={16}
            max={100}
          />
          <InputError message={errors.age} />
        </div>
        <fieldset className="grid gap-2">
          <legend className=' font-medium text-[16px] text-[#5B5B5B]'>Genre <span className='text-red-600'>*</span></legend>
          <div className='flex justify-items-start m-3'>
          <div className='mr-10 flex'>
          <input
            type="radio"
            name="genre"
             className='w-6 h-6 mr-2'
            value="masculin"
            checked={data.genre === 'masculin'}
            onChange={e => setData('genre', e.target.value)}
            disabled={processing}
          />
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'>Homme</label>
          </div>
          <div className='mr-10 flex'>
          <input
            type="radio"
            className='w-6 h-6 mr-2'
            name="genre"
            value="feminin"
            checked={data.genre === 'feminin'}
            onChange={e => setData('genre', e.target.value)}
            disabled={processing}
          />
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'>Femme</label>
          </div>
          </div>
          <InputError message={errors.genre} />
        </fieldset>
      </div>

      {/* Step 3 */}
      <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
        <div className="grid gap-2">
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'><span className='text-red-600'>*</span>Votre niveau d'etude</label>
          <input
            type="text"
            placeholder='Baccalaureat'
            className='h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3'
            value="Baccalaureat"
            onChange={e => setData('niveau_etude', e.target.value)}
            disabled={processing}
          />
        </div>
        <div className="grid gap-2">
          <label className="font-medium text-[16px] leading-100 text-[#5B5B5B]">
            Votre filière<span className="text-red-600">*</span>
          </label>
          <select
            className="h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3"
            value={data.filiere}
            onChange={(e) => setData('filiere', e.target.value)}
            disabled={processing}
          >
            <option value="">-- Sélectionnez votre filière --</option>
            <option value="Sciences mathématiques">Sciences Mathématiques</option>
            <option value="Sciences physiquw">Sciences physiques</option>
            <option value="Sciences Techniques">Sciences Techniques</option>
            <option value="Sciences Économiques">Sciences Économiques</option>
            <option value="Sciences de vie">Sciences de vie</option>
          </select>
          <InputError message={errors.filiere} />
        </div>
        <div className="grid gap-2">
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'>Votre langue du Bac<span className='text-red-600'>*</span></label>
          <select
            className="h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3"
            value={data.langue_bac}
            onChange={(e) => setData('langue_bac', e.target.value)}
            disabled={processing}
          >
            <option value="">-- Sélectionnez votre langue de bac --</option>
            <option value="arabe">arabe</option>
            <option value="francais">francais</option>
            <option value="anglais">anglais</option>
          </select>
          <InputError message={errors.langue_bac} />
        </div>
        <div className="grid gap-2">
          <label className='font-medium text-[16px] leading-100 text-[#5B5B5B]'>Moyenne générale Bac<span className='text-red-600'>*</span></label>
          <input
            type="text"
            className='h-[54px] border-[1px] border-[#19191962] rounded-[3px] p-4 text-[14px] mb-3'
            placeholder='10.00'
            value={data.moyenne_general_bac}
            onChange={e => setData('moyenne_general_bac', e.target.value)}
            disabled={processing}
          />
          {errors.moyenne_general_bac && (
            <p className="text-red-600">{errors.moyenne_general_bac}</p>
          )}
        </div>
      </div>
    </div>
  );
}
