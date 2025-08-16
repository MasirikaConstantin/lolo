import EtapeMariageForm from './Form';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Étapes de mariage', href: '/etapes-mariage' },
    { title: 'Créer une étape', href: '/etapes-mariage/create' },
];

interface EtapeMariageCreateProps {
    mariages: any[];
    fonctionnaires: any[];
    etapesOptions: Record<string, string>;
    statutsOptions: Record<string, string>;
}

export default function EtapeMariageCreate({ 
    mariages, 
    fonctionnaires, 
    etapesOptions, 
    statutsOptions 
}: EtapeMariageCreateProps) {
    return (
        <EtapeMariageForm 
            mariages={mariages}
            fonctionnaires={fonctionnaires}
            etapesOptions={etapesOptions}
            statutsOptions={statutsOptions}
            breadcrumbs={breadcrumbs}
            title="Créer une nouvelle étape"
        />
    );
}