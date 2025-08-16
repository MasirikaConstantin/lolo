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

interface PaiementsEditProps extends PageProps {
    paiement: {
        id: number;
        ref: string;
        mariage_id: number;
        mariage_ref: string;
        montant: number;
        mode_paiement: string;
        reference_paiement: string;
        date_paiement: string;
        statut: string;
        encaisser_par: number;
        notes: string | null;
    };
    fonctionnaires: Array<{
        id: number;
        nom_complet: string;
    }>;
    modes_paiement: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Paiements', href: '/paiements' },
    { title: 'Modifier paiement', href: '' },
];

export default function PaiementsEdit({ paiement, fonctionnaires, modes_paiement }: PaiementsEditProps) {
    const { data, setData, post, processing, errors } = useForm({
        montant: paiement.montant,
        mode_paiement: paiement.mode_paiement,
        reference_paiement: paiement.reference_paiement,
        date_paiement: new Date(paiement.date_paiement),
        statut: paiement.statut,
        encaisser_par: paiement.encaisser_par.toString(),
        notes: paiement.notes || '',
        _method: 'PUT' as const,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/paiements/${paiement.id}`, data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Modifier paiement ${paiement.ref}`} />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Modifier le paiement {paiement.ref}</h1>
                    <div className="text-sm text-muted-foreground">
                        Mariage: {paiement.mariage_ref}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="montant">Montant (CDF) *</Label>
                            <Input
                                id="montant"
                                type="number"
                                value={data.montant}
                                onChange={(e) => setData('montant', parseFloat(e.target.value))}
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