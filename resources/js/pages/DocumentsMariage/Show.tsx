import { Head } from '@inertiajs/react';
import { DocumentMariage } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from '@inertiajs/react';
import { PencilIcon, ArrowLeftIcon, PrinterIcon, FileTextIcon } from 'lucide-react';

interface DocumentMariageShowProps {
    document: DocumentMariage;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Documents de mariage', href: '/documents-mariage' },
    { title: 'Détails document', href: '' },
];

export default function DocumentMariageShow({ document }: DocumentMariageShowProps) {
    const getCoupleNames = () => {
        if (!document.mariage) return 'N/A';
        return `${document.mariage.homme?.nom} ${document.mariage.homme?.prenom} & ${document.mariage.femme?.nom} ${document.mariage.femme?.prenom}`;
    };

    const getTypeDocumentName = () => {
        const types = {
            'certificat_celibat': 'Certificat de célibat',
            'bulletin_mariage': 'Bulletin de mariage',
            'copie_acte_mariage': 'Copie d\'acte de mariage',
            'attestation_mariage': 'Attestation de mariage',
            'autre': 'Autre document'
        };
        return types[document.type_document as keyof typeof types] || document.type_document;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Détails document - ${document.numero_document}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href="/documents-mariage">
                            <Button variant="outline" size="sm">
                                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Détails du document</h1>
                    </div>
                    
                    <div className="flex gap-2">
                        <Link href={`/documents-mariage/${document.id}/print/certificat`}>
                            <Button variant="outline" size="sm">
                                <PrinterIcon className="h-4 w-4 mr-2" />
                                Imprimer
                            </Button>
                        </Link>
                        <Link href={`/documents-mariage/${document.id}/edit`}>
                            <Button size="sm">
                                <PencilIcon className="h-4 w-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne 1 - Informations principales */}
                    <div className="space-y-6">
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Informations du document</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Type de document</p>
                                    <p className="font-medium">{getTypeDocumentName()}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Numéro</p>
                                    <p className="font-medium">{document.numero_document}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Date d'émission</p>
                                    <p>{format(new Date(document.date_emission), 'PP', { locale: fr })}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Date d'expiration</p>
                                    <p>
                                        {document.date_expiration 
                                            ? format(new Date(document.date_expiration), 'PP', { locale: fr })
                                            : 'Non spécifiée'}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Statut</p>
                                    <Badge variant={document.livre ? 'default' : 'secondary'}>
                                        {document.livre ? 'Livré' : 'Non livré'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                        
                        {document.livre && (
                            <div className="rounded-lg border p-6">
                                <h2 className="font-semibold text-lg mb-4">Livraison</h2>
                                
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Date de livraison</p>
                                        <p>{format(new Date(document.date_livraison!), 'PP', { locale: fr })}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-sm text-muted-foreground">Livré par</p>
                                        <p>
                                            {document.livrePar?.nom} {document.livrePar?.prenom} 
                                            {document.livrePar?.fonction && ` (${document.livrePar.fonction})`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Colonne 2 - Documents et métadonnées */}
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
                                        {document.mariage 
                                            ? format(new Date(document.mariage.date_mariage), 'PP', { locale: fr })
                                            : 'N/A'}
                                    </p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Lieu du mariage</p>
                                    <p>{document.mariage?.lieu_mariage || 'N/A'}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Officier</p>
                                    <p>
                                        {document.mariage?.officier?.nom} {document.mariage?.officier?.prenom}
                                        {document.mariage?.officier?.fonction && ` (${document.mariage.officier.fonction})`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Document scanné</h2>
                            
                            <div className="flex flex-col items-center justify-center p-4 border rounded-lg bg-muted/50">
                                {document.fichier ? (
                                    <>
                                        <FileTextIcon className="h-12 w-12 text-primary mb-2" />
                                        <p className="text-sm mb-2">Document disponible</p>
                                        <a 
                                            href={`/storage/${document.fichier}`} 
                                            target="_blank" 
                                            className="text-sm text-primary underline"
                                        >
                                            Voir le document
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        <FileTextIcon className="h-12 w-12 text-muted-foreground mb-2" />
                                        <p className="text-sm text-muted-foreground">Aucun document scanné</p>
                                    </>
                                )}
                            </div>
                        </div>
                        
                        <div className="rounded-lg border p-6">
                            <h2 className="font-semibold text-lg mb-4">Métadonnées</h2>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Créé le</p>
                                    <p>{format(new Date(document.created_at), 'PPpp', { locale: fr })}</p>
                                </div>
                                
                                {document.createdBy && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Créé par</p>
                                        <p>{document.createdBy.name}</p>
                                    </div>
                                )}
                                
                                <div>
                                    <p className="text-sm text-muted-foreground">Dernière modification</p>
                                    <p>{format(new Date(document.updated_at), 'PPpp', { locale: fr })}</p>
                                </div>
                                
                                {document.updatedBy && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Modifié par</p>
                                        <p>{document.updatedBy.name}</p>
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