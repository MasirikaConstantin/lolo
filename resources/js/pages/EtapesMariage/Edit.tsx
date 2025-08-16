import EtapeMariageForm from './Form';
import { BreadcrumbItem } from '@/types';
import { EtapeMariage } from '@/types';

interface EtapeMariageEditProps {
    etape: EtapeMariage;
    mariages: any[];
    fonctionnaires: any[];
    etapesOptions: Record<string, string>;
    statutsOptions: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Étapes de mariage', href: '/etapes-mariage' },
    { title: 'Modifier étape', href: '' },
];

export default function EtapeMariageEdit({ 
    etape, 
    mariages, 
    fonctionnaires, 
    etapesOptions, 
    statutsOptions 
}: EtapeMariageEditProps) {
    return (
        <EtapeMariageForm 
            etape={etape}
            mariages={mariages}
            fonctionnaires={fonctionnaires}
            etapesOptions={etapesOptions}
            statutsOptions={statutsOptions}
            breadcrumbs={breadcrumbs}
            title={`Modifier l'étape - ${etapesOptions[etape.etape]}`}
        />
    );
}