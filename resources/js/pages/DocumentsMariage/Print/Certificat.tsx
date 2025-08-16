import { Head } from '@inertiajs/react';
import { DocumentMariage } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { PrinterIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface CertificatPrintProps {
    document: DocumentMariage;
}

export default function CertificatPrint({ document }: CertificatPrintProps) {
    const printRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timeout = setTimeout(() => {
            window.print();
        }, 500);

        return () => clearTimeout(timeout);
    }, []);

    const getCoupleNames = () => {
        return `${document.mariage?.homme?.nom} ${document.mariage?.homme?.prenom} & ${document.mariage?.femme?.nom} ${document.mariage?.femme?.prenom}`;
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-6">
            <div className="no-print flex justify-end mb-4">
                <Button onClick={handlePrint}>
                    <PrinterIcon className="h-4 w-4 mr-2" />
                    Imprimer
                </Button>
            </div>

            <div ref={printRef} className="bg-white text-black p-8 border rounded-lg">
                <Head title={`Certificat de mariage - ${getCoupleNames()}`} />
                
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h1>
                    <h2 className="text-xl">MINISTÈRE DE L'INTÉRIEUR</h2>
                    <h3 className="text-lg">OFFICE NATIONAL DE L'ÉTAT CIVIL</h3>
                </div>

                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold underline">CERTIFICAT DE MARIAGE</h1>
                    <p className="text-lg">N° {document.numero_document}</p>
                </div>

                <div className="mb-8">
                    <p className="mb-4">
                        Je soussigné(e), {document.mariage?.officier?.nom} {document.mariage?.officier?.prenom}, 
                        Officier de l'État Civil de {document.mariage?.lieu_mariage}, certifie que:
                    </p>

                    <div className="pl-8 mb-4">
                        <p className="mb-2">
                            Le mariage entre <strong>{document.mariage?.homme?.nom} {document.mariage?.homme?.prenom}</strong>, 
                            né le {format(new Date(document.mariage?.homme?.date_naissance), 'PP', { locale: fr })} à {document.mariage?.homme?.lieu_naissance},
                            fils de {document.mariage?.homme?.nom_pere} et {document.mariage?.homme?.nom_mere},
                        </p>
                        <p>
                            et <strong>{document.mariage?.femme?.nom} {document.mariage?.femme?.prenom}</strong>, 
                            née le {format(new Date(document.mariage?.femme?.date_naissance), 'PP', { locale: fr })} à {document.mariage?.femme?.lieu_naissance},
                            fille de {document.mariage?.femme?.nom_pere} et {document.mariage?.femme?.nom_mere},
                        </p>
                    </div>

                    <p className="mb-4">
                        a été célébré le {format(new Date(document.mariage?.date_mariage), 'PP', { locale: fr })} à {document.mariage?.lieu_mariage},
                        conformément à la loi et aux règlements en vigueur.
                    </p>

                    <p className="mb-4">
                        Régime matrimonial: <strong>{document.mariage?.regime_matrimonial.replace(/_/g, ' ')}</strong>
                    </p>

                    <p className="mb-4">
                        Témoins de l'époux: {document.mariage?.temoins_homme?.join(', ') || 'Aucun'}
                    </p>

                    <p>
                        Témoins de l'épouse: {document.mariage?.temoins_femme?.join(', ') || 'Aucun'}
                    </p>
                </div>

                <div className="flex justify-between mt-12">
                    <div className="text-center">
                        <p>Le Couple</p>
                        <div className="h-16"></div>
                        <p>{getCoupleNames()}</p>
                    </div>

                    <div className="text-center">
                        <p>L'Officier de l'État Civil</p>
                        <div className="h-16"></div>
                        <p>{document.mariage?.officier?.nom} {document.mariage?.officier?.prenom}</p>
                    </div>
                </div>

                <div className="mt-8 text-sm text-right">
                    <p>Délivré le {format(new Date(document.date_emission), 'PP', { locale: fr })}</p>
                    {document.date_expiration && (
                        <p>Valable jusqu'au {format(new Date(document.date_expiration), 'PP', { locale: fr })}</p>
                    )}
                </div>
            </div>
            <style>{`
                @page {
                    size: A4;
                    margin: 20mm;
                }
                @media print {
                    body {
                        -webkit-print-color-adjust: exact;
                    }
                    body {
                        font-size: 12pt;
                        background: white !important;
                        color: black !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
        </div>
    );
}