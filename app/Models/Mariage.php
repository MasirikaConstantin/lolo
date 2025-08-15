<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mariage extends Model
{
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
            $model->created_by = auth()->user()->id;
            $model->updated_by = auth()->user()->id;
        });
    }
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
}
