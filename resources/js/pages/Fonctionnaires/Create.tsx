import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BreadcrumbItem } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface FonctionnairesCreateProps {
    fonctions: string[];
    users: User[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Fonctionnaires', href: '/fonctionnaires' },
    { title: 'Ajouter un fonctionnaire', href: '/fonctionnaires/create' },
];

export default function FonctionnairesCreate({ fonctions, users }: FonctionnairesCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        postnom: '',
        prenom: '',
        fonction: '',
        grade: '',
        matricule: '',
        email: '',
        telephone: '',
        date_embauche: new Date(),
        photo: null as File | null,
        user_id: null as number | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/fonctionnaires');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Ajouter un fonctionnaire" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Ajouter un fonctionnaire</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                <div className="space-y-2">
                            <Label htmlFor="user_id">Associer à un utilisateur existant</Label>
                            <Select
                                value={data.user_id ? data.user_id.toString() : ''}
                                onValueChange={(value) => setData('user_id', value ? parseInt(value) : null)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un utilisateur" />
                                </SelectTrigger>
                                <SelectContent>
                                    {users.map((user) => (
                                        <SelectItem key={user.id} value={user.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <UserIcon className="h-4 w-4" />
                                                <span>{user.name} ({user.email})</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.user_id && <p className="text-sm text-destructive">{errors.user_id}</p>}
                        </div>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                            <Label htmlFor="nom">Nom</Label>
                            <Input
                                id="nom"
                                value={data.nom}
                                onChange={(e) => setData('nom', e.target.value)}
                                placeholder="Doe"
                            />
                            {errors.nom && <p className="text-sm text-destructive">{errors.nom}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postnom">Postnom</Label>
                            <Input
                                id="postnom"
                                value={data.postnom}
                                onChange={(e) => setData('postnom', e.target.value)}
                                placeholder="John"
                            />
                            {errors.postnom && <p className="text-sm text-destructive">{errors.postnom}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="prenom">Prénom</Label>
                            <Input
                                id="prenom"
                                value={data.prenom}
                                onChange={(e) => setData('prenom', e.target.value)}
                                placeholder="Smith"
                            />
                            {errors.prenom && <p className="text-sm text-destructive">{errors.prenom}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="fonction">Fonction</Label>
                            <Select
                                value={data.fonction}
                                onValueChange={(value) => setData('fonction', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner une fonction" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fonctions.map((fonction) => (
                                        <SelectItem key={fonction} value={fonction}>
                                            {fonction}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.fonction && <p className="text-sm text-destructive">{errors.fonction}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="grade">Grade</Label>
                            <Input
                                id="grade"
                                value={data.grade}
                                onChange={(e) => setData('grade', e.target.value)}
                                placeholder="Grade du fonctionnaire"
                            />
                            {errors.grade && <p className="text-sm text-destructive">{errors.grade}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="matricule">Matricule</Label>
                            <Input
                                id="matricule"
                                value={data.matricule}
                                onChange={(e) => setData('matricule', e.target.value)}
                                placeholder="MAT12345"
                            />
                            {errors.matricule && <p className="text-sm text-destructive">{errors.matricule}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="john.doe@example.com"
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="telephone">Téléphone</Label>
                            <Input
                                id="telephone"
                                value={data.telephone}
                                onChange={(e) => setData('telephone', e.target.value)}
                                placeholder="+243 81 234 5678"
                            />
                            {errors.telephone && <p className="text-sm text-destructive">{errors.telephone}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date_embauche">Date d'embauche</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !data.date_embauche && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.date_embauche ? (
                                            format(data.date_embauche, "PPP", { locale: fr })
                                        ) : (
                                            <span>Choisir une date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={data.date_embauche}
                                        onSelect={(date) => date && setData('date_embauche', date)}
                                        initialFocus
                                        locale={fr}
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.date_embauche && <p className="text-sm text-destructive">{errors.date_embauche}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="photo">Photo</Label>
                            <Input
                                id="photo"
                                type="file"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        setData('photo', e.target.files[0]);
                                    }
                                }}
                            />
                            {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/fonctionnaires">
                            <Button variant="outline" type="button">
                                Annuler
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}