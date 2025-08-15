<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EtapeMariage extends Model
{
    //
    protected $fillable = [
        'mariage_id', 'etape', 'statut',
        'date_debut', 'date_fin', 'responsable_id',
        'commentaires', 'created_by', 'updated_by'
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
}
