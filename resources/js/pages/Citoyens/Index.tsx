import { Head, Link, router } from '@inertiajs/react';
import { Citoyen } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, PlusIcon, PencilIcon, Trash2Icon, EyeIcon } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
import { PaginationComponent } from '@/components/Pagination';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface CitoyensIndexProps {
    citoyens: {
        data: Citoyen[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Citoyens', href: '/citoyens' },
];

export default function CitoyensIndex({ citoyens, filters }: CitoyensIndexProps) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        router.get('/citoyens', { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (citoyen: Citoyen) => {
        router.delete(`/citoyens/${citoyen.ref}`, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success('Citoyen supprimé avec succès.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression du citoyen.');
            },
        });
    };

    const getFullName = (citoyen: Citoyen) => {
        return `${citoyen.nom} ${citoyen.postnom} ${citoyen.prenom}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des citoyens" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gestion des citoyens</h1>
                    <Link href="/citoyens/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Ajouter un citoyen
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par nom, postnom, prénom ou NIN..."
                            className="pl-9"
                            defaultValue={filters.search}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nom complet</TableHead>
                                <TableHead>Sexe</TableHead>
                                <TableHead>Date de naissance</TableHead>
                                <TableHead>État civil</TableHead>
                                <TableHead>NIN</TableHead>
                                <TableHead>Créé le</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {citoyens.data.map((citoyen) => (
                                <TableRow key={citoyen.id}>
                                    <TableCell className="font-medium">{getFullName(citoyen)}</TableCell>
                                    <TableCell>
                                        <Badge variant={citoyen.sexe === 'M' ? 'default' : 'secondary'}>
                                            {citoyen.sexe === 'M' ? 'Masculin' : 'Féminin'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(citoyen.date_naissance), 'PP', { locale: fr })}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {citoyen.etat_civil}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{citoyen.numero_identification_national || 'N/A'}</TableCell>
                                    <TableCell>{format(new Date(citoyen.created_at), 'PP', { locale: fr })}</TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Link href={`/citoyens/${citoyen.ref}`}>
                                            <Button variant="outline" size="sm">
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/citoyens/${citoyen.ref}/edit`}>
                                            <Button variant="outline" size="sm">
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2Icon className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce citoyen?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action ne peut pas être annulée. Cela supprimera définitivement
                                                        les données du citoyen de nos serveurs.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(citoyen)}>Supprimer</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationComponent data={citoyens} />
            </div>
        </AppLayout>
    );
}