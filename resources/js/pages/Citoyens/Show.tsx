import { Head } from '@inertiajs/react';
import { Citoyen } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';

interface CitoyenShowProps {
    citoyen: Citoyen;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Citoyens', href: '/citoyens' },
    { title: 'Détails citoyen', href: '' },
];

export default function CitoyenShow({ citoyen }: CitoyenShowProps) {
    const getFullName = () => {
        return `${citoyen.nom} ${citoyen.postnom} ${citoyen.prenom}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Détails de ${getFullName()}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/citoyens">
                            <Button variant="outline" size="sm">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Détails du citoyen</h1>
                    </div>
                    
                    <Link href={`/citoyens/${citoyen.ref}/edit`}>
                        <Button size="sm">
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Colonne 1 - Informations personnelles */}
                    <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                            <h2 className="font-semibold text-lg mb-4">Informations personnelles</h2>
                            
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nom complet</p>
                                    <p className="font-medium">{getFullName()}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Sexe</p>
                                    <Badge variant={citoyen.sexe === 'M' ? 'default' : 'secondary'}>
                                        {citoyen.sexe === 'M' ? 'Masculin' : 'Féminin'}
                                    </Badge>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Date de naissance</p>
                                    <p>{format(new Date(citoyen.date_naissance), 'PP', { locale: fr })}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Lieu de naissance</p>
                                    <p>{citoyen.lieu_naissance}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">État civil</p>
                                    <Badge variant="outline">{citoyen.etat_civil}</Badge>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Profession</p>
                                    <p>{citoyen.profession}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Colonne 2 - Adresse et identification */}
                    <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                            <h2 className="font-semibold text-lg mb-4">Adresse et identification</h2>
                            
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Adresse</p>
                                    <p>{citoyen.adresse}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Numéro d'identification national (NIN)</p>
                                    <p>{citoyen.numero_identification_national || 'Non spécifié'}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Référence</p>
                                    <p>{citoyen.ref}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg border p-4">
                            <h2 className="font-semibold text-lg mb-4">Parents</h2>
                            
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Nom du père</p>
                                    <p>{citoyen.nom_pere}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Nom de la mère</p>
                                    <p>{citoyen.nom_mere}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Colonne 3 - Photo et métadonnées */}
                    <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                            <h2 className="font-semibold text-lg mb-4">Photo</h2>
                            
                            <div className="flex justify-center">
                                {citoyen.photo ? (
                                    <img 
                                        src={`/storage/${citoyen.photo}`} 
                                        alt={`Photo de ${getFullName()}`}
                                        className="h-48 w-48 object-cover rounded-md border"
                                    />
                                ) : (
                                    <div className="h-48 w-48 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                                        Aucune photo
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="rounded-lg border p-4">
                            <h2 className="font-semibold text-lg mb-4">Métadonnées</h2>
                            
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Créé le</p>
                                    <p>{format(new Date(citoyen.created_at), 'PPpp', { locale: fr })}</p>
                                </div>
                                
                                {citoyen.created_by_user && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Créé par</p>
                                        <p>{citoyen.created_by_user.name}</p>
                                    </div>
                                )}
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Dernière modification</p>
                                    <p>{format(new Date(citoyen.updated_at), 'PPpp', { locale: fr })}</p>
                                </div>
                                
                                {citoyen.updated_by_user && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Modifié par</p>
                                        <p>{citoyen.updated_by_user.name}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}