import MariageForm from './Form';
import { BreadcrumbItem } from '@/types';
import { Mariage } from '@/types';

interface MariageEditProps {
    mariage: Mariage;
    citoyens: any[];
    fonctionnaires: any[];
    regimes: Record<string, string>;
    statuts: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Mariages', href: '/mariages' },
    { title: 'Modifier mariage', href: '' },
];

export default function MariageEdit({ mariage, citoyens, fonctionnaires, regimes, statuts }: MariageEditProps) {
    return (
        <MariageForm 
            mariage={mariage}
            citoyens={citoyens}
            fonctionnaires={fonctionnaires}
            regimes={regimes}
            statuts={statuts}
            breadcrumbs={breadcrumbs}
            title="Modifier les informations du mariage"
        />
    );
}