import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BreadcrumbItem } from '@/types';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Mariage } from '@/types';

interface PaiementsCreateProps extends PageProps {
    mariages: Array<{
        id: number;
        ref: string;
        homme: {
            nom: string;
            postnom: string;
            prenom: string;
        };
        femme: {
            nom: string;
            postnom: string;
            prenom: string;
        };
    }>;
    fonctionnaires: Array<{
        id: number;
        nom_complet: string;
    }>;
    modes_paiement: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Paiements', href: '/paiements' },
    { title: 'Nouveau paiement', href: '/paiements/create' },
];

export default function PaiementsCreate({ mariages, fonctionnaires, modes_paiement }: PaiementsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        mariage_id: '',
        montant: '',
        mode_paiement: '',
        reference_paiement: '',
        date_paiement: new Date(),
        statut: 'payé',
        encaisser_par: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/paiements');
    };
    const getCoupleNames = (mariage: Mariage) => {
            return `${mariage.homme?.nom} ${mariage.homme?.postnom} ${mariage.homme?.prenom} & ${mariage.femme?.nom} ${mariage.femme?.postnom} ${mariage.femme?.prenom}`;
        };
console.log(mariages);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Nouveau paiement" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Enregistrer un paiement</h1>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="mariage_id">Mariage *</Label>
                            <Select
                                value={data.mariage_id}
                                onValueChange={(value) => setData('mariage_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un mariage" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mariages.map((mariage) => (
                                        <SelectItem key={mariage.id} value={mariage.id.toString()}>
                                            {getCoupleNames(mariage)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.mariage_id && <p className="text-sm text-destructive">{errors.mariage_id}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="montant">Montant (CDF) *</Label>
                            <Input
                                id="montant"
                                type="number"
                                value={data.montant}
                                onChange={(e) => setData('montant', e.target.value)}
                                placeholder="50000"
                                step="0.01"
                            />
                            {errors.montant && <p className="text-sm text-destructive">{errors.montant}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mode_paiement">Mode de paiement *</Label>
                            <Select
                                value={data.mode_paiement}
                                onValueChange={(value) => setData('mode_paiement', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un mode" />
                                </SelectTrigger>
                                <SelectContent>
                                    {modes_paiement.map((mode) => (
                                        <SelectItem key={mode} value={mode}>
                                            {mode}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.mode_paiement && <p className="text-sm text-destructive">{errors.mode_paiement}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="reference_paiement">Référence paiement *</Label>
                            <Input
                                id="reference_paiement"
                                value={data.reference_paiement}
                                onChange={(e) => setData('reference_paiement', e.target.value)}
                                placeholder="REF123456"
                            />
                            {errors.reference_paiement && <p className="text-sm text-destructive">{errors.reference_paiement}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date_paiement">Date paiement *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !data.date_paiement && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {data.date_paiement ? (
                                            format(data.date_paiement, "PPP", { locale: fr })
                                        ) : (
                                            <span>Choisir une date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={data.date_paiement}
                                        onSelect={(date) => date && setData('date_paiement', date)}
                                        initialFocus
                                        locale={fr}
                                    />
                                </PopoverContent>
                            </Popover>
                            {errors.date_paiement && <p className="text-sm text-destructive">{errors.date_paiement}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="statut">Statut *</Label>
                            <Select
                                value={data.statut}
                                onValueChange={(value) => setData('statut', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="payé">Payé</SelectItem>
                                    <SelectItem value="impayé">Impayé</SelectItem>
                                    <SelectItem value="remboursé">Remboursé</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.statut && <p className="text-sm text-destructive">{errors.statut}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="encaisser_par">Encaissé par *</Label>
                            <Select
                                value={data.encaisser_par}
                                onValueChange={(value) => setData('encaisser_par', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionner un fonctionnaire" />
                                </SelectTrigger>
                                <SelectContent>
                                    {fonctionnaires.map((fonctionnaire) => (
                                        <SelectItem key={fonctionnaire.id} value={fonctionnaire.id.toString()}>
                                            {fonctionnaire.nom_complet}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.encaisser_par && <p className="text-sm text-destructive">{errors.encaisser_par}</p>}
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Informations supplémentaires..."
                            />
                            {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-4">
                        <Link href="/paiements">
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