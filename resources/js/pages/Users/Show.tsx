import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MailIcon, UserIcon, ShieldIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { User } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Utilisateurs', href: '/users' },
    { title: 'Détails', href: '' },
];

export default function UserShow({ user }: { user: User }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Détails de ${user.name}`} />
            
            <div className="flex flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Détails de l'utilisateur</h1>
                    <div className="flex gap-2">
                        <Link href="/users">
                            <Button variant="outline">
                                Retour
                            </Button>
                        </Link>
                        <Link href={route('users.edit', user.ref)}>
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
                                <p className="font-medium">{user.name}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Email</p>
                                <div className="flex items-center gap-2">
                                    <MailIcon className="h-4 w-4 text-muted-foreground" />
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Rôle</p>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                    <ShieldIcon className="mr-1 h-3 w-3" />
                                    {user.role}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Statut</p>
                                <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                    {user.is_active ? (
                                        <CheckCircleIcon className="mr-1 h-3 w-3" />
                                    ) : (
                                        <XCircleIcon className="mr-1 h-3 w-3" />
                                    )}
                                    {user.is_active ? 'Actif' : 'Inactif'}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Email vérifié</p>
                                <Badge variant={user.email_verified_at ? 'default' : 'destructive'}>
                                    {user.email_verified_at ? (
                                        <CheckCircleIcon className="mr-1 h-3 w-3" />
                                    ) : (
                                        <XCircleIcon className="mr-1 h-3 w-3" />
                                    )}
                                    {user.email_verified_at ? 'Oui' : 'Non'}
                                </Badge>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Référence</p>
                                <p className="font-mono text-sm">{user.ref}</p>
                            </div>
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
                                <p className="text-sm text-muted-foreground">Créé le</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                    {new Date(user.created_at).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                                <p className="flex items-center gap-2 font-medium">
                                    <ClockIcon className="h-4 w-4 text-muted-foreground" />
                                    {new Date(user.updated_at).toLocaleDateString('fr-FR', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Section supplémentaire pour les activités ou autres informations */}
                <Card>
                    <CardHeader>
                        <CardTitle>Activités</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Aucune activité récente</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}