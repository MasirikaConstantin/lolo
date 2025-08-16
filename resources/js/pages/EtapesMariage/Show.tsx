import { Head } from '@inertiajs/react';
import { EtapeMariage } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';

interface EtapeMariageShowProps {
    etape: EtapeMariage;
    etapesOptions: Record<string, string>;
    statutsOptions: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Étapes de mariage', href: '/etapes-mariage' },
    { title: 'Détails étape', href: '' },
];

export default function EtapeMariageShow({ etape, etapesOptions, statutsOptions }: EtapeMariageShowProps) {
    const getCoupleNames = () => {
        if (!etape.mariage) return 'N/A';
        return `${etape.mariage.homme?.nom} ${etape.mariage.homme?.prenom} & ${etape.mariage.femme?.nom} ${etape.mariage.femme?.prenom}`;
    };

    const getBadgeVariant = (statut: string) => {
        switch (statut) {
            case 'complet':
                return 'success';
            case 'en_cours':
                return 'default';
            case 'rejete':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Détails étape - ${etapesOptions[etape.etape]}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/etapes-mariage">
                            <Button variant="outline" size="sm">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Détails de l'étape</h1>
                    </div>
                    
                    <Link href={`/etapes-mariage/${etape.id}/edit`}>
                        <Button size="sm">
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne 1 - Informations principales */}
                    <div className="space-y-6">
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Informations de l'étape</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Étape</p>
                                    <p className="font-medium">{etapesOptions[etape.etape]}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Statut</p>
                                    <Badge variant={getBadgeVariant(etape.statut)}>
                                        {statutsOptions[etape.statut]}
                                    </Badge>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Dates</p>
                                    <p>
                                        {etape.date_debut 
                                            ? format(new Date(etape.date_debut), 'PP', { locale: fr }) 
                                            : 'Non définie'}
                                        {etape.date_fin && ` → ${format(new Date(etape.date_fin), 'PP', { locale: fr })}`}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Responsable</p>
                                    <p>
                                        {etape.responsable 
                                            ? `${etape.responsable.nom} ${etape.responsable.prenom}` 
                                            : 'Non assigné'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        {etape.commentaires && (
                            <div className="rounded-lg border p-6">
                                <h2 className="font-semibold text-lg mb-4">Commentaires</h2>
                                <p className="whitespace-pre-line">{etape.commentaires}</p>
                            </div>
                        )}
                    </div>
                    
                    {/* Colonne 2 - Mariage et métadonnées */}
                    <div className="space-y-6">
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Mariage concerné</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Couple</p>
                                    <p className="font-medium">{getCoupleNames()}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Date du mariage</p>
                                    <p>
                                        {etape.mariage 
                                            ? format(new Date(etape.mariage.date_mariage), 'PP', { locale: fr })
                                            : 'N/A'}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Lieu</p>
                                    <p>{etape.mariage?.lieu_mariage || 'N/A'}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Officier</p>
                                    <p>
                                        {etape.mariage?.officier?.nom} {etape.mariage?.officier?.prenom}
                                        {etape.mariage?.officier?.fonction && ` (${etape.mariage.officier.fonction})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Métadonnées</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Créé le</p>
                                    <p>{format(new Date(etape.created_at), 'PP', { locale: fr })}</p>
                                </div>
                                
                                {etape.createdBy && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Créé par</p>
                                        <p>{etape.createdBy.name}</p>
                                    </div>
                                )}
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Dernière modification</p>
                                    <p>{format(new Date(etape.updated_at), 'PPpp', { locale: fr })}</p>
                                </div>
                                
                                {etape.updatedBy && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Modifié par</p>
                                        <p>{etape.updatedBy.name}</p>
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