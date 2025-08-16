import DocumentMariageForm from './Form';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Documents de mariage', href: '/documents-mariage' },
    { title: 'Créer un document', href: '/documents-mariage/create' },
];

interface DocumentMariageCreateProps {
    mariages: any[];
    fonctionnaires: any[];
    typesDocuments: Record<string, string>;
}

export default function DocumentMariageCreate({ 
    mariages, 
    fonctionnaires, 
    typesDocuments 
}: DocumentMariageCreateProps) {
    return (
        <DocumentMariageForm 
            mariages={mariages}
            fonctionnaires={fonctionnaires}
            typesDocuments={typesDocuments}
            breadcrumbs={breadcrumbs}
            title="Enregistrer un nouveau document"
        />
    );
}