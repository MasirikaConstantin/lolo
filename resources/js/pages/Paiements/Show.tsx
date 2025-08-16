import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MailIcon, UserIcon, CreditCardIcon, FileTextIcon } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PaiementsShowProps extends PageProps {
    paiement: {
        ref: string;
        mariage_ref: string;
        montant: string;
        mode_paiement: string;
        reference_paiement: string;
        date_paiement: string;
        statut: string;
        encaisser_par: string;
        encaisser_par_id: number;
        notes: string;
        created_at: string;
        updated_at: string;
        created_by: string;
        updated_by: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Paiements', href: '/paiements' },
    { title: 'Détails du paiement', href: '' },
];

export default function PaiementsShow({ paiement }: PaiementsShowProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'payé':
                return <Badge variant="success">Payé</Badge>;
            case 'impayé':
                return <Badge variant="destructive">Impayé</Badge>;
            case 'remboursé':
                return <Badge variant="warning">Remboursé</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Détails du paiement ${paiement.ref}`} />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Détails du paiement</h1>
                    <div className="flex gap-2">
                        <Link href="/paiements">
                            <Button variant="outline">
                                Retour
                            </Button>
                        </Link>
                        <Link href={`/paiements/${paiement.ref}/edit`}>
                            <Button>
                                Modifier
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Carte d'information principale */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <CreditCardIcon className="h-6 w-6" />
                                <span>Informations du paiement</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Référence</p>
                                <p className="font-mono font-medium">{paiement.ref}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Mariage</p>
                                <p className="font-medium">{paiement.mariage_ref}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Montant</p>
                                <p className="font-medium">{paiement.montant} CDF</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Mode de paiement</p>
                                <p className="font-medium">{paiement.mode_paiement}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Référence paiement</p>
                                <p className="font-mono font-medium">{paiement.reference_paiement}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Statut</p>
                                {getStatusBadge(paiement.statut)}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Encaissé par</p>
                                <div className="flex items-center gap-2">
                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{paiement.encaisser_par}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Date paiement</p>
                                <div className="flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">
                                        {format(new Date(paiement.date_paiement), 'PPP', { locale: fr })}
                                    </p>
                                </div>
                            </div>
                            {paiement.notes && (
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-sm text-muted-foreground">Notes</p>
                                    <div className="flex items-start gap-2">
                                        <FileTextIcon className="h-4 w-4 text-muted-foreground mt-1" />
                                        <p className="font-medium whitespace-pre-line">{paiement.notes}</p>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Carte des métadonnées */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <CalendarIcon className="h-6 w-6" />
                                <span>Métadonnées</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Créé le</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    {format(new Date(paiement.created_at), 'PPPp', { locale: fr })}
                                </p>
                                <p className="text-sm">Par {paiement.created_by}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                    {format(new Date(paiement.updated_at), 'PPPp', { locale: fr })}
                                </p>
                                {paiement.updated_by && (
                                    <p className="text-sm">Par {paiement.updated_by}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}