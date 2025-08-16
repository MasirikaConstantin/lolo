import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Mariage, Fonctionnaire } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { MonDatePicker } from '@/components/example-date-picker';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DocumentMariageFormProps {
    document?: {
        id?: number;
        mariage_id: number;
        type_document: string;
        numero_document: string;
        date_emission: string;
        date_expiration: string | null;
        fichier: string | null;
        livre: boolean;
        date_livraison: string | null;
        livre_par: number | null;
    };
    mariages: Mariage[];
    fonctionnaires: Fonctionnaire[];
    typesDocuments: Record<string, string>;
    breadcrumbs: BreadcrumbItem[];
    title: string;
}

export default function DocumentMariageForm({ 
    document, 
    mariages, 
    fonctionnaires, 
    typesDocuments, 
    breadcrumbs, 
    title 
}: DocumentMariageFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        mariage_id: document?.mariage_id || '',
        type_document: document?.type_document || Object.keys(typesDocuments)[0],
        numero_document: document?.numero_document || '',
        date_emission: document?.date_emission || '',
        date_expiration: document?.date_expiration || null,
        fichier: null as File | null,
        livre: document?.livre || false,
        date_livraison: document?.date_livraison || null,
        livre_par: document?.livre_par || null,
    });

    const [previewFile, setPreviewFile] = useState<string | null>(document?.fichier || null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        if (document) {
            put(`/documents-mariage/${document.id}`, {
                onSuccess: () => toast.success('Document mis à jour avec succès.'),
                onError: () => toast.error('Une erreur est survenue lors de la mise à jour.'),
                preserveScroll: true,
            });
        } else {
            post('/documents-mariage', {
                onSuccess: () => {
                    toast.success('Document enregistré avec succès.');
                    reset();
                },
                onError: () => toast.error('Une erreur est survenue lors de l\'enregistrement.'),
            });
        }
    };

    const handleFileChange = (file: File | null) => {
        setData('fichier', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewFile(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewFile(null);
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
                                <Label htmlFor="mariage_id">Mariage concerné</Label>
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
                                {errors.mariage_id && <p className="text-sm text-red-500">{errors.mariage_id}</p>}
                                
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
                                <Label htmlFor="type_document">Type de document</Label>
                                <Select
                                    value={data.type_document}
                                    onValueChange={(value) => setData('type_document', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(typesDocuments).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>{value}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type_document && <p className="text-sm text-red-500">{errors.type_document}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="numero_document">Numéro du document</Label>
                                <Input
                                    id="numero_document"
                                    value={data.numero_document}
                                    onChange={(e) => setData('numero_document', e.target.value)}
                                />
                                {errors.numero_document && <p className="text-sm text-red-500">{errors.numero_document}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="date_emission">Date d'émission</Label>
                                    <MonDatePicker
                                        label="Date d'émision"
                                        value={data.date_emission}
                                        onChange={(date) => setData('date_emission', date)}
                                    />
                                    {errors.date_emission && <p className="text-sm text-red-500">{errors.date_emission}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="date_expiration">Date d'expiration</Label>
                                    <MonDatePicker
                                        label="Date d'expiration"
                                        value={data.date_expiration}
                                        onChange={(date) => setData('date_expiration', date)}
                                        minDate={data.date_emission ? new Date(data.date_emission) : new Date()}
                                    />
                                    {errors.date_expiration && <p className="text-sm text-red-500">{errors.date_expiration}</p>}
                                </div>
                            </div>
                        </div>
                        
                        {/* Colonne 2 */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="fichier">Document scanné</Label>
                                <Input
                                    type="file"
                                    id="fichier"
                                    onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
                                    accept="application/pdf,image/*"
                                />
                                {errors.fichier && <p className="text-sm text-red-500">{errors.fichier}</p>}
                            </div>
                            
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="livre"
                                    checked={data.livre}
                                    onCheckedChange={(checked) => {
                                        setData('livre', Boolean(checked));
                                        if (!checked) {
                                            setData('date_livraison', null);
                                            setData('livre_par', null);
                                        }
                                    }}
                                />
                                <Label htmlFor="livre">Document livré</Label>
                            </div>
                            
                            {data.livre && (
                                <>
                                    <div>
                                        <MonDatePicker
                                            label="Date de livraison"
                                            value={data.date_livraison}
                                            onChange={(date) => setData('date_livraison', date)}
                                            maxDate={new Date()}
                                        />
                                        {errors.date_livraison && <p className="text-sm text-red-500">{errors.date_livraison}</p>}
                                    </div>
                                    
                                    <div>
                                        <Label htmlFor="livre_par">Livré par</Label>
                                        <Select
                                            value={data.livre_par?.toString() || ''}
                                            onValueChange={(value) => setData('livre_par', parseInt(value))}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un fonctionnaire" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {fonctionnaires.map((fonctionnaire) => (
                                                    <SelectItem key={fonctionnaire.id} value={fonctionnaire.id.toString()}>
                                                        {fonctionnaire.nom} {fonctionnaire.prenom} ({fonctionnaire.fonction})
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.livre_par && <p className="text-sm text-red-500">{errors.livre_par}</p>}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {document ? 'Mettre à jour' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}