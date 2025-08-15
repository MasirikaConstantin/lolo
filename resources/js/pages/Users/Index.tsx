import { Head, Link, router } from '@inertiajs/react';
import {  User } from '@/types';
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
  } from "@/components/ui/alert-dialog"
import { toast } from 'sonner';

interface UsersIndexProps {
    users: {
        data: User[];
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
    { title: 'Utilisateurs', href: '/users' },
];

export default function UsersIndex({ users, filters }: UsersIndexProps) {
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        router.get('/users', { search: value }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = (user: User) => {
        router.delete(`/users/${user.ref}`, {
            preserveState: true,
            replace: true,
            onSuccess: () => {
                toast.success('Utilisateur supprimé avec succès.');
            },
            onError: () => {
                toast.error('Une erreur est survenue lors de la suppression de l\'utilisateur.');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion des utilisateurs" />
            
            <div className="flex flex-col gap-4 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Gestion des utilisateurs</h1>
                    <Link href="/users/create">
                        <Button>
                            <PlusIcon className="mr-2 h-4 w-4" />
                            Ajouter un utilisateur
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
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={user.is_active ? 'default' : 'destructive'}>
                                            {user.is_active ? 'Actif' : 'Inactif'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{format(new Date(user.created_at), 'PP', { locale: fr })}</TableCell>
                                    <TableCell className="flex justify-end gap-2">
                                        <Link href={route('users.show', user.ref)}>
                                            <Button variant="outline" size="sm">
                                                <EyeIcon className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={route('users.edit', user.ref)}>
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
                                                <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet utilisateur?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Cette action ne peut pas être annulée. Cela supprimera votre
                                                    compte et supprimera vos données de nos serveurs.
                                                </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(user)}>Supprimer</AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                            </AlertDialog>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <PaginationComponent data={users} />
            </div>
        </AppLayout>
    );
}