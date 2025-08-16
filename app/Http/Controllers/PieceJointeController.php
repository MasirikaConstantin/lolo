<?php

namespace App\Http\Controllers;

use App\Models\PieceJointe;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class PieceJointeController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'type_piece']);

        $piecesJointes = PieceJointe::with(['attachable', 'createdBy'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('numero_piece', 'like', '%'.$search.'%')
                    ->orWhereHasMorph('attachable', ['App\Models\Citoyen', 'App\Models\Mariage'], function ($query, $type) use ($search) {
                        if ($type === 'App\Models\Citoyen') {
                            $query->where(function($q) use ($search) {
                                $q->where('nom', 'like', '%'.$search.'%')
                                    ->orWhere('postnom', 'like', '%'.$search.'%')
                                    ->orWhere('prenom', 'like', '%'.$search.'%');
                            });
                        } else if ($type === 'App\Models\Mariage') {
                            $query->whereHas('homme', function($q) use ($search) {
                                $q->where('nom', 'like', '%'.$search.'%')
                                    ->orWhere('prenom', 'like', '%'.$search.'%');
                            })->orWhereHas('femme', function($q) use ($search) {
                                $q->where('nom', 'like', '%'.$search.'%')
                                    ->orWhere('prenom', 'like', '%'.$search.'%');
                            });
                        }
                    });
            })
            ->when($filters['type_piece'] ?? null, function ($query, $type) {
                $query->where('type_piece', $type);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('PiecesJointes/Index', [
            'piecesJointes' => $piecesJointes,
            'filters' => $filters,
            'typesPieces' => PieceJointe::typesPieces(),
        ]);
    }

    public function create(Request $request)
    {
        $attachableType = $request->query('attachable_type');
        $attachableId = $request->query('attachable_id');

        return Inertia::render('PiecesJointes/Create', [
            'attachableType' => $attachableType,
            'attachableId' => $attachableId,
            'typesPieces' => PieceJointe::typesPieces(),
        ]);
    }

    public function store(Request $request)
    {
        try{
            $validated = $request->validate([
                'attachable_type' => 'required|string|in:App\Models\Citoyen,App\Models\Mariage',
                'attachable_id' => 'required|integer',
                'type_piece' => 'required|in:'.implode(',', array_keys(PieceJointe::typesPieces())),
                'numero_piece' => 'required|string|max:255',
                'fichier' => 'required|file|max:2048',
                'date_emission' => 'required|date',
                'date_expiration' => 'nullable|date|after:date_emission',
            ]);
        }catch(\Exception $e){
            dd($e->getMessage());
            return redirect()->back()->with('error', 'Une erreur est survenue lors de l\'enregistrement.');
        }

        $validated['fichier'] = $request->file('fichier')->store('pieces-jointes', 'public');
        $validated['ref'] = Str::uuid();
        $validated['created_by'] = Auth::id();

        PieceJointe::create($validated);

        return redirect()->back()->with('success', 'Pièce jointe enregistrée avec succès.');
    }

    public function show(PieceJointe $pieceJointe)
    {
        return Inertia::render('PiecesJointes/Show', [
            'pieceJointe' => $pieceJointe->load(['attachable', 'createdBy', 'updatedBy']),
        ]);
    }

    public function edit(PieceJointe $pieceJointe)
    {
        return Inertia::render('PiecesJointes/Edit', [
            'pieceJointe' => $pieceJointe,
            'typesPieces' => PieceJointe::typesPieces(),
        ]);
    }

    public function update(Request $request, PieceJointe $pieceJointe)
    {
        $validated = $request->validate([
            'type_piece' => 'required|in:'.implode(',', array_keys(PieceJointe::typesPieces())),
            'numero_piece' => 'required|string|max:255',
            'fichier' => 'nullable|file|max:2048',
            'date_emission' => 'required|date',
            'date_expiration' => 'nullable|date|after:date_emission',
        ]);

        if ($request->hasFile('fichier')) {
            if ($pieceJointe->fichier) {
                Storage::disk('public')->delete($pieceJointe->fichier);
            }
            $validated['fichier'] = $request->file('fichier')->store('pieces-jointes', 'public');
        }

        $validated['updated_by'] = Auth::id();

        $pieceJointe->update($validated);

        return redirect()->route('pieces-jointes.index')->with('success', 'Pièce jointe mise à jour avec succès.');
    }

    public function destroy(PieceJointe $pieceJointe)
    {
        if ($pieceJointe->fichier) {
            Storage::disk('public')->delete($pieceJointe->fichier);
        }

        $pieceJointe->delete();

        return redirect()->route('pieces-jointes.index')->with('success', 'Pièce jointe supprimée avec succès.');
    }
}