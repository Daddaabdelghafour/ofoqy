import React from 'react';

type StepFormProps = {
  currentStep: number;
  data: any;
  setData: (field: string, value: string) => void;
  processing: boolean;
  errors: any;
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
};
export default function StepForm({
  currentStep,
  data,
  setData,
  processing,
  errors,
  submit,
}: StepFormProps) {
  return (
    <form onSubmit={submit} className="w-full max-w-lg mx-auto">
      {/* Step 1 */}
      <div style={{ display: currentStep === 1 ? 'block' : 'none' }}>
        {/* Example inputs */}
         <div className="grid gap-2"> 
          <label>Email</label>
          <input
            type="email"
            value={data.email}
            onChange={e => setData('email', e.target.value)}
            disabled={processing}
            required
          />
          <InputError message={errors.email} />
          </div>
       <div className="grid gap-2">
         <label>Mot de passe</label>
          <input
            type="password"
            value={data.password}
            onChange={e => setData('password', e.target.value)}
            disabled={processing}
            required
          />
          <InputError message={errors.password} />
      </div>
         <div className="grid gap-2">
          <label>Confirmer mot de passe</label>
          <input
            type="password"
            value={data.password_confirmation}
            onChange={e => setData('password_confirmation', e.target.value)}
            disabled={processing}
            required
          />
          <InputError message={errors.password_confirmation} />
        </div>
       </div> 
      

      {/* Step 2 */}
      <div style={{ display: currentStep === 2 ? 'block' : 'none' }}>
         <div className="grid gap-2">
          <label>Nom complet</label>
          <input
            type="text"
            value={data.nom_complet}
            onChange={e => setData('nom_complet', e.target.value)}
            disabled={processing}
            required
          />
          <InputError message={errors.nom_complet} />
        </div>
         <div className="grid gap-2">
          <label>Ville</label>
          <input
            type="text"
            value={data.ville}
            onChange={e => setData('ville', e.target.value)}
            disabled={processing}
            required
          />
          <InputError message={errors.ville} />
        </div>
         <div className="grid gap-2">
          <label>Âge</label>
          <input
            type="number"
            value={data.age}
            onChange={e => setData('age', e.target.value)}
            disabled={processing}
            min={16}
            max={100}
            required
          />
          <InputError message={errors.age} />
        </div>
        <fieldset className='grid gap-2'>
          <legend>Genre</legend>
            <input
              type="radio"
              name="genre"
              value="masculin"
              checked={data.genre === 'masculin'}
              onChange={e => setData('genre', e.target.value)}
              disabled={processing}
            />
            <label>Homme</label>
           
            <input
              type="radio"
              name="genre"
              value="feminin"
              checked={data.genre === 'feminin'}
              onChange={e => setData('genre', e.target.value)}
              disabled={processing}
            />
            <label>Femme</label>
          <InputError message={errors.genre} />
        </fieldset>
      </div>

      {/* Step 3 */}
      <div style={{ display: currentStep === 3 ? 'block' : 'none' }}>
         <div className="grid gap-2">
          <label>Niveau d'étude</label>
          <input
            type="text"
            value={data.niveau_etude}
            onChange={e => setData('niveau_etude', e.target.value)}
            disabled={processing}
            required
          />
          <InputError message={errors.niveau_etude} />
        </div>
         <div className="grid gap-2">
          <label>Filière</label>
          <input
            type="text"
            value={data.filiere}
            onChange={e => setData('filiere', e.target.value)}
            disabled={processing}
            required
          />
          <InputError message={errors.filiere} />
        </div>
         <div className="grid gap-2">
          <label>Langue Bac</label>
          <input
            type="text"
            value={data.langue_bac}
            onChange={e => setData('langue_bac', e.target.value)}
            disabled={processing}
            required
          />
          {errors.langue_bac && <p className="text-red-600">{errors.langue_bac}</p>}
        </div>
         <div className="grid gap-2">
          <label>Moyenne générale Bac</label>
          <input
            type="text"
            value={data.moyenne_general_bac}
            onChange={e => setData('moyenne_general_bac', e.target.value)}
            disabled={processing}
            required
          />
          {errors.moyenne_general_bac && <p className="text-red-600">{errors.moyenne_general_bac}</p>}
        </div>
      </div>
    </form>
  );
}