<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mariage extends Model
{
    use HasFactory;
    protected $fillable = [
        'homme_id', 'femme_id', 'date_mariage', 'heure_mariage',
        'officier_id', 'lieu_mariage', 'regime_matrimonial',
        'temoins_homme', 'temoins_femme', 'statut', 'notes'
    ];

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
    protected $casts = [
        'temoins_homme' => 'array',
        'temoins_femme' => 'array',
    ];
    public function homme()
    {
        return $this->belongsTo(Citoyen::class, 'homme_id');
    }

    public function femme()
    {
        return $this->belongsTo(Citoyen::class, 'femme_id');
    }

    public function officier()
    {
        return $this->belongsTo(Fonctionnaire::class, 'officier_id');
    }

    public function documents()
    {
        return $this->hasMany(DocumentMariage::class);
    }

    public function paiements()
    {
        return $this->hasMany(Paiement::class);
    }

    public function etapes()
    {
        return $this->hasMany(EtapeMariage::class);
    }

    public static function regimesMatrimoniaux(): array
    {
        return [
            'séparation_de_biens' => 'Séparation de biens',
            'communauté_réduite' => 'Communauté réduite aux acquêts',
            'communauté_universelle' => 'Communauté universelle',
            'participation_aux_acquêts' => 'Participation aux acquêts',
        ];
    }

    public static function statuts(): array
    {
        return [
            'en_attente' => 'En attente',
            'approuvé' => 'Approuvé',
            'rejeté' => 'Rejeté',
            'célébré' => 'Célébré',
        ];
    }
}
