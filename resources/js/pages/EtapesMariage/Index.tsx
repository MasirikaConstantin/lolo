import { Head, Link, router } from '@inertiajs/react';
import { EtapeMariage } from '@/types';
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

interface EtapesMariageIndexProps {
    etapes: {
        data: EtapeMariage[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        etape?: string;
        statut?: string;
    };
    etapesOptions: Record<string, string>;
    statutsOptions: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Étapes de mariage', href: '/etapes-mariage' },
];

export default function EtapesMariageIndex({ etapes, filters, etapesOptions, statutsOptions }: EtapesMariageIndexProps) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        router.get('/etapes-mariage', { 
            search: value,
            etape: filters.etape,
            statut: filters.statut
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleEtapeFilter = (value: string) => {
        router.get('/etapes-mariage', { 
            search: filters.search,
            etape: value,
            statut: filters.statut
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleStatutFilter = (value: string) => {
        router.get('/etapes-mariage', { 
            search: filters.search,
            etape: filters.etape,
            statut: value
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (etape: EtapeMariage) => {
        router.delete(`/etapes-mariage/${etape.id}`, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success('Étape supprimée avec succès.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression de l\'étape.');
            },
        });
    };

    const getCoupleNames = (etape: EtapeMariage) => {
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
            <Head title="Gestion des étapes de mariage" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gestion des étapes de mariage</h1>
                    <Link href="/etapes-mariage/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Ajouter une étape
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par noms des époux..."
                            className="pl-9"
                            defaultValue={filters.search}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="w-48">
                        <Select
                            value={filters.etape || ''}
                            onValueChange={handleEtapeFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Toutes les étapes" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={undefined}>Toutes les étapes</SelectItem>
                                {Object.entries(etapesOptions).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-48">
                        <Select
                            value={filters.statut || ''}
                            onValueChange={handleStatutFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={undefined}>Tous les statuts</SelectItem>
                                {Object.entries(statutsOptions).map(([key, value]) => (
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
                                <TableHead>Étape</TableHead>
                                <TableHead>Couple</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Responsable</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {etapes.data.map((etape) => (
                                <TableRow key={etape.id}>
                                    <TableCell className="font-medium">
                                        {etapesOptions[etape.etape] || etape.etape}
                                    </TableCell>
                                    <TableCell>{getCoupleNames(etape)}</TableCell>
                                    <TableCell>
                                        <Badge variant={getBadgeVariant(etape.statut)}>
                                            {statutsOptions[etape.statut]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {etape.date_debut ? format(new Date(etape.date_debut), 'dd/MM/yyyy', { locale: fr }) : '-'}
                                        {etape.date_fin && ` → ${format(new Date(etape.date_fin), 'dd/MM/yyyy', { locale: fr })}`}
                                    </TableCell>
                                    <TableCell>
                                        {etape.responsable 
                                            ? `${etape.responsable.nom} ${etape.responsable.prenom}` 
                                            : 'Non assigné'}
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Link href={`/etapes-mariage/${etape.ref}`}>
                                            <Button variant="outline" size="sm">
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/etapes-mariage/${etape.id}/edit`}>
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
                                                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette étape?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action ne peut pas être annulée. Cela supprimera définitivement
                                                        l'enregistrement de cette étape.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(etape)}>Supprimer</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationComponent data={etapes} />
            </div>
        </AppLayout>
    );
}