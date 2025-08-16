import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, PaperclipIcon } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AttachPieceJointe({ attachableType, attachableId, typesPieces }: {
    attachableType: string;
    attachableId: string;
    typesPieces: string[];
}) {
    const { data, setData, post, processing, reset } = useForm({
        type_piece: '',
        numero_piece: '',
        fichier: null as File | null,
        date_emission: new Date(),
        date_expiration: null as Date | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('type_piece', data.type_piece);
        formData.append('numero_piece', data.numero_piece);
        if (data.fichier) formData.append('fichier', data.fichier);
        formData.append('date_emission', data.date_emission.toISOString());
        if (data.date_expiration) formData.append('date_expiration', data.date_expiration.toISOString());

        post(`/piece-jointes/attach/${attachableType}/${attachableId}`, {
            data: formData,
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success('Pièce jointe ajoutée avec succès');
            },
            onError: () => {
                toast.error('Erreur lors de l\'ajout de la pièce jointe');
            },
        });
    };

    return (
        <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-4">Ajouter une pièce jointe</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="type_piece">Type de pièce *</Label>
                        <Select
                            value={data.type_piece}
                            onValueChange={(value) => setData('type_piece', value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un type" />
                            </SelectTrigger>
                            <SelectContent>
                                {typesPieces.map((type) => (
                                    <SelectItem key={type} value={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numero_piece">Numéro de pièce *</Label>
                        <Input
                            id="numero_piece"
                            value={data.numero_piece}
                            onChange={(e) => setData('numero_piece', e.target.value)}
                            placeholder="1234567890"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="fichier">Fichier *</Label>
                        <div className="flex items-center gap-4">
                            <Label
                                htmlFor="fichier"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent"
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <PaperclipIcon className="w-8 h-8 mb-4 text-muted-foreground" />
                                    <p className="mb-2 text-sm text-muted-foreground">
                                        <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {data.fichier ? data.fichier.name : 'PDF, JPG, PNG (max. 2MB)'}
                                    </p>
                                </div>
                                <Input
                                    id="fichier"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setData('fichier', e.target.files[0]);
                                        }
                                    }}
                                />
                            </Label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date_emission">Date d'émission *</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.date_emission && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.date_emission ? (
                                        format(data.date_emission, "PPP", { locale: fr })
                                    ) : (
                                        <span>Choisir une date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.date_emission}
                                    onSelect={(date) => date && setData('date_emission', date)}
                                    initialFocus
                                    locale={fr}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date_expiration">Date d'expiration</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !data.date_expiration && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {data.date_expiration ? (
                                        format(data.date_expiration, "PPP", { locale: fr })
                                    ) : (
                                        <span>Choisir une date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                                <Calendar
                                    mode="single"
                                    selected={data.date_expiration || undefined}
                                    onSelect={(date) => setData('date_expiration', date || null)}
                                    initialFocus
                                    locale={fr}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button type="submit" disabled={processing} size="sm">
                        {processing ? 'Enregistrement...' : 'Attacher la pièce'}
                    </Button>
                </div>
            </form>
        </div>
    );
}