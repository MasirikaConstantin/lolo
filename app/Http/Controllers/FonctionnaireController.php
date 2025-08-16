<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFonctionnaireRequest;
use App\Http\Requests\UpdateFonctionnaireRequest;
use App\Models\Fonctionnaire;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;

class FonctionnaireController extends Controller
{
    public function index(Request $request)
    {
        $fonctionnaires = Fonctionnaire::query()
            ->with(['user', 'createdBy', 'updatedBy'])
            ->when($request->input('search'), function ($query, $search) {
                $query->where('nom', 'like', "%{$search}%")
                    ->orWhere('postnom', 'like', "%{$search}%")
                    ->orWhere('prenom', 'like', "%{$search}%")
                    ->orWhere('matricule', 'like', "%{$search}%");
            })
            ->paginate(10)
            ->withQueryString()
            ->through(fn ($fonctionnaire) => [
                'id' => $fonctionnaire->id,
                'ref' => $fonctionnaire->ref,
                'nom_complet' => $fonctionnaire->nom . ' ' . $fonctionnaire->postnom . ' ' . $fonctionnaire->prenom,
                'matricule' => $fonctionnaire->matricule,
                'fonction' => $fonctionnaire->fonction,
                'grade' => $fonctionnaire->grade,
                'email' => $fonctionnaire->email,
                'telephone' => $fonctionnaire->telephone,
                'date_embauche' => $fonctionnaire->date_embauche,
                'created_at' => $fonctionnaire->created_at,
                'created_by' => $fonctionnaire->createdBy?->name,
            ]);

        return Inertia::render('Fonctionnaires/Index', [
            'fonctionnaires' => $fonctionnaires,
            'filters' => $request->only(['search']),
        ]);
    }

    public function create()
{
    $users = User::whereDoesntHave('fonctionnaire')
        ->select('id', 'name', 'email')
        ->get();

    return Inertia::render('Fonctionnaires/Create', [
        'fonctions' => ['Maire', 'Officier d\'état civil', 'Secrétaire', 'Agent administratif', 'Autre'],
        'users' => $users,
    ]);
}


    public function store(StoreFonctionnaireRequest $request)
    {
        // Créer l'utilisateur associé
        $user = User::create([
            'name' => $request->nom . ' ' . $request->postnom,
            'email' => $request->email,
            'password' => Hash::make('password'), // Mot de passe par défaut
            'role' => 'fonctionnaire',
        ]);

        // Créer le fonctionnaire
        Fonctionnaire::create([
            'nom' => $request->nom,
            'postnom' => $request->postnom,
            'prenom' => $request->prenom,
            'fonction' => $request->fonction,
            'grade' => $request->grade,
            'matricule' => $request->matricule,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'date_embauche' => $request->date_embauche,
            'photo' => $request->photo,
            'user_id' => $user->id,
        ]);

        return redirect()->route('fonctionnaires.index')->with('success', 'Fonctionnaire créé avec succès.');
    }

    public function show(string $ref)
    {
        $fonctionnaire = Fonctionnaire::where('ref', $ref)->first();

        return Inertia::render('Fonctionnaires/Show', [
            'fonctionnaire' => [
                'id' => $fonctionnaire->id,
                'ref' => $fonctionnaire->ref,
                'nom' => $fonctionnaire->nom,
                'postnom' => $fonctionnaire->postnom,
                'prenom' => $fonctionnaire->prenom,
                'fonction' => $fonctionnaire->fonction,
                'grade' => $fonctionnaire->grade,
                'matricule' => $fonctionnaire->matricule,
                'email' => $fonctionnaire->email,
                'telephone' => $fonctionnaire->telephone,
                'date_embauche' => $fonctionnaire->date_embauche,
                'photo' => $fonctionnaire->photo,
                'created_at' => $fonctionnaire->created_at,
                'updated_at' => $fonctionnaire->updated_at,
                'created_by' => $fonctionnaire->createdBy?->name,
                'updated_by' => $fonctionnaire->updatedBy?->name,
            ],
        ]);
    }

    public function edit(string $ref)
    {
        $fonctionnaire = Fonctionnaire::where('ref', $ref)->first();

        return Inertia::render('Fonctionnaires/Edit', [
            'fonctionnaire' => [
                'id' => $fonctionnaire->id,
                'ref' => $fonctionnaire->ref,
                'nom' => $fonctionnaire->nom,
                'postnom' => $fonctionnaire->postnom,
                'prenom' => $fonctionnaire->prenom,
                'fonction' => $fonctionnaire->fonction,
                'grade' => $fonctionnaire->grade,
                'matricule' => $fonctionnaire->matricule,
                'email' => $fonctionnaire->email,
                'telephone' => $fonctionnaire->telephone,
                'date_embauche' => $fonctionnaire->date_embauche,
                'photo' => $fonctionnaire->photo,
            ],
            'fonctions' => ['Maire', 'Officier d\'état civil', 'Secrétaire', 'Agent administratif', 'Autre'],
        ]);
    }

    public function update(UpdateFonctionnaireRequest $request, Fonctionnaire $fonctionnaire)
    {
        $fonctionnaire->update([
            'nom' => $request->nom,
            'postnom' => $request->postnom,
            'prenom' => $request->prenom,
            'fonction' => $request->fonction,
            'grade' => $request->grade,
            'matricule' => $request->matricule,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'date_embauche' => $request->date_embauche,
            'photo' => $request->photo,
        ]);

        // Mettre à jour l'utilisateur associé
        if ($fonctionnaire->user) {
            $fonctionnaire->user->update([
                'name' => $request->nom . ' ' . $request->postnom,
                'email' => $request->email,
            ]);
        }

        return redirect()->route('fonctionnaires.index')->with('success', 'Fonctionnaire mis à jour avec succès.');
    }

    public function destroy(Fonctionnaire $fonctionnaire)
    {
        // Supprimer l'utilisateur associé
        if ($fonctionnaire->user) {
            $fonctionnaire->user->delete();
        }

        $fonctionnaire->delete();

        return redirect()->route('fonctionnaires.index')->with('success', 'Fonctionnaire supprimé avec succès.');
    }
}