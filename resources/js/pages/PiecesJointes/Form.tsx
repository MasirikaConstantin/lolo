import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface PieceJointeFormProps {
    pieceJointe?: {
        id?: number;
        attachable_type?: string;
        attachable_id?: number;
        type_piece: string;
        numero_piece: string;
        fichier: string;
        date_emission: string;
        date_expiration: string | null;
    };
    attachableType?: string;
    attachableId?: number;
    typesPieces: Record<string, string>;
    breadcrumbs: BreadcrumbItem[];
    title: string;
}

export default function PieceJointeForm({ 
    pieceJointe, 
    attachableType, 
    attachableId, 
    typesPieces, 
    breadcrumbs, 
    title 
}: PieceJointeFormProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, put, processing, errors, reset } = useForm({
        attachable_type: pieceJointe?.attachable_type || attachableType || '',
        attachable_id: pieceJointe?.attachable_id || attachableId || '',
        type_piece: pieceJointe?.type_piece || Object.keys(typesPieces)[0],
        numero_piece: pieceJointe?.numero_piece || '',
        fichier: null as File | null,
        date_emission: pieceJointe?.date_emission || '',
        date_expiration: pieceJointe?.date_expiration || null,
    });

    const [fileName, setFileName] = useState<string>(pieceJointe?.fichier ? 'Fichier existant' : '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'fichier' && value instanceof File) {
                    formData.append(key, value, value.name);
                } else {
                    formData.append(key, value as string | Blob);
                }
            }
        });

        if (pieceJointe) {
            put(`/pieces-jointes/${pieceJointe.id}`, {
                data: formData,
                onSuccess: () => toast.success('Pièce jointe mise à jour avec succès.'),
                onError: () => toast.error('Une erreur est survenue lors de la mise à jour.'),
                preserveScroll: true,
            });
        } else {
            post('/pieces-jointes', {
                data: formData,
                onSuccess: () => {
                    toast.success('Pièce jointe enregistrée avec succès.');
                    reset();
                },
                onError: () => toast.error('Une erreur est survenue lors de l\'enregistrement.'),
            });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setData('fichier', file);
        setFileName(file?.name || '');
    };

    const handleRemoveFile = () => {
        setData('fichier', null);
        setFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">{title}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Colonne 1 */}
                        <div className="space-y-4">
                            {!pieceJointe && attachableType && attachableId && (
                                <div className="p-3 border rounded-lg bg-muted/50">
                                    <p className="text-sm font-medium">Cette pièce sera attachée à :</p>
                                    <p className="text-sm">
                                        Type: {attachableType.replace('App\\Models\\', '')}
                                    </p>
                                    <p className="text-sm">
                                        ID: {attachableId}
                                    </p>
                                </div>
                            )}
                            
                            <div>
                                <Label htmlFor="type_piece">Type de pièce *</Label>
                                <Select
                                    value={data.type_piece}
                                    onValueChange={(value) => setData('type_piece', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(typesPieces).map(([key, value]) => (
                                            <SelectItem key={key} value={key}>{value}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.type_piece && <p className="text-sm text-red-500 mt-1">{errors.type_piece}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="numero_piece">Numéro de pièce *</Label>
                                <Input
                                    id="numero_piece"
                                    value={data.numero_piece}
                                    onChange={(e) => setData('numero_piece', e.target.value)}
                                    placeholder="Ex: 123456789"
                                />
                                {errors.numero_piece && <p className="text-sm text-red-500 mt-1">{errors.numero_piece}</p>}
                            </div>
                        </div>
                        
                        {/* Colonne 2 */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="fichier">Fichier *</Label>
                                <div className="flex items-center gap-2">
                                    <Input
                                        id="fichier"
                                        type="file"
                                        ref={fileInputRef}
                                        accept="application/pdf,image/*"
                                        onChange={handleFileChange}
                                        className="flex-1"
                                    />
                                    {fileName && (
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={handleRemoveFile}
                                        >
                                            Supprimer
                                        </Button>
                                    )}
                                </div>
                                {fileName && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Fichier sélectionné: {fileName}
                                    </p>
                                )}
                                {pieceJointe?.fichier && !fileName && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                        Fichier existant: {pieceJointe.fichier}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground mt-1">
                                    Formats acceptés : PDF, JPG, PNG (max 2MB)
                                </p>
                                {errors.fichier && <p className="text-sm text-red-500 mt-1">{errors.fichier}</p>}
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="date_emission">Date d'émission *</Label>
                                    <Input
                                        id="date_emission"
                                        type="date"
                                        value={data.date_emission}
                                        onChange={(e) => setData('date_emission', e.target.value)}
                                    />
                                    {errors.date_emission && <p className="text-sm text-red-500 mt-1">{errors.date_emission}</p>}
                                </div>
                                
                                <div>
                                    <Label htmlFor="date_expiration">Date d'expiration</Label>
                                    <Input
                                        id="date_expiration"
                                        type="date"
                                        value={data.date_expiration || ''}
                                        onChange={(e) => setData('date_expiration', e.target.value || null)}
                                        min={data.date_emission}
                                    />
                                    {errors.date_expiration && <p className="text-sm text-red-500 mt-1">{errors.date_expiration}</p>}
                                </div>
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
                            {pieceJointe ? 'Mettre à jour' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}