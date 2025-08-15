<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentMariage extends Model
{
    protected $fillable = [
        'mariage_id', 'type_document', 'numero_document',
        'date_emission', 'date_expiration', 'fichier',
        'livre', 'date_livraison', 'livre_par'
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
    public function mariage()
    {
        return $this->belongsTo(Mariage::class);
    }

    public function livrePar()
    {
        return $this->belongsTo(Fonctionnaire::class, 'livre_par');
    }
}