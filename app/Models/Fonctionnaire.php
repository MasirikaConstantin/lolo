<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fonctionnaire extends Model
{
    protected $fillable = [
        'nom', 'postnom', 'prenom', 'fonction', 'grade',
        'matricule', 'email', 'telephone', 'date_embauche',
        'photo', 'created_by', 'updated_by'
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
