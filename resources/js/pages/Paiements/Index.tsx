import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, PlusIcon, PencilIcon, Trash2Icon, EyeIcon } from 'lucide-react';
import { BreadcrumbItem } from '@/types';
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
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';

interface PaiementsIndexProps {
    paiements: {
        data: Array<{
            id: number;
            ref: string;
            mariage_ref: string;
            montant: string;
            mode_paiement: string;
            reference_paiement: string;
            date_paiement: string;
            statut: string;
            encaisser_par: string;
            created_at: string;
            created_by: string;
        }>;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
    };
    filters: {
        search?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Paiements', href: '/paiements' },
];

export default function PaiementsIndex({ paiements, filters }: PaiementsIndexProps) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        router.get('/paiements', { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (paiement: { id: number, ref: string }) => {
        router.delete(`/paiements/${paiement.ref}`, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success('Paiement supprimé avec succès.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression du paiement.');
            },
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'payé':
                return <Badge variant="default">Payé</Badge>;
            case 'impayé':
                return <Badge variant="destructive">Impayé</Badge>;
            case 'remboursé':
                return <Badge variant="outline">Remboursé</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };
    const getCoupleNames = (mariage: Mariage) => {
        return `${mariage.homme?.nom} ${mariage.homme?.postnom} ${mariage.homme?.prenom} & ${mariage.femme?.nom} ${mariage.femme?.postnom} ${mariage.femme?.prenom}`;
    };
    console.log(paiements);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des paiements" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gestion des paiements</h1>
                    <Link href="/paiements/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Nouveau paiement
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par référence..."
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
                                <TableHead>Mariage</TableHead>
                                <TableHead>Montant</TableHead>
                                <TableHead>Mode</TableHead>
                                <TableHead>Référence</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead>Encaissé par</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paiements.data.map((paiement) => (
                                <TableRow key={paiement.id}>
                                    <TableCell>{getCoupleNames(paiement.mariage)}</TableCell>
                                    <TableCell>{paiement.montant}</TableCell>
                                    <TableCell>{paiement.mode_paiement}</TableCell>
                                    <TableCell>{paiement.reference_paiement}</TableCell>
                                    <TableCell>{format(new Date(paiement.date_paiement), 'PP', { locale: fr })}</TableCell>
                                    <TableCell>{getStatusBadge(paiement.statut)}</TableCell>
                                    <TableCell>{paiement.encaisser_par}</TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Link href={`/paiements/${paiement.ref}`}>
                                            <Button variant="outline" size="sm">
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/paiements/${paiement.ref}/edit`}>
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
                                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action est irréversible. Le paiement sera définitivement supprimé.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(paiement)}>
                                                        Supprimer
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

                <PaginationComponent data={paiements} />
            </div>
        </AppLayout>
    );
}