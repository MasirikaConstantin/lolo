<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Fonctionnaire extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom', 'postnom', 'prenom', 'fonction', 'grade',
        'matricule', 'email', 'telephone', 'date_embauche',
        'photo', 'created_by', 'updated_by', 'user_id'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
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
            $model->ref = \Illuminate\Support\Str::uuid();
            if (auth()->check()) {
                $model->created_by = auth()->user()->id;
            }
        });

        static::updating(function ($model) {
            if (auth()->check()) {
                $model->updated_by = auth()->user()->id;
            }
        });
    }
    protected $appends = ['nomcomplet'];
    public function getNomcompletAttribute()
    {
        return $this->nom . ' ' . $this->postnom . ' ' . $this->prenom;
    }
}
