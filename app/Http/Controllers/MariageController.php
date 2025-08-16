<?php

namespace App\Http\Controllers;

use App\Models\Citoyen;
use App\Models\Fonctionnaire;
use App\Models\Mariage;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MariageController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'statut']);

        $mariages = Mariage::with(['homme', 'femme', 'officier'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->whereHas('homme', function ($q) use ($search) {
                    $q->where('nom', 'like', '%'.$search.'%')
                      ->orWhere('postnom', 'like', '%'.$search.'%')
                      ->orWhere('prenom', 'like', '%'.$search.'%');
                })
                ->orWhereHas('femme', function ($q) use ($search) {
                    $q->where('nom', 'like', '%'.$search.'%')
                      ->orWhere('postnom', 'like', '%'.$search.'%')
                      ->orWhere('prenom', 'like', '%'.$search.'%');
                });
            })
            ->when($filters['statut'] ?? null, function ($query, $statut) {
                $query->where('statut', $statut);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Mariages/Index', [
            'mariages' => $mariages,
            'filters' => $filters,
            'statuts' => Mariage::statuts(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Mariages/Create', [
            'citoyens' => Citoyen::all(),
            'fonctionnaires' => Fonctionnaire::all(),
            'regimes' => Mariage::regimesMatrimoniaux(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'homme_id' => 'required|exists:citoyens,id',
            'femme_id' => 'required|exists:citoyens,id|different:homme_id',
            'date_mariage' => 'required|date|after_or_equal:today',
            'heure_mariage' => 'required|date_format:H:i:s',
            'officier_id' => 'required|exists:fonctionnaires,id',
            'lieu_mariage' => 'required|string|max:255',
            'regime_matrimonial' => 'required|in:'.implode(',', array_keys(Mariage::regimesMatrimoniaux())),
            'temoins_homme' => 'nullable|array',
            'temoins_homme.*' => 'string|max:255',
            'temoins_femme' => 'nullable|array',
            'temoins_femme.*' => 'string|max:255',
            'statut' => 'required|in:'.implode(',', array_keys(Mariage::statuts())),
            'notes' => 'nullable|string',
        ]);

        Mariage::create($validated);

        return redirect()->route('mariages.index')->with('success', 'Mariage enregistré avec succès.');
    }

    public function show($ref)
    {
        $mariage = Mariage::where('ref', $ref)->first();
        return Inertia::render('Mariages/Show', [
            'mariage' => $mariage->load(['homme', 'femme', 'officier']),
        ]);
    }

    public function edit($ref)
    {
        $mariage = Mariage::where('ref', $ref)->first();
        return Inertia::render('Mariages/Edit', [
            'mariage' => $mariage,
            'citoyens' => Citoyen::all(),
            'fonctionnaires' => Fonctionnaire::all(),
            'regimes' => Mariage::regimesMatrimoniaux(),
            'statuts' => Mariage::statuts(),
        ]);
    }

    public function update(Request $request, Mariage $mariage)
    {
        $validated = $request->validate([
            'homme_id' => 'required|exists:citoyens,id',
            'femme_id' => 'required|exists:citoyens,id|different:homme_id',
            'date_mariage' => 'required|date',
            'heure_mariage' => 'required|date_format:H:i:s',
            'officier_id' => 'required|exists:fonctionnaires,id',
            'lieu_mariage' => 'required|string|max:255',
            'regime_matrimonial' => 'required|in:'.implode(',', array_keys(Mariage::regimesMatrimoniaux())),
            'temoins_homme' => 'nullable|array',
            'temoins_homme.*' => 'string|max:255',
            'temoins_femme' => 'nullable|array',
            'temoins_femme.*' => 'string|max:255',
            'statut' => 'required|in:'.implode(',', array_keys(Mariage::statuts())),
            'notes' => 'nullable|string',
        ]);

        $mariage->update($validated);

        return redirect()->route('mariages.index')->with('success', 'Mariage mis à jour avec succès.');
    }

    public function destroy( string $ref)
    {
        $mariage = Mariage::where('ref', $ref)->first();
        $mariage->delete();

        return redirect()->route('mariages.index')->with('success', 'Mariage supprimé avec succès.');
    }
}