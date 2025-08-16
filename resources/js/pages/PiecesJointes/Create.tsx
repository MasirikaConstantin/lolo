import PieceJointeForm from './Form';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tableau de bord', href: '/dashboard' },
    { title: 'Pièces jointes', href: '/pieces-jointes' },
    { title: 'Ajouter une pièce jointe', href: '/pieces-jointes/create' },
];

interface PieceJointeCreateProps {
    attachableType?: string;
    attachableId?: number;
    typesPieces: Record<string, string>;
}

export default function PieceJointeCreate({ 
    attachableType, 
    attachableId, 
    typesPieces 
}: PieceJointeCreateProps) {
    return (
        <PieceJointeForm 
            attachableType={attachableType}
            attachableId={attachableId}
            typesPieces={typesPieces}
            breadcrumbs={breadcrumbs}
            title={attachableType && attachableId 
                ? `Ajouter une pièce jointe` 
                : 'Créer une nouvelle pièce jointe'}
        />
    );
}