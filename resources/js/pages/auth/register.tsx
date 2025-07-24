import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    nom_complet: string;
    ville: string;
    age: string;
    genre: string;
    email: string;
    password: string;
    password_confirmation: string;
    niveau_etude: string;
    filiere: string;
    langue_bac: string;
    moyenne_general_bac: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        nom_complet: '',
        ville: '',
        age: '',
        genre: '',
        email: '',
        password: '',
        password_confirmation: '',
        niveau_etude: '',
        filiere: '',
        langue_bac: '',
        moyenne_general_bac: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Créer un compte étudiant" description="Remplissez vos informations pour créer votre compte">
            <Head title="Register" />

            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="nom_complet">Nom Complet</Label>
                        <Input
                            id="nom_complet"
                            type="text"
                            required
                            autoFocus
                            value={data.nom_complet}
                            onChange={(e) => setData('nom_complet', e.target.value)}
                            disabled={processing}
                            placeholder="Votre nom complet"
                        />
                        <InputError message={errors.nom_complet} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            disabled={processing}
                            placeholder="email@example.com"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="genre">Genre</Label>
                        <Select value={data.genre} onValueChange={(value) => setData('genre', value)} disabled={processing}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez votre genre" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="masculin">Masculin</SelectItem>
                                <SelectItem value="feminin">Féminin</SelectItem>
                                <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.genre} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="niveau_etude">Niveau d'Études</Label>
                        <Select value={data.niveau_etude} onValueChange={(value) => setData('niveau_etude', value)} disabled={processing}>
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez votre niveau" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="baccalaureat">Baccalauréat</SelectItem>
                            </SelectContent>
                        </Select>
                        <InputError message={errors.niveau_etude} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="filiere">Filière</Label>
                        <Input
                            id="filiere"
                            type="text"
                            required
                            value={data.filiere}
                            onChange={(e) => setData('filiere', e.target.value)}
                            disabled={processing}
                            placeholder="Sciences, Lettres, Économie, etc."
                        />
                        <InputError message={errors.filiere} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="langue_bac">Langue du BAC</Label>
                            <Select value={data.langue_bac} onValueChange={(value) => setData('langue_bac', value)} disabled={processing}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Langue" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="francais">Français</SelectItem>
                                    <SelectItem value="arabe">Arabe</SelectItem>
                                    <SelectItem value="anglais">Anglais</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.langue_bac} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="moyenne_general_bac">Moyenne BAC</Label>
                            <Input
                                id="moyenne_general_bac"
                                type="number"
                                required
                                min="0"
                                max="20"
                                step="0.01"
                                value={data.moyenne_general_bac}
                                onChange={(e) => setData('moyenne_general_bac', e.target.value)}
                                disabled={processing}
                                placeholder="15.50"
                            />
                            <InputError message={errors.moyenne_general_bac} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password">Mot de passe</Label>
                        <Input
                            id="password"
                            type="password"
                            required
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            disabled={processing}
                            placeholder="Votre mot de passe"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            required
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            disabled={processing}
                            placeholder="Confirmez votre mot de passe"
                        />
                        <InputError message={errors.password_confirmation} />
                    </div>

                    <Button type="submit" className="w-full" disabled={processing}>
                        {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Créer un compte
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Vous avez déjà un compte ? <TextLink href={route('login')}>Se connecter</TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
