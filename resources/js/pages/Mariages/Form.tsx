import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MonDatePicker } from '@/components/example-date-picker';
import { useState } from 'react';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Citoyen, Fonctionnaire } from '@/types';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';

interface MariageFormProps {
    mariage?: {
        id?: number;
        homme_id: number;
        femme_id: number;
        date_mariage: string;
        heure_mariage: string;
        officier_id: number;
        lieu_mariage: string;
        regime_matrimonial: string;
        temoins_homme: string[] | null;
        temoins_femme: string[] | null;
        statut: string;
        notes: string | null;
    };
    citoyens: Citoyen[];
    fonctionnaires: Fonctionnaire[];
    regimes: Record<string, string>;
    statuts?: Record<string, string>;
    breadcrumbs: BreadcrumbItem[];
    title: string;
}

export default function MariageForm({ 
    mariage, 
    citoyens, 
    fonctionnaires, 
    regimes, 
    statuts = {}, 
    breadcrumbs, 
    title 
}: MariageFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        homme_id: mariage?.homme_id || '',
        femme_id: mariage?.femme_id || '',
        date_mariage: mariage?.date_mariage || '',
        heure_mariage: mariage?.heure_mariage || '10:00',
        officier_id: mariage?.officier_id || '',
        lieu_mariage: mariage?.lieu_mariage || '',
        regime_matrimonial: mariage?.regime_matrimonial || Object.keys(regimes)[0],
        temoins_homme: mariage?.temoins_homme || [],
        temoins_femme: mariage?.temoins_femme || [],
        statut: mariage?.statut || 'en_attente',
        notes: mariage?.notes || '',
    });

    const [newTemoinHomme, setNewTemoinHomme] = useState('');
    const [newTemoinFemme, setNewTemoinFemme] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (mariage) {
            put(`/mariages/${mariage.id}`, {
                onSuccess: () => toast.success('Mariage mis à jour avec succès.'),
                onError: () => toast.error('Une erreur est survenue lors de la mise à jour.'),
                preserveScroll: true,
            });
        } else {
            post('/mariages', {
                onSuccess: () => {
                    toast.success('Mariage enregistré avec succès.');
                    reset();
                },
                onError: () => toast.error('Une erreur est survenue lors de l\'enregistrement.'),
            });
        }
    };

    const addTemoinHomme = () => {
        if (newTemoinHomme.trim()) {
            setData('temoins_homme', [...(data.temoins_homme || []), newTemoinHomme]);
            setNewTemoinHomme('');
        }
    };

    const removeTemoinHomme = (index: number) => {
        const updated = [...(data.temoins_homme || [])];
        updated.splice(index, 1);
        setData('temoins_homme', updated);
    };

    const addTemoinFemme = () => {
        if (newTemoinFemme.trim()) {
            setData('temoins_femme', [...(data.temoins_femme || []), newTemoinFemme]);
            setNewTemoinFemme('');
        }
    };

    const removeTemoinFemme = (index: number) => {
        const updated = [...(data.temoins_femme || [])];
        updated.splice(index, 1);
        setData('temoins_femme', updated);
    };

    const getCitoyenName = (citoyen: Citoyen) => {
        return `${citoyen.nom} ${citoyen.postnom} ${citoyen.prenom}`;
    };

    const selectedHomme = citoyens.find(c => c.id === Number(data.homme_id));
    const selectedFemme = citoyens.find(c => c.id === Number(data.femme_id));
console.log(data)
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">{title}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Colonne 1 - Époux */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="homme_id">Époux</Label>
                                <Select
                                    value={data.homme_id.toString()}
                                    onValueChange={(value) => setData('homme_id', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner l'époux" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {citoyens.filter(c => c.sexe === 'M').map((citoyen) => (
                                            <SelectItem key={citoyen.id} value={citoyen.id.toString()}>
                                                {getCitoyenName(citoyen)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.homme_id && <p className="text-sm text-red-500">{errors.homme_id}</p>}
                                
                                {selectedHomme && (
                                    <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                                        <p className="text-sm font-medium">Informations de l'époux:</p>
                                        <p className="text-sm">
                                            {format(new Date(selectedHomme.date_naissance), 'PP', { locale: fr })} - {selectedHomme.lieu_naissance}
                                        </p>
                                        <p className="text-sm">Fils de {selectedHomme.nom_pere} et {selectedHomme.nom_mere}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div>
                                <Label htmlFor="femme_id">Épouse</Label>
                                <Select
                                    value={data.femme_id.toString()}
                                    onValueChange={(value) => setData('femme_id', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner l'épouse" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {citoyens.filter(c => c.sexe === 'F').map((citoyen) => (
                                            <SelectItem key={citoyen.id} value={citoyen.id.toString()}>
                                                {getCitoyenName(citoyen)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.femme_id && <p className="text-sm text-red-500">{errors.femme_id}</p>}
                                
                                {selectedFemme && (
                                    <div className="mt-2 p-3 border rounded-lg bg-muted/50">
                                        <p className="text-sm font-medium">Informations de l'épouse:</p>
                                        <p className="text-sm">
                                            {format(new Date(selectedFemme.date_naissance), 'PP', { locale: fr })} - {selectedFemme.lieu_naissance}
                                        </p>
                                        <p className="text-sm">Fille de {selectedFemme.nom_pere} et {selectedFemme.nom_mere}</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="date_mariage">Date du mariage</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                            variant="outline"
                                            data-empty={!data.date_mariage}
                                            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                                            >
                                            <CalendarIcon />
                                            {data.date_mariage ? format(new Date(data.date_mariage), "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={data.date_mariage ? new Date(data.date_mariage) : null} onSelect={(date) => setData('date_mariage', date?.toISOString().split('T')[0] || '')} />
                                        </PopoverContent>
                                        </Popover>
                                    {errors.date_mariage && <p className="text-sm text-red-500">{errors.date_mariage}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="heure_mariage">Heure du mariage</Label>
                                    <Input
                                        type="time"
                                        id="time-picker"
                                        step="1"
                                        value={data.heure_mariage}
                                        onChange={(e) => setData('heure_mariage', e.target.value)}
                                        className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                                    />
                                    {errors.heure_mariage && <p className="text-sm text-red-500">{errors.heure_mariage}</p>}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="officier_id">Officier d'état civil</Label>
                                <Select
                                    value={data.officier_id.toString()}
                                    onValueChange={(value) => setData('officier_id', parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner l'officier" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {fonctionnaires.map((fonctionnaire) => (
                                            <SelectItem key={fonctionnaire.id} value={fonctionnaire.id.toString()}>
                                                {fonctionnaire.nom} {fonctionnaire.prenom} ({fonctionnaire.fonction})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.officier_id && <p className="text-sm text-red-500">{errors.officier_id}</p>}
                            </div>
                        </div>
                        
                        {/* Colonne 2 - Détails du mariage */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="lieu_mariage">Lieu du mariage</Label>
                                <Input
                                    id="lieu_mariage"
                                    value={data.lieu_mariage}
                                    onChange={(e) => setData('lieu_mariage', e.target.value)}
                                    error={errors.lieu_mariage}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="regime_matrimonial">Régime matrimonial</Label>
                                <Select
                                    value={data.regime_matrimonial}
                                    onValueChange={(value) => setData('regime_matrimonial', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le régime" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(regimes).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>{value}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.regime_matrimonial && <p className="text-sm text-red-500">{errors.regime_matrimonial}</p>}
                            </div>
                            
                            {Object.keys(statuts).length > 0 && (
                                <div>
                                    <Label htmlFor="statut">Statut</Label>
                                    <Select
                                        value={data.statut}
                                        onValueChange={(value) => setData('statut', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner le statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(statuts).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.statut && <p className="text-sm text-red-500">{errors.statut}</p>}
                                </div>
                            )}
                            
                            <div>
                                <Label>Témoins de l'époux</Label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={newTemoinHomme}
                                        onChange={(e) => setNewTemoinHomme(e.target.value)}
                                        placeholder="Ajouter un témoin"
                                    />
                                    <Button type="button" onClick={addTemoinHomme}>
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {data.temoins_homme?.map((temoin, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                                            <span>{temoin}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeTemoinHomme(index)}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <Label>Témoins de l'épouse</Label>
                                <div className="flex gap-2 mb-2">
                                    <Input
                                        value={newTemoinFemme}
                                        onChange={(e) => setNewTemoinFemme(e.target.value)}
                                        placeholder="Ajouter un témoin"
                                    />
                                    <Button type="button" onClick={addTemoinFemme}>
                                        Ajouter
                                    </Button>
                                </div>
                                <div className="space-y-2">
                                    {data.temoins_femme?.map((temoin, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                                            <span>{temoin}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeTemoinFemme(index)}
                                            >
                                                Supprimer
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes"
                                    value={data.notes || ''}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    error={errors.notes}
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {mariage ? 'Mettre à jour' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}