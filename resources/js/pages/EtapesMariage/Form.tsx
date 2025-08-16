import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Mariage, Fonctionnaire } from '@/types';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { MonDatePicker } from '@/components/example-date-picker';

interface EtapeMariageFormProps {
    etape?: {
        id?: number;
        mariage_id: number;
        etape: string;
        statut: string;
        date_debut: string | null;
        date_fin: string | null;
        responsable_id: number | null;
        commentaires: string | null;
    };
    mariages: Mariage[];
    fonctionnaires: Fonctionnaire[];
    etapesOptions: Record<string, string>;
    statutsOptions: Record<string, string>;
    breadcrumbs: BreadcrumbItem[];
    title: string;
}

export default function EtapeMariageForm({ 
    etape, 
    mariages, 
    fonctionnaires, 
    etapesOptions, 
    statutsOptions, 
    breadcrumbs, 
    title 
}: EtapeMariageFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        mariage_id: etape?.mariage_id || '',
        etape: etape?.etape || Object.keys(etapesOptions)[0],
        statut: etape?.statut || Object.keys(statutsOptions)[0],
        date_debut: etape?.date_debut || null,
        date_fin: etape?.date_fin || null,
        responsable_id: etape?.responsable_id || null,
        commentaires: etape?.commentaires || null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (etape) {
            put(`/etapes-mariage/${etape.id}`, {
                onSuccess: () => toast.success('Étape mise à jour avec succès.'),
                onError: () => toast.error('Une erreur est survenue lors de la mise à jour.'),
                preserveScroll: true,
            });
        } else {
            post('/etapes-mariage', {
                onSuccess: () => {
                    toast.success('Étape enregistrée avec succès.');
                    reset();
                },
                onError: () => toast.error('Une erreur est survenue lors de l\'enregistrement.'),
            });
        }
    };

    const getCoupleName = (mariage: Mariage) => {
        return `${mariage.homme?.nom} ${mariage.homme?.prenom} & ${mariage.femme?.nom} ${mariage.femme?.prenom}`;
    };

    const selectedMariage = mariages.find(m => m.id === Number(data.mariage_id));

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">{title}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Colonne 1 */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="mariage_id">Mariage concerné *</Label>
                                <Select
                                    value={data.mariage_id.toString()}
                                    onValueChange={(value) => setData('mariage_id', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un mariage" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mariages.map((mariage) => (
                                            <SelectItem key={mariage.id} value={mariage.id.toString()}>
                                                {getCoupleName(mariage)} - {format(new Date(mariage.date_mariage), 'PP', { locale: fr })}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.mariage_id && <p className="text-sm text-red-500 mt-1">{errors.mariage_id}</p>}
                                
                                {selectedMariage && (
                                    <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                                        <p className="text-sm font-medium">Informations du mariage:</p>
                                        <p className="text-sm">
                                            {format(new Date(selectedMariage.date_mariage), 'PP', { locale: fr })} à {selectedMariage.lieu_mariage}
                                        </p>
                                        <p className="text-sm">Officier: {selectedMariage.officier?.nom} {selectedMariage.officier?.prenom}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <Label htmlFor="etape">Étape *</Label>
                                <Select
                                    value={data.etape}
                                    onValueChange={(value) => setData('etape', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner une étape" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(etapesOptions).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>{value}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.etape && <p className="text-sm text-red-500 mt-1">{errors.etape}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="statut">Statut *</Label>
                                <Select
                                    value={data.statut}
                                    onValueChange={(value) => setData('statut', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(statutsOptions).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>{value}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.statut && <p className="text-sm text-red-500 mt-1">{errors.statut}</p>}
                            </div>
                        </div>
                        
                        {/* Colonne 2 */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <MonDatePicker
                                        label="Date de début"
                                        value={data.date_debut ? new Date(data.date_debut) : null}
                                        onChange={(date) => setData('date_debut', date)}
                                    />
                                    {errors.date_debut && <p className="text-sm text-red-500 mt-1">{errors.date_debut}</p>}
                                </div>
                                
                                <div>
                                    <MonDatePicker
                                        label="Date de fin"
                                        value={data.date_fin ? new Date(data.date_fin) : null}
                                        onChange={(date) => setData('date_fin', date)}
                                        minDate={data.date_debut ? new Date(data.date_debut) : undefined}
                                    />
                                    {errors.date_fin && <p className="text-sm text-red-500 mt-1">{errors.date_fin}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="responsable_id">Responsable</Label>
                                <Select
                                    value={data.responsable_id?.toString() || ''}
                                    onValueChange={(value) => setData('responsable_id', value ? parseInt(value) : null)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un responsable" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value={null}>Non assigné</SelectItem>
                                        {fonctionnaires.map((fonctionnaire) => (
                                            <SelectItem key={fonctionnaire.id} value={fonctionnaire.id.toString()}>
                                                {fonctionnaire.nom} {fonctionnaire.prenom} ({fonctionnaire.fonction})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.responsable_id && <p className="text-sm text-red-500 mt-1">{errors.responsable_id}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="commentaires">Commentaires</Label>
                                <Textarea
                                    id="commentaires"
                                    value={data.commentaires || ''}
                                    onChange={(e) => setData('commentaires', e.target.value)}
                                    placeholder="Notes supplémentaires sur cette étape..."
                                    className="min-h-[100px]"
                                />
                                {errors.commentaires && <p className="text-sm text-red-500 mt-1">{errors.commentaires}</p>}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4 pt-4">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => window.history.back()}
                        >
                            Annuler
                        </Button>
                        <Button 
                            type="submit" 
                            disabled={processing}
                        >
                            {etape ? 'Mettre à jour' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}