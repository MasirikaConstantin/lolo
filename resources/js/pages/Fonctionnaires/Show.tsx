import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MailIcon, PhoneIcon, CalendarIcon, UserIcon, ShieldIcon, ClockIcon } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface FonctionnairesShowProps extends PageProps {
    fonctionnaire: {
        id: number;
        ref: string;
        nom: string;
        postnom: string;
        prenom: string;
        fonction: string;
        grade: string;
        matricule: string;
        email: string;
        telephone: string;
        date_embauche: string;
        photo: string | null;
        created_at: string;
        updated_at: string;
        created_by: string | null;
        updated_by: string | null;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Fonctionnaires', href: '/fonctionnaires' },
    { title: 'Détails du fonctionnaire', href: '' },
];

export default function FonctionnairesShow({ fonctionnaire }: FonctionnairesShowProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Détails de ${fonctionnaire.nom} ${fonctionnaire.postnom}`} />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Détails du fonctionnaire</h1>
                    <div className="flex gap-2">
                        <Link href="/fonctionnaires">
                            <Button variant="outline">
                                Retour
                            </Button>
                        </Link>
                        <Link href={`/fonctionnaires/${fonctionnaire.ref}/edit`}>
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
                                <UserIcon className="h-6 w-6" />
                                <span>Informations personnelles</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Nom complet</p>
                                <p className="font-medium">{fonctionnaire.nom} {fonctionnaire.postnom} {fonctionnaire.prenom}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Matricule</p>
                                <p className="font-mono font-medium">{fonctionnaire.matricule}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Fonction</p>
                                <Badge variant="secondary">{fonctionnaire.fonction}</Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Grade</p>
                                <p className="font-medium">{fonctionnaire.grade}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Email</p>
                                <div className="flex items-center gap-2">
                                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{fonctionnaire.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Téléphone</p>
                                <div className="flex items-center gap-2">
                                    <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{fonctionnaire.telephone}</p>
                                </div>
                            </div>
                            {fonctionnaire.photo && (
                                <div className="space-y-1 sm:col-span-2">
                                    <p className="text-sm text-muted-foreground">Photo</p>
                                    <img 
                                        src={`/storage/${fonctionnaire.photo}`} 
                                        alt={`Photo de ${fonctionnaire.nom}`} 
                                        className="h-32 w-32 rounded-md object-cover"
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Carte des dates importantes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                                <CalendarIcon className="h-6 w-6" />
                                <span>Dates importantes</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Date d'embauche</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                    {format(new Date(fonctionnaire.date_embauche), 'PPP', { locale: fr })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Créé le</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                    {format(new Date(fonctionnaire.created_at), 'PPPp', { locale: fr })}
                                </p>
                                {fonctionnaire.created_by && (
                                    <p className="text-sm">Par {fonctionnaire.created_by}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                    {format(new Date(fonctionnaire.updated_at), 'PPPp', { locale: fr })}
                                </p>
                                {fonctionnaire.updated_by && (
                                    <p className="text-sm">Par {fonctionnaire.updated_by}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}