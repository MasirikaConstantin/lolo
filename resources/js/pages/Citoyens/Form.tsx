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
import { Upload } from '@/components/ui/upload';

interface CitoyenFormProps {
    citoyen?: {
        id?: number;
        nom: string;
        postnom: string;
        prenom: string;
        sexe: 'M' | 'F';
        date_naissance: string;
        lieu_naissance: string;
        etat_civil: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf/Veuve';
        profession: string;
        adresse: string;
        nom_pere: string;
        nom_mere: string;
        numero_identification_national: string | null;
        photo: string | null;
        ref: string;
    };
    breadcrumbs: BreadcrumbItem[];
    title: string;
}

export default function CitoyenForm({ citoyen, breadcrumbs, title }: CitoyenFormProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nom: citoyen?.nom || '',
        postnom: citoyen?.postnom || '',
        prenom: citoyen?.prenom || '',
        sexe: citoyen?.sexe || 'M',
        date_naissance: citoyen?.date_naissance || '',
        lieu_naissance: citoyen?.lieu_naissance || '',
        etat_civil: citoyen?.etat_civil || 'Célibataire',
        profession: citoyen?.profession || '',
        adresse: citoyen?.adresse || '',
        nom_pere: citoyen?.nom_pere || '',
        nom_mere: citoyen?.nom_mere || '',
        numero_identification_national: citoyen?.numero_identification_national || '',
        photo: null as File | null,
    });

    const [previewImage, setPreviewImage] = useState<string | null>(citoyen?.photo || null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        if (citoyen) {
            put(`/citoyens/${citoyen.ref}`, {
                onSuccess: () => toast.success('Citoyen mis à jour avec succès.'),
                onError: () => toast.error('Une erreur est survenue lors de la mise à jour.'),
                preserveScroll: true,
            });
        } else {
            post('/citoyens', {
                onSuccess: () => {
                    toast.success('Citoyen créé avec succès.');
                    reset();
                },
                onError: () => toast.error('Une erreur est survenue lors de la création.'),
            });
        }
    };

    const handleFileChange = (file: File | null) => {
        setData('photo', file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-6">{title}</h1>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Colonne 1 */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="nom">Nom</Label>
                                <Input
                                    id="nom"
                                    value={data.nom}
                                    onChange={(e) => setData('nom', e.target.value)}
                                    error={errors.nom}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="postnom">Postnom</Label>
                                <Input
                                    id="postnom"
                                    value={data.postnom}
                                    onChange={(e) => setData('postnom', e.target.value)}
                                    error={errors.postnom}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="prenom">Prénom</Label>
                                <Input
                                    id="prenom"
                                    value={data.prenom}
                                    onChange={(e) => setData('prenom', e.target.value)}
                                    error={errors.prenom}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="sexe">Sexe</Label>
                                <Select
                                    value={data.sexe}
                                    onValueChange={(value: 'M' | 'F') => setData('sexe', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner le sexe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Masculin</SelectItem>
                                        <SelectItem value="F">Féminin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.sexe && <p className="text-sm text-red-500">{errors.sexe}</p>}
                            </div>
                            
                            <div>
                                <MonDatePicker
                                    label="Date de naissance"
                                    value={data.date_naissance}
                                    onChange={(date) => setData('date_naissance', date || '')}
                                />
                                {errors.date_naissance && <p className="text-sm text-red-500">{errors.date_naissance}</p>}
                            </div>
                        </div>
                        
                        {/* Colonne 2 */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="lieu_naissance">Lieu de naissance</Label>
                                <Input
                                    id="lieu_naissance"
                                    value={data.lieu_naissance}
                                    onChange={(e) => setData('lieu_naissance', e.target.value)}
                                    error={errors.lieu_naissance}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="etat_civil">État civil</Label>
                                <Select
                                    value={data.etat_civil}
                                    onValueChange={(value) => setData('etat_civil', value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner l'état civil" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Célibataire">Célibataire</SelectItem>
                                        <SelectItem value="Marié(e)">Marié(e)</SelectItem>
                                        <SelectItem value="Divorcé(e)">Divorcé(e)</SelectItem>
                                        <SelectItem value="Veuf/Veuve">Veuf/Veuve</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.etat_civil && <p className="text-sm text-red-500">{errors.etat_civil}</p>}
                            </div>
                            
                            <div>
                                <Label htmlFor="profession">Profession</Label>
                                <Input
                                    id="profession"
                                    value={data.profession}
                                    onChange={(e) => setData('profession', e.target.value)}
                                    error={errors.profession}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="adresse">Adresse</Label>
                                <Input
                                    id="adresse"
                                    value={data.adresse}
                                    onChange={(e) => setData('adresse', e.target.value)}
                                    error={errors.adresse}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="numero_identification_national">Numéro d'identification national (NIN)</Label>
                                <Input
                                    id="numero_identification_national"
                                    value={data.numero_identification_national || ''}
                                    onChange={(e) => setData('numero_identification_national', e.target.value)}
                                    error={errors.numero_identification_national}
                                />
                            </div>
                        </div>
                        
                        {/* Colonne 3 */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="nom_pere">Nom du père</Label>
                                <Input
                                    id="nom_pere"
                                    value={data.nom_pere}
                                    onChange={(e) => setData('nom_pere', e.target.value)}
                                    error={errors.nom_pere}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="nom_mere">Nom de la mère</Label>
                                <Input
                                    id="nom_mere"
                                    value={data.nom_mere}
                                    onChange={(e) => setData('nom_mere', e.target.value)}
                                    error={errors.nom_mere}
                                />
                            </div>
                            
                            <div>
                                <Label htmlFor="photo">Photo</Label>
                                <Input
                                    id="photo"
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('photo', e.target.files?.[0] || null)}
                                />
                                {errors.photo && <p className="text-sm text-red-500">{errors.photo}</p>}
                            </div>
                            
                            {previewImage && (
                                <div className="mt-4">
                                    <img 
                                        src={previewImage} 
                                        alt="Preview" 
                                        className="h-32 w-32 object-cover rounded-md border"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => window.history.back()}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {citoyen ? 'Mettre à jour' : 'Créer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}