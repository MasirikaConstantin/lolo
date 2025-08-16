import DocumentMariageForm from './Form';
import { BreadcrumbItem } from '@/types';
import { DocumentMariage } from '@/types';

interface DocumentMariageEditProps {
    document: DocumentMariage;
    mariages: any[];
    fonctionnaires: any[];
    typesDocuments: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Documents de mariage', href: '/documents-mariage' },
    { title: 'Modifier document', href: '' },
];

export default function DocumentMariageEdit({ 
    document, 
    mariages, 
    fonctionnaires, 
    typesDocuments 
}: DocumentMariageEditProps) {
    return (
        <DocumentMariageForm 
            document={document}
            mariages={mariages}
            fonctionnaires={fonctionnaires}
            typesDocuments={typesDocuments}
            breadcrumbs={breadcrumbs}
            title={`Modifier document ${document.numero_document}`}
        />
    );
}