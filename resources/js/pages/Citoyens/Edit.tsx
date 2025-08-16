import CitoyenForm from './Form';
import { BreadcrumbItem } from '@/types';
import { Citoyen } from '@/types';

interface CitoyenEditProps {
    citoyen: Citoyen;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Citoyens', href: '/citoyens' },
    { title: 'Modifier citoyen', href: '' },
];

export default function CitoyenEdit({ citoyen }: CitoyenEditProps) {
    return (
        <CitoyenForm 
            citoyen={citoyen}
            breadcrumbs={breadcrumbs}
            title={`Modifier ${citoyen.nom} ${citoyen.postnom} ${citoyen.prenom}`}
        />
    );
}