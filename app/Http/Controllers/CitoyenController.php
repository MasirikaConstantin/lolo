<?php

namespace App\Http\Controllers;

use App\Models\Citoyen;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class CitoyenController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search']);

        $citoyens = Citoyen::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('nom', 'like', '%'.$search.'%')
                        ->orWhere('postnom', 'like', '%'.$search.'%')
                        ->orWhere('prenom', 'like', '%'.$search.'%')
                        ->orWhere('numero_identification_national', 'like', '%'.$search.'%');
                });
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Citoyens/Index', [
            'citoyens' => $citoyens,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        return Inertia::render('Citoyens/Create');
    }

    public function store(Request $request)
    {
        ini_set('memory_limit', '256M');
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'postnom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'sexe' => 'required|in:M,F',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string|max:255',
            'etat_civil' => 'required|in:Célibataire,Marié(e),Divorcé(e),Veuf/Veuve',
            'profession' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'nom_pere' => 'required|string|max:255',
            'nom_mere' => 'required|string|max:255',
            'numero_identification_national' => 'nullable|string|max:255|unique:citoyens',
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('citoyens/photos', 'public');
        }

        $validated['ref'] = Str::uuid();
        $validated['created_by'] = Auth::id();

        Citoyen::create($validated);

        return redirect()->route('citoyens.index')->with('success', 'Citoyen créé avec succès.');
    }

    public function show(string $citoyen)
    {
        return Inertia::render('Citoyens/Show', [
            'citoyen' => Citoyen::where('ref', $citoyen)->first()->load(['createdBy', 'updatedBy']),
        ]);
    }

    public function edit(string $citoyen)
    {
        return Inertia::render('Citoyens/Edit', [
            'citoyen' => Citoyen::where('ref', $citoyen)->first()->load(['createdBy', 'updatedBy']),
        ]);
    }

    public function update(Request $request, string $citoyen)
    {
        $citoyen = Citoyen::where('ref', $citoyen)->first();
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'postnom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'sexe' => 'required|in:M,F',
            'date_naissance' => 'required|date',
            'lieu_naissance' => 'required|string|max:255',
            'etat_civil' => 'required|in:Célibataire,Marié(e),Divorcé(e),Veuf/Veuve',
            'profession' => 'required|string|max:255',
            'adresse' => 'required|string|max:255',
            'nom_pere' => 'required|string|max:255',
            'nom_mere' => 'required|string|max:255',
            'numero_identification_national' => 'nullable|string|max:255|unique:citoyens,numero_identification_national,'.$citoyen->id,
            'photo' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('photo')) {
            if ($citoyen->photo) {
                Storage::disk('public')->delete($citoyen->photo);
            }
            $validated['photo'] = $request->file('photo')->store('citoyens/photos', 'public');
        }

        $validated['updated_by'] = Auth::id();

        $citoyen->update($validated);

        return redirect()->route('citoyens.index')->with('success', 'Citoyen mis à jour avec succès.');
    }

    public function destroy(string $citoyen)
    {
        $citoyen = Citoyen::where('ref', $citoyen)->first();
        if ($citoyen->photo) {
            Storage::disk('public')->delete($citoyen->photo);
        }

        $citoyen->delete();

        return redirect()->route('citoyens.index')->with('success', 'Citoyen supprimé avec succès.');
    }
}