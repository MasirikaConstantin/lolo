<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EtapeMariage extends Model
{
    use HasFactory;
   
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = \Illuminate\Support\Str::uuid();
            if (auth()->check()) {
                $model->created_by = auth()->user()->id;
                $model->updated_by = auth()->user()->id;
            }
        });
    }

    protected $fillable = [
        'mariage_id',
        'etape',
        'statut',
        'date_debut',
        'date_fin',
        'responsable_id',
        'commentaires',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    public static function etapes(): array
    {
        return [
            'depot_dossier' => 'Dépôt du dossier',
            'paiement' => 'Paiement des frais',
            'publication_bans' => 'Publication des bans',
            'verification' => 'Vérification des documents',
            'celebration' => 'Célébration du mariage',
            'enregistrement' => 'Enregistrement civil',
            'livraison_acte' => 'Livraison de l\'acte',
        ];
    }

    public static function statuts(): array
    {
        return [
            'en_attente' => 'En attente',
            'en_cours' => 'En cours',
            'complet' => 'Complété',
            'rejete' => 'Rejeté',
        ];
    }

    public function mariage()
    {
        return $this->belongsTo(Mariage::class);
    }

    public function responsable()
    {
        return $this->belongsTo(Fonctionnaire::class, 'responsable_id');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
