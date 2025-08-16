<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentMariage extends Model
{
    use HasFactory;
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
            if (auth()->check()) {
                $model->created_by = auth()->user()->id;
                $model->updated_by = auth()->user()->id;
            }
        });
    }
    protected $casts = [
        'date_emission' => 'date',
        'date_expiration' => 'date',
        'date_livraison' => 'date',
        'livre' => 'boolean',
    ];

    public function mariage()
    {
        return $this->belongsTo(Mariage::class);
    }

    public function livrePar()
    {
        return $this->belongsTo(Fonctionnaire::class, 'livre_par');
    }

    public function createdBy()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function typesDocuments(): array
    {
        return [
            'certificat_celibat' => 'Certificat de célibat',
            'bulletin_mariage' => 'Bulletin de mariage',
            'copie_acte_mariage' => 'Copie d\'acte de mariage',
            'attestation_mariage' => 'Attestation de mariage',
            'autre' => 'Autre document',
        ];
    }
}