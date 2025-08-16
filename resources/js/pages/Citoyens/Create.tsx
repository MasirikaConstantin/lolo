import CitoyenForm from './Form';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Citoyens', href: '/citoyens' },
    { title: 'Ajouter un citoyen', href: '/citoyens/create' },
];

export default function CitoyenCreate() {
    return (
        <CitoyenForm 
            breadcrumbs={breadcrumbs}
            title="Ajouter un nouveau citoyen"
        />
    );
}