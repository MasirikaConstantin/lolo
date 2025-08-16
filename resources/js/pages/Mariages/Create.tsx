import MariageForm from './Form';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Mariages', href: '/mariages' },
    { title: 'Enregistrer un mariage', href: '/mariages/create' },
];

export default function MariageCreate({ citoyens, fonctionnaires, regimes }: any) {
    return (
        <MariageForm 
            citoyens={citoyens}
            fonctionnaires={fonctionnaires}
            regimes={regimes}
            breadcrumbs={breadcrumbs}
            title="Enregistrer un nouveau mariage"
        />
    );
}