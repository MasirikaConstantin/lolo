<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePaiementRequest;
use App\Http\Requests\UpdatePaiementRequest;
use App\Models\Paiement;
use App\Models\Mariage;
use App\Models\Fonctionnaire;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PaiementController extends Controller
{
    public function index(Request $request)
    {
        $paiements = Paiement::with(['mariage', 'mariage.homme', 'mariage.femme', 'encaisseur', 'createdBy'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('reference_paiement', 'like', "%{$search}%")
                    ->orWhereHas('mariage', function ($q) use ($search) {
                        $q->where('reference', 'like', "%{$search}%");
                    });
            })
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($paiement) => [
                'id' => $paiement->id,
                'ref' => $paiement->ref,
                'mariage' => $paiement->mariage,
                'montant' => number_format($paiement->montant, 2, ',', ' '),
                'mode_paiement' => $paiement->mode_paiement,
                'reference_paiement' => $paiement->reference_paiement,
                'date_paiement' => $paiement->date_paiement,
                'statut' => $paiement->statut,
                'encaisser_par' => $paiement->encaisseur->nom_complet,
                'created_at' => $paiement->created_at,
                'created_by' => $paiement->createdBy?->name,
            ]);
        return Inertia::render('Paiements/Index', [
            'paiements' => $paiements,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
    {
        // Seuls les mariages approuvés peuvent avoir des paiements
        $mariages = Mariage::with(['homme', 'femme'])->where('statut', 'approuvé')
            ->select('id', 'ref', 'homme_id', 'femme_id')
            ->get();
        $fonctionnaires = Fonctionnaire::select(
            'id',
            DB::raw("(nom || ' ' || postnom || ' ' || prenom) as nom_complet")
        )->get();

        return Inertia::render('Paiements/Create', [
            'mariages' => $mariages,
            'fonctionnaires' => $fonctionnaires,
            'modes_paiement' => ['Espèces', 'Mobile Money', 'Carte Bancaire', 'Virement', 'Chèque'],
        ]);
    }

    public function store(StorePaiementRequest $request)
    {
        DB::transaction(function () use ($request) {
            $mariage = Mariage::findOrFail($request->mariage_id);
            
            if ($mariage->statut !== 'approuvé') {
                throw new \Exception("Le mariage doit être approuvé avant d'enregistrer un paiement");
            }

            Paiement::create([
                'mariage_id' => $request->mariage_id,
                'montant' => $request->montant,
                'mode_paiement' => $request->mode_paiement,
                'reference_paiement' => $request->reference_paiement,
                'date_paiement' => $request->date_paiement,
                'statut' => $request->statut,
                'encaisser_par' => $request->encaisser_par,
                'notes' => $request->notes,
            ]);
        });

        return redirect()->route('paiements.index')->with('success', 'Paiement enregistré avec succès.');
    }

    public function show(string $ref)
    {
        $paiement = Paiement::with(['mariage', 'encaisseur'])->where('ref', $ref)->first();
        return Inertia::render('Paiements/Show', [
            'paiement' => [
                'ref' => $paiement->ref,
                'mariage_ref' => $paiement->mariage->ref,
                'montant' => number_format($paiement->montant, 2, ',', ' '),
                'mode_paiement' => $paiement->mode_paiement,
                'reference_paiement' => $paiement->reference_paiement,
                'date_paiement' => $paiement->date_paiement,
                'statut' => $paiement->statut,
                'encaisser_par' => $paiement->encaisseur->nom_complet,
                'encaisser_par_id' => $paiement->encaisser_par,
                'notes' => $paiement->notes,
                'created_at' => $paiement->created_at,
                'updated_at' => $paiement->updated_at,
                'created_by' => $paiement->createdBy?->name,
                'updated_by' => $paiement->updatedBy?->name,
            ],
        ]);
    }

    public function edit(string $ref)
    {
        $paiement = Paiement::with(['mariage', 'encaisseur'])->where('ref', $ref)->first();
        $fonctionnaires = Fonctionnaire::select(
            'id',
            DB::raw("(nom || ' ' || postnom || ' ' || prenom) as nom_complet")
        )->get();

        return Inertia::render('Paiements/Edit', [
            'paiement' => [
                'id' => $paiement->id,
                'ref' => $paiement->ref,
                'mariage_id' => $paiement->mariage_id,
                'mariage_ref' => $paiement->mariage->ref,
                'montant' => $paiement->montant,
                'mode_paiement' => $paiement->mode_paiement,
                'reference_paiement' => $paiement->reference_paiement,
                'date_paiement' => $paiement->date_paiement,
                'statut' => $paiement->statut,
                'encaisser_par' => $paiement->encaisser_par,
                'notes' => $paiement->notes,
            ],
            'fonctionnaires' => $fonctionnaires,
            'modes_paiement' => ['Espèces', 'Mobile Money', 'Carte Bancaire', 'Virement', 'Chèque'],
        ]);
    }

    public function update(UpdatePaiementRequest $request, Paiement $paiement)
    {
        $paiement->update([
            'montant' => $request->montant,
            'mode_paiement' => $request->mode_paiement,
            'reference_paiement' => $request->reference_paiement,
            'date_paiement' => $request->date_paiement,
            'statut' => $request->statut,
            'encaisser_par' => $request->encaisser_par,
            'notes' => $request->notes,
        ]);

        return redirect()->route('paiements.index')->with('success', 'Paiement mis à jour avec succès.');
    }

    public function destroy(string $ref)
    {
        $paiement = Paiement::with(['mariage', 'encaisseur'])->where('ref', $ref)->first();
        $paiement->delete();
        return redirect()->route('paiements.index')->with('success', 'Paiement supprimé avec succès.');
    }
}