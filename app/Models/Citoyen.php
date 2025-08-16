<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Citoyen extends Model
{
    use HasFactory; 
    protected $fillable = [
        'nom', 'postnom', 'prenom', 'sexe', 'date_naissance', 'lieu_naissance',
        'etat_civil', 'profession', 'adresse', 'nom_pere', 'nom_mere',
        'numero_identification_national', 'photo'
    ];

    protected $casts = [
        'date_naissance' => 'date',
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
    public function mariagesHomme()
    {
        return $this->hasMany(Mariage::class, 'homme_id');
    }

    public function mariagesFemme()
    {
        return $this->hasMany(Mariage::class, 'femme_id');
    }

    public function piecesJointes()
    {
        return $this->morphMany(PieceJointe::class, 'attachable');
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