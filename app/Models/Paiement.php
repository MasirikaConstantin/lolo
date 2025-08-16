<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    

    use HasFactory;

    protected $fillable = [
        'mariage_id',
        'montant',
        'mode_paiement',
        'reference_paiement',
        'date_paiement',
        'statut',
        'encaisser_par',
        'notes',
        'ref',
        'created_by',
        'updated_by',
    ];
    
    public function mariage(): BelongsTo
    {
        return $this->belongsTo(Mariage::class);
    }

    public function encaisseur(): BelongsTo
    {
        return $this->belongsTo(Fonctionnaire::class, 'encaisser_par');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->ref = (string) \Illuminate\Support\Str::uuid();
            if (auth()->check()) {
                $model->created_by = auth()->id();
            }
        });

        static::updating(function ($model) {
            if (auth()->check()) {
                $model->updated_by = auth()->id();
            }
        });

        // Validation avant création
        static::creating(function ($paiement) {
            if ($paiement->mariage->statut !== 'approuvé') {
                throw new \Exception("Le mariage doit être approuvé avant d'enregistrer un paiement");
            }
        });
    }
}
