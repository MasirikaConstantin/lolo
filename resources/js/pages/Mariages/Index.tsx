import { Head, Link, router } from '@inertiajs/react';
import { Mariage } from '@/types';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MariagesIndexProps {
    mariages: {
        data: Mariage[];
        links: any[];
        from: number;
        to: number;
        ref: number;
        total: number;
    };
    filters: {
        search?: string;
        statut?: string;
    };
    statuts: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Mariages', href: '/mariages' },
];

export default function MariagesIndex({ mariages, filters, statuts }: MariagesIndexProps) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        router.get('/mariages', { search: value, statut: filters.statut }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatutFilter = (value: string) => {
        router.get('/mariages', { search: filters.search, statut: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (mariage: Mariage) => {
        router.delete(`/mariages/${mariage.ref}`, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success('Mariage supprimé avec succès.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression du mariage.');
            },
        });
    };

    const getCoupleNames = (mariage: Mariage) => {
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
            <Head title="Gestion des mariages" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gestion des mariages</h1>
                    <Link href="/mariages/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Enregistrer un mariage
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par nom des époux..."
                            className="pl-9"
                            defaultValue={filters.search}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="w-48">
                        <Select
                            value={filters.statut || ''}
                            onValueChange={handleStatutFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filtrer par statut" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={null}>Tous les statuts</SelectItem>
                                {Object.entries(statuts).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Couple</TableHead>
                                <TableHead>Date et heure</TableHead>
                                <TableHead>Lieu</TableHead>
                                <TableHead>Régime</TableHead>
                                <TableHead>Officier</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {mariages.data.map((mariage) => (
                                <TableRow key={mariage.id}>
                                    <TableCell className="font-medium">{getCoupleNames(mariage)}</TableCell>
                                    <TableCell>
                                        {format(new Date(mariage.date_mariage), 'PP', { locale: fr })} à {mariage.heure_mariage}
                                    </TableCell>
                                    <TableCell>{mariage.lieu_mariage}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {mariage.regime_matrimonial.replace(/_/g, ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {mariage.officier?.nom} {mariage.officier?.prenom}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getBadgeVariant(mariage.statut)}>
                                            {statuts[mariage.statut]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Link href={`/mariages/${mariage.ref}`}>
                                            <Button variant="outline" size="sm">
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/mariages/${mariage.ref}/edit`}>
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
                                                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce mariage?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action ne peut pas être annulée. Cela supprimera définitivement
                                                        l'enregistrement du mariage de nos serveurs.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(mariage)}>Supprimer</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationComponent data={mariages} />
            </div>
        </AppLayout>
    );
}