import { Head, Link, router } from '@inertiajs/react';
import { DocumentMariage } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { SearchIcon, PlusIcon, PencilIcon, Trash2Icon, EyeIcon, PrinterIcon } from 'lucide-react';
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

interface DocumentsMariageIndexProps {
    documents: {
        data: DocumentMariage[];
        links: any[];
        from: number;
        to: number;
        total: number;
    };
    filters: {
        search?: string;
        type_document?: string;
        livre?: boolean;
    };
    typesDocuments: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Documents de mariage', href: '/documents-mariage' },
];

export default function DocumentsMariageIndex({ documents, filters, typesDocuments }: DocumentsMariageIndexProps) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        router.get('/documents-mariage', { 
            search: value, 
            type_document: filters.type_document,
            livre: filters.livre
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleTypeFilter = (value: string) => {
        router.get('/documents-mariage', { 
            search: filters.search,
            type_document: value,
            livre: filters.livre
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleLivreFilter = (value: string) => {
        const livreValue = value === 'all' ? null : value === 'true';
        router.get('/documents-mariage', { 
            search: filters.search,
            type_document: filters.type_document,
            livre: livreValue
        }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (document: DocumentMariage) => {
        router.delete(`/documents-mariage/${document.id}`, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success('Document supprimé avec succès.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression du document.');
            },
        });
    };

    const getCoupleNames = (document: DocumentMariage) => {
        if (!document.mariage) return 'N/A';
        return `${document.mariage.homme?.nom} ${document.mariage.homme?.prenom} & ${document.mariage.femme?.nom} ${document.mariage.femme?.prenom}`;
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des documents de mariage" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gestion des documents de mariage</h1>
                    <Link href="/documents-mariage/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Ajouter un document
                        </Button>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par numéro ou noms..."
                            className="pl-9"
                            defaultValue={filters.search}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="w-48">
                        <Select
                            value={filters.type_document || ''}
                            onValueChange={handleTypeFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tous les types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={undefined}>Tous les types</SelectItem>
                                {Object.entries(typesDocuments).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-48">
                        <Select
                            value={filters.livre === undefined ? 'all' : filters.livre ? 'true' : 'false'}
                            onValueChange={handleLivreFilter}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Tous les statuts</SelectItem>
                                <SelectItem value="true">Livrés</SelectItem>
                                <SelectItem value="false">Non livrés</SelectItem>
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
                                <TableHead>Couple</TableHead>
                                <TableHead>Date émission</TableHead>
                                <TableHead>Statut</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.data.map((document) => (
                                <TableRow key={document.id}>
                                    <TableCell className="font-medium">
                                        {typesDocuments[document.type_document] || document.type_document}
                                    </TableCell>
                                    <TableCell>{document.numero_document}</TableCell>
                                    <TableCell>{getCoupleNames(document)}</TableCell>
                                    <TableCell>
                                        {format(new Date(document.date_emission), 'PP', { locale: fr })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={document.livre ? 'default' : 'secondary'}>
                                            {document.livre ? 'Livré' : 'Non livré'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Link href={`/documents-mariage/${document.id}/print/certificat`} target="_blank">
                                            <Button variant="outline" size="sm">
                                                <PrinterIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/documents-mariage/${document.ref}`}>
                                            <Button variant="outline" size="sm">
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/documents-mariage/${document.id}/edit`}>
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
                                                    <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer ce document?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Cette action ne peut pas être annulée. Cela supprimera définitivement
                                                        le document de nos serveurs.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(document)}>Supprimer</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationComponent data={documents} />
            </div>
        </AppLayout>
    );
}