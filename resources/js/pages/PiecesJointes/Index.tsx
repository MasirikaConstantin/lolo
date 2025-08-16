import { Head, Link, router } from '@inertiajs/react';
import { PieceJointe } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, PlusIcon, PencilIcon, Trash2Icon, EyeIcon, FileIcon } from 'lucide-react';
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

interface PiecesJointesIndexProps {
    piecesJointes: {
        data: PieceJointe[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        type_piece?: string;
    };
    typesPieces: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Pièces jointes', href: '/pieces-jointes' },
];

export default function PiecesJointesIndex({ piecesJointes, filters, typesPieces }: PiecesJointesIndexProps) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        router.get('/pieces-jointes', { search: value, type_piece: filters.type_piece }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleTypeFilter = (value: string) => {
        router.get('/pieces-jointes', { search: filters.search, type_piece: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (pieceJointe: PieceJointe) => {
        router.delete(`/pieces-jointes/${pieceJointe.id}`, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success('Pièce jointe supprimée avec succès.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression de la pièce jointe.');
            },
        });
    };

    const getAttachableName = (pieceJointe: PieceJointe) => {
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

    const getAttachableLink = (pieceJointe: PieceJointe) => {
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
            <Head title="Gestion des pièces jointes" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gestion des pièces jointes</h1>
                    <Link href="/pieces-jointes/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Ajouter une pièce jointe
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par numéro ou nom..."
                            className="pl-9"
                            defaultValue={filters.search}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="w-48">
                        <Select
                            value={filters.type_piece || ''}
                            onValueChange={handleTypeFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tous les types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={undefined}>Tous les types</SelectItem>
                                {Object.entries(typesPieces).map(([key, value]) => (
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
                                <TableHead>Type</TableHead>
                                <TableHead>Numéro</TableHead>
                                <TableHead>Attaché à</TableHead>
                                <TableHead>Dates</TableHead>
                                <TableHead>Fichier</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {piecesJointes.data.map((pieceJointe) => (
                                <TableRow key={pieceJointe.id}>
                                    <TableCell className="font-medium">
                                        {typesPieces[pieceJointe.type_piece] || pieceJointe.type_piece}
                                    </TableCell>
                                    <TableCell>{pieceJointe.numero_piece}</TableCell>
                                    <TableCell>
                                        <Link href={getAttachableLink(pieceJointe)} className="text-primary hover:underline">
                                            {getAttachableName(pieceJointe)}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(pieceJointe.date_emission), 'dd/MM/yyyy', { locale: fr })}
                                        {pieceJointe.date_expiration && ` → ${format(new Date(pieceJointe.date_expiration), 'dd/MM/yyyy', { locale: fr })}`}
                                    </TableCell>
                                    <TableCell>
                                        <a 
                                            href={`/storage/${pieceJointe.fichier}`} 
                                            target="_blank" 
                                            className="flex items-center text-primary hover:underline"
                                        >
                                            <FileIcon className="h-4 w-4 mr-1" />
                                            Voir le fichier
                                        </a>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Link href={`/pieces-jointes/${pieceJointe.id}`}>
                                            <Button variant="outline" size="sm">
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/pieces-jointes/${pieceJointe.id}/edit`}>
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
                                                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette pièce jointe?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action ne peut pas être annulée. Cela supprimera définitivement
                                                        le fichier de nos serveurs.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(pieceJointe)}>Supprimer</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationComponent data={piecesJointes} />
            </div>
        </AppLayout>
    );
}