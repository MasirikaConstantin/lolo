import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon, FileIcon } from 'lucide-react';
import { PieceJointe } from '@/types';

interface PieceJointeShowProps {
    pieceJointe: PieceJointe;
    typesPieces: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Pièces jointes', href: '/pieces-jointes' },
    { title: 'Détails pièce jointe', href: '' },
];

export default function PieceJointeShow({ pieceJointe, typesPieces }: PieceJointeShowProps) {
    const getAttachableName = () => {
        if (!pieceJointe.attachable) return 'N/A';
        
        if (pieceJointe.attachable_type === 'App\\Models\\Citoyen') {
            const citoyen = pieceJointe.attachable as any;
            return `${citoyen.nom} ${citoyen.prenom}`;
        } else if (pieceJointe.attachable_type === 'App\\Models\\Mariage') {
            const mariage = pieceJointe.attachable as any;
            return `${mariage.homme?.nom} & ${mariage.femme?.nom}`;
        }
        
        return 'N/A';
    };

    const getAttachableLink = () => {
        if (!pieceJointe.attachable) return '#';
        
        if (pieceJointe.attachable_type === 'App\\Models\\Citoyen') {
            return `/citoyens/${pieceJointe.attachable.ref}`;
        } else if (pieceJointe.attachable_type === 'App\\Models\\Mariage') {
            return `/mariages/${pieceJointe.attachable.id}`;
        }
        
        return '#';
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Détails pièce jointe - ${pieceJointe.numero_piece}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/pieces-jointes">
                            <Button variant="outline" size="sm">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Détails de la pièce jointe</h1>
                    </div>
                    
                    <Link href={`/pieces-jointes/${pieceJointe.id}/edit`}>
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
                            <h2 className="font-semibold text-lg mb-4">Informations de la pièce</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Type de pièce</p>
                                    <p className="font-medium">{typesPieces[pieceJointe.type_piece] || pieceJointe.type_piece}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Numéro</p>
                                    <p className="font-medium">{pieceJointe.numero_piece}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Dates</p>
                                    <p>
                                        {format(new Date(pieceJointe.date_emission), 'PP', { locale: fr })}
                                        {pieceJointe.date_expiration && ` → ${format(new Date(pieceJointe.date_expiration), 'PP', { locale: fr })}`}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Fichier</p>
                                    <a 
                                        href={`/storage/${pieceJointe.fichier}`} 
                                        target="_blank" 
                                        className="flex items-center text-primary hover:underline"
                                    >
                                        <FileIcon className="h-4 w-4 mr-1" />
                                        Voir le fichier
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Colonne 2 - Entité liée et métadonnées */}
                    <div className="space-y-6">
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Attachée à</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Type</p>
                                    <p className="font-medium">
                                        {pieceJointe.attachable_type?.replace('App\\Models\\', '')}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Nom</p>
                                    <Link 
                                        href={getAttachableLink()} 
                                        className="font-medium text-primary hover:underline"
                                    >
                                        {getAttachableName()}
                                    </Link>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">ID</p>
                                    <p>{pieceJointe.attachable_id}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Métadonnées</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Créé le</p>
                                    <p>{format(new Date(pieceJointe.created_at), 'PPpp', { locale: fr })}</p>
                                </div>
                                
                                {pieceJointe.createdBy && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Créé par</p>
                                        <p>{pieceJointe.createdBy.name}</p>
                                    </div>
                                )}
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Dernière modification</p>
                                    <p>{format(new Date(pieceJointe.updated_at), 'PPpp', { locale: fr })}</p>
                                </div>
                                
                                {pieceJointe.updatedBy && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Modifié par</p>
                                        <p>{pieceJointe.updatedBy.name}</p>
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