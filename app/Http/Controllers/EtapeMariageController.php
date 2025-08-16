<?php

namespace App\Http\Controllers;

use App\Models\EtapeMariage;
use App\Models\Mariage;
use App\Models\Fonctionnaire;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

class EtapeMariageController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'etape', 'statut']);

        $etapes = EtapeMariage::with(['mariage.homme', 'mariage.femme', 'responsable'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->whereHas('mariage', function ($q) use ($search) {
                    $q->whereHas('homme', function ($q) use ($search) {
                        $q->where('nom', 'like', '%'.$search.'%')
                            ->orWhere('postnom', 'like', '%'.$search.'%')
                            ->orWhere('prenom', 'like', '%'.$search.'%');
                    })
                    ->orWhereHas('femme', function ($q) use ($search) {
                        $q->where('nom', 'like', '%'.$search.'%')
                            ->orWhere('postnom', 'like', '%'.$search.'%')
                            ->orWhere('prenom', 'like', '%'.$search.'%');
                    });
                });
            })
            ->when($filters['etape'] ?? null, function ($query, $etape) {
                $query->where('etape', $etape);
            })
            ->when($filters['statut'] ?? null, function ($query, $statut) {
                $query->where('statut', $statut);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('EtapesMariage/Index', [
            'etapes' => $etapes,
            'filters' => $filters,
            'etapesOptions' => EtapeMariage::etapes(),
            'statutsOptions' => EtapeMariage::statuts(),
        ]);
    }

    public function create()
    {
        return Inertia::render('EtapesMariage/Create', [
            'mariages' => Mariage::with(['homme', 'femme'])->get(),
            'fonctionnaires' => Fonctionnaire::all(),
            'etapesOptions' => EtapeMariage::etapes(),
            'statutsOptions' => EtapeMariage::statuts(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mariage_id' => 'required|exists:mariages,id',
            'etape' => 'required|in:'.implode(',', array_keys(EtapeMariage::etapes())),
            'statut' => 'required|in:'.implode(',', array_keys(EtapeMariage::statuts())),
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'responsable_id' => 'nullable|exists:fonctionnaires,id',
            'commentaires' => 'nullable|string',
        ]);

        $validated['ref'] = Str::uuid();
        $validated['created_by'] = Auth::id();

        EtapeMariage::create($validated);

        return redirect()->route('etapes-mariage.index')->with('success', 'Étape enregistrée avec succès.');
    }

    public function show(string $ref)
    {
        return Inertia::render('EtapesMariage/Show', [
            'etape' => EtapeMariage::where('ref', $ref)->first()->load(['mariage.homme', 'mariage.femme', 'responsable', 'createdBy', 'updatedBy']),
            'etapesOptions' => EtapeMariage::etapes(),
            'statutsOptions' => EtapeMariage::statuts(),
        ]);
    }

    public function edit(EtapeMariage $etapeMariage)
    {
        return Inertia::render('EtapesMariage/Edit', [
            'etape' => $etapeMariage,
            'mariages' => Mariage::with(['homme', 'femme'])->get(),
            'fonctionnaires' => Fonctionnaire::all(),
            'etapesOptions' => EtapeMariage::etapes(),
            'statutsOptions' => EtapeMariage::statuts(),
        ]);
    }

    public function update(Request $request, EtapeMariage $etapeMariage)
    {
        $validated = $request->validate([
            'mariage_id' => 'required|exists:mariages,id',
            'etape' => 'required|in:'.implode(',', array_keys(EtapeMariage::etapes())),
            'statut' => 'required|in:'.implode(',', array_keys(EtapeMariage::statuts())),
            'date_debut' => 'nullable|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'responsable_id' => 'nullable|exists:fonctionnaires,id',
            'commentaires' => 'nullable|string',
        ]);

        $validated['updated_by'] = Auth::id();

        $etapeMariage->update($validated);

        return redirect()->route('etapes-mariage.index')->with('success', 'Étape mise à jour avec succès.');
    }

    public function destroy(EtapeMariage $etapeMariage)
    {
        $etapeMariage->delete();

        return redirect()->route('etapes-mariage.index')->with('success', 'Étape supprimée avec succès.');
    }
}