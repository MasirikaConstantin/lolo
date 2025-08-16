<?php

namespace App\Http\Controllers;

use App\Models\DocumentMariage;
use App\Models\Mariage;
use App\Models\Fonctionnaire;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class DocumentMariageController extends Controller
{
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'type_document', 'livre']);

        $documents = DocumentMariage::with(['mariage', 'livrePar', 'createdBy'])
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('numero_document', 'like', '%'.$search.'%')
                    ->orWhereHas('mariage', function ($q) use ($search) {
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
            ->when($filters['type_document'] ?? null, function ($query, $type) {
                $query->where('type_document', $type);
            })
            ->when(isset($filters['livre']), function ($query) use ($filters) {
                $query->where('livre', $filters['livre']);
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('DocumentsMariage/Index', [
            'documents' => $documents,
            'filters' => $filters,
            'typesDocuments' => DocumentMariage::typesDocuments(),
        ]);
    }

    public function create()
    {
        return Inertia::render('DocumentsMariage/Create', [
            'mariages' => Mariage::with(['homme', 'femme'])->get(),
            'fonctionnaires' => Fonctionnaire::all(),
            'typesDocuments' => DocumentMariage::typesDocuments(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'mariage_id' => 'required|exists:mariages,id',
            'type_document' => 'required|in:'.implode(',', array_keys(DocumentMariage::typesDocuments())),
            'numero_document' => 'required|string|max:255|unique:document_mariages',
            'date_emission' => 'required|date',
            'date_expiration' => 'nullable|date|after:date_emission',
            'fichier' => 'nullable|file|max:2048',
            'livre' => 'boolean',
            'date_livraison' => 'nullable|date|required_if:livre,true',
            'livre_par' => 'nullable|exists:fonctionnaires,id|required_if:livre,true',
        ]);

        if ($request->hasFile('fichier')) {
            $validated['fichier'] = $request->file('fichier')->store('documents-mariage', 'public');
        }

        $validated['ref'] = Str::uuid();
        $validated['created_by'] = Auth::id();

        DocumentMariage::create($validated);

        return redirect()->route('documents-mariage.index')->with('success', 'Document enregistré avec succès.');
    }

    public function show(string $documentMariage)
    {
        return Inertia::render('DocumentsMariage/Show', [
            'document' => DocumentMariage::where('ref', $documentMariage)->first()->load(['mariage.homme', 'mariage.femme', 'livrePar', 'createdBy']),
        ]);
    }

    public function edit(DocumentMariage $documentMariage)
    {
        return Inertia::render('DocumentsMariage/Edit', [
            'document' => $documentMariage,
            'mariages' => Mariage::with(['homme', 'femme'])->get(),
            'fonctionnaires' => Fonctionnaire::all(),
            'typesDocuments' => DocumentMariage::typesDocuments(),
        ]);
    }

    public function update(Request $request, DocumentMariage $documentMariage)
    {
        $validated = $request->validate([
            'mariage_id' => 'required|exists:mariages,id',
            'type_document' => 'required|in:'.implode(',', array_keys(DocumentMariage::typesDocuments())),
            'numero_document' => 'required|string|max:255|unique:document_mariages,numero_document,'.$documentMariage->id,
            'date_emission' => 'required|date',
            'date_expiration' => 'nullable|date|after:date_emission',
            'fichier' => 'nullable|file|max:2048',
            'livre' => 'boolean',
            'date_livraison' => 'nullable|date|required_if:livre,true',
            'livre_par' => 'nullable|exists:fonctionnaires,id|required_if:livre,true',
        ]);

        if ($request->hasFile('fichier')) {
            if ($documentMariage->fichier) {
                Storage::disk('public')->delete($documentMariage->fichier);
            }
            $validated['fichier'] = $request->file('fichier')->store('documents-mariage', 'public');
        }

        $validated['updated_by'] = Auth::id();

        $documentMariage->update($validated);

        return redirect()->route('documents-mariage.index')->with('success', 'Document mis à jour avec succès.');
    }

    public function destroy(DocumentMariage $documentMariage)
    {
        if ($documentMariage->fichier) {
            Storage::disk('public')->delete($documentMariage->fichier);
        }

        $documentMariage->delete();

        return redirect()->route('documents-mariage.index')->with('success', 'Document supprimé avec succès.');
    }

    public function printCertificat(DocumentMariage $documentMariage)
    {
        $documentMariage->load(['mariage.homme', 'mariage.femme', 'mariage.officier']);
        
        return Inertia::render('DocumentsMariage/Print/Certificat', [
            'document' => $documentMariage,
        ]);
    }
}