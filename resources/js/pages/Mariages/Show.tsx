import { Head } from '@inertiajs/react';
import { Mariage } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon } from 'lucide-react';

interface MariageShowProps {
    mariage: Mariage;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Mariages', href: '/mariages' },
    { title: 'Détails mariage', href: '' },
];

export default function MariageShow({ mariage }: MariageShowProps) {
    const getCoupleNames = () => {
        return `${mariage.homme?.nom} ${mariage.homme?.postnom} ${mariage.homme?.prenom} & ${mariage.femme?.nom} ${mariage.femme?.postnom} ${mariage.femme?.prenom}`;
    };

    const getBadgeVariant = (statut: string) => {
        switch (statut) {
            case 'approuvé':
                return 'default';
            case 'célébré':
                return 'success';
            case 'rejeté':
                return 'destructive';
            default:
                return 'secondary';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Détails du mariage - ${getCoupleNames()}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/mariages">
                            <Button variant="outline" size="sm">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Détails du mariage</h1>
                    </div>
                    
                    <Link href={`/mariages/${mariage.ref}/edit`}>
                        <Button size="sm">
                            <PencilIcon className="h-4 w-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne 1 - Informations sur le couple */}
                    <div className="space-y-6">
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Couple</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-2">Époux</h3>
                                    <div className="space-y-2">
                                        <p className="font-medium">{mariage.homme?.nom} {mariage.homme?.postnom} {mariage.homme?.prenom}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Né le {format(new Date(mariage.homme?.date_naissance), 'PP', { locale: fr })} à {mariage.homme?.lieu_naissance}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Fils de {mariage.homme?.nom_pere} et {mariage.homme?.nom_mere}
                                        </p>
                                    </div>
                                </div>
                                
                                <div>
                                    <h3 className="font-medium mb-2">Épouse</h3>
                                    <div className="space-y-2">
                                        <p className="font-medium">{mariage.femme?.nom} {mariage.femme?.postnom} {mariage.femme?.prenom}</p>
                                        <p className="text-sm text-muted-foreground">
                                            Née le {format(new Date(mariage.femme?.date_naissance), 'PP', { locale: fr })} à {mariage.femme?.lieu_naissance}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Fille de {mariage.femme?.nom_pere} et {mariage.femme?.nom_mere}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Témoins</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-2">Témoins de l'époux</h3>
                                    {mariage.temoins_homme && mariage.temoins_homme.length > 0 ? (
                                        <ul className="space-y-2">
                                            {mariage.temoins_homme.map((temoin, index) => (
                                                <li key={index} className="p-2 border rounded">
                                                    {temoin}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Aucun témoin enregistré</p>
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="font-medium mb-2">Témoins de l'épouse</h3>
                                    {mariage.temoins_femme && mariage.temoins_femme.length > 0 ? (
                                        <ul className="space-y-2">
                                            {mariage.temoins_femme.map((temoin, index) => (
                                                <li key={index} className="p-2 border rounded">
                                                    {temoin}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Aucun témoin enregistré</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Colonne 2 - Détails du mariage */}
                    <div className="space-y-6">
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Détails du mariage</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Date et heure</p>
                                    <p className="font-medium">
                                        {format(new Date(mariage.date_mariage), 'PP', { locale: fr })} à {mariage.heure_mariage}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Lieu</p>
                                    <p className="font-medium">{mariage.lieu_mariage}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Régime matrimonial</p>
                                    <Badge variant="outline">
                                        {mariage.regime_matrimonial.replace(/_/g, ' ')}
                                    </Badge>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Officier d'état civil</p>
                                    <p className="font-medium">
                                        {mariage.officier?.nom} {mariage.officier?.prenom} ({mariage.officier?.fonction})
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Statut</p>
                                    <Badge variant={getBadgeVariant(mariage.statut)}>
                                        {mariage.statut}
                                    </Badge>
                                </div>
                                
                                {mariage.notes && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Notes</p>
                                        <p className="font-medium">{mariage.notes}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Métadonnées</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Enregistré le</p>
                                    <p className="font-medium">
                                        {format(new Date(mariage.created_at), 'PPpp', { locale: fr })}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Dernière modification</p>
                                    <p className="font-medium">
                                        {format(new Date(mariage.updated_at), 'PPpp', { locale: fr })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Pièces jointes</h2>
                
                
            </div>
            </div>
        </AppLayout>
    );
}