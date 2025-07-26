import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';

type StepOneProps = {
  data: {
    nom_complet: string;
    ville: string;
    age: number | string;
    genre: string;
  };
  setData: (field: string, value: string) => void;
  processing: boolean;
  errors: {
    nom_complet?: string;
    ville?: string;
    age?: string;
    genre?: string;
  };
  submit: (e: React.FormEvent<HTMLFormElement>) => void;
};

function Stepone({ data, setData, processing, errors, submit }: StepOneProps) {
  return (
    <form className="flex flex-col gap-6 pt-20" onSubmit={submit}>
      <div className="grid gap-6">
        {/* Nom complet */}
        <div className="grid gap-2">
          <Label htmlFor="nom_complet">Nom Complet</Label>
          <Input
            id="nom_complet"
            type="text"
            required
            value={data.nom_complet}
            onChange={(e) => setData('nom_complet', e.target.value)}
            disabled={processing}
            placeholder="Votre nom complet"
          />
          <InputError message={errors.nom_complet} />
        </div>

        {/* Ville */}
        <div className="grid gap-2">
          <Label htmlFor="ville">Ville</Label>
          <Input
            id="ville"
            type="text"
            required
            value={data.ville}
            onChange={(e) => setData('ville', e.target.value)}
            disabled={processing}
            placeholder="Votre ville"
          />
          <InputError message={errors.ville} />
        </div>

        {/* Âge */}
        <div className="grid gap-2">
          <Label htmlFor="age">Âge</Label>
          <Input
            id="age"
            type="number"
            required
            min="16"
            max="100"
            value={data.age}
            onChange={(e) => setData('age', e.target.value)}
            disabled={processing}
            placeholder="18"
          />
          <InputError message={errors.age} />
        </div>

        {/* Genre */}
        <div className="grid gap-2">
          <Label>Genre</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="genre"
                value="masculin"
                checked={data.genre === 'masculin'}
                onChange={(e) => setData('genre', e.target.value)}
                disabled={processing}
              />
              Homme
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="genre"
                value="feminin"
                checked={data.genre === 'feminin'}
                onChange={(e) => setData('genre', e.target.value)}
                disabled={processing}
              />
              Femme
            </label>
          </div>
          <InputError message={errors.genre} />
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={processing}>
          {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Suivant
        </Button>
      </div>
    </form>
  );
}

export default Stepone;
