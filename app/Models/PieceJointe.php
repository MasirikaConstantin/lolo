<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PieceJointe extends Model
{
    use HasFactory;

    protected $fillable = [
        'type_piece',
        'numero_piece',
        'fichier',
        'date_emission',
        'date_expiration',
        'ref',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'date_emission' => 'date',
        'date_expiration' => 'date',
    ];

    public static function typesPieces(): array
    {
        return [
            'cni' => 'Carte Nationale d\'Identité',
            'acte_naissance' => 'Acte de naissance',
            'certificat_celibat' => 'Certificat de célibat',
            'bulletin_mariage' => 'Bulletin de mariage',
            'justificatif_domicile' => 'Justificatif de domicile',
            'autre' => 'Autre document',
        ];
    }
    public function attachable()
    {
        return $this->morphTo();
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
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
    }

    // Chemin complet du fichier
    public function getFilePathAttribute()
    {
        return storage_path('app/public/' . $this->fichier);
    }

    // URL publique du fichier
    public function getFileUrlAttribute()
    {
        return asset('storage/' . $this->fichier);
    }
}
