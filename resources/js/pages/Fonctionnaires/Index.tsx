import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, PlusIcon, PencilIcon, Trash2Icon, EyeIcon } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
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
import { PaginationComponent } from '@/components/Pagination';

interface FonctionnairesIndexProps {
    fonctionnaires: {
        data: Array<{
            id: number;
            ref: string;
            nom_complet: string;
            matricule: string;
            fonction: string;
            grade: string;
            email: string;
            telephone: string;
            date_embauche: string;
            created_at: string;
            created_by: string;
        }>;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
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
    { title: 'Fonctionnaires', href: '/fonctionnaires' },
];

export default function FonctionnairesIndex({ fonctionnaires, filters }: FonctionnairesIndexProps) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        router.get('/fonctionnaires', { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (fonctionnaire: { id: number, ref: string }) => {
        router.delete(`/fonctionnaires/${fonctionnaire.ref}`, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success('Fonctionnaire supprimé avec succès.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression du fonctionnaire.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des fonctionnaires" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gestion des fonctionnaires</h1>
                    <Link href="/fonctionnaires/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Ajouter un fonctionnaire
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher..."
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
                                <TableHead>Matricule</TableHead>
                                <TableHead>Fonction</TableHead>
                                <TableHead>Grade</TableHead>
                                <TableHead>Date embauche</TableHead>
                                <TableHead>Créé par</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fonctionnaires.data.map((fonctionnaire) => (
                                <TableRow key={fonctionnaire.id}>
                                    <TableCell className="font-medium">{fonctionnaire.nom_complet}</TableCell>
                                    <TableCell>{fonctionnaire.matricule}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{fonctionnaire.fonction}</Badge>
                                    </TableCell>
                                    <TableCell>{fonctionnaire.grade}</TableCell>
                                    <TableCell>{format(new Date(fonctionnaire.date_embauche), 'PP', { locale: fr })}</TableCell>
                                    <TableCell>{fonctionnaire.created_by}</TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Link href={`/fonctionnaires/${fonctionnaire.ref}`}>
                                            <Button variant="outline" size="sm">
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/fonctionnaires/${fonctionnaire.ref}/edit`}>
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
                                                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce fonctionnaire?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action est irréversible. Toutes les données associées à ce fonctionnaire seront également supprimées.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(fonctionnaire)}>
                                                        Confirmer
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationComponent links={fonctionnaires.links} />
            </div>
        </AppLayout>
    );
}