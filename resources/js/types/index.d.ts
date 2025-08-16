import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface User {
    id: number;
    ref: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    is_active: boolean;
    created_at: string;
}

export interface UserFormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'admin' | 'user';
    is_active: boolean;
}

export type Citoyen = {
    id: number;
    nom: string;
    postnom: string;
    prenom: string;
    sexe: 'M' | 'F';
    date_naissance: string;
    lieu_naissance: string;
    etat_civil: 'Célibataire' | 'Marié(e)' | 'Divorcé(e)' | 'Veuf/Veuve';
    profession: string;
    adresse: string;
    nom_pere: string;
    nom_mere: string;
    numero_identification_national: string | null;
    photo: string | null;
    ref: string;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    created_by_user?: {
        name: string;
    };
    updated_by_user?: {
        name: string;
    };
};
export type Mariage = {
    id: number;
    ref: string;
    homme_id: number;
    femme_id: number;
    date_mariage: string;
    heure_mariage: string;
    officier_id: number;
    lieu_mariage: string;
    regime_matrimonial: string;
    temoins_homme: string[] | null;
    temoins_femme: string[] | null;
    statut: 'en_attente' | 'approuvé' | 'rejeté' | 'célébré';
    notes: string | null;
    created_at: string;
    updated_at: string;
    homme?: Citoyen;
    femme?: Citoyen;
    officier?: Fonctionnaire;
};

export type Fonctionnaire = {
    id: number;
    nom: string;
    postnom: string;
    prenom: string;
    fonction: string;
    created_at: string;
    updated_at: string;
};

export type DocumentMariage = {
    id: number;
    mariage_id: number;
    type_document: string;
    numero_document: string;
    date_emission: string;
    date_expiration: string | null;
    fichier: string | null;
    livre: boolean;
    date_livraison: string | null;
    livre_par: number | null;
    ref: string;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    mariage?: Mariage;
    livrePar?: Fonctionnaire;
    createdBy?: User;
    updatedBy?: User;
};
export type EtapeMariage = {
    id: number;
    mariage_id: number;
    etape: string;
    statut: string;
    date_debut: string | null;
    date_fin: string | null;
    responsable_id: number | null;
    commentaires: string | null;
    ref: string;
    created_by: number | null;
    updated_by: number | null;
    created_at: string;
    updated_at: string;
    mariage?: Mariage;
    responsable?: Fonctionnaire;
    createdBy?: User;
    updatedBy?: User;
};