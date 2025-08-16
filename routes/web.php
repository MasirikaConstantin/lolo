<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\DocumentMariageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});


Route::middleware(['auth', 'verified', 'role:admin'])->group(function () {
    Route::resource('users', UserController::class);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('citoyens', \App\Http\Controllers\CitoyenController::class);
    Route::resource('fonctionnaires', \App\Http\Controllers\FonctionnaireController::class);
    Route::resource('mariages', \App\Http\Controllers\MariageController::class);
    Route::resource('paiements', \App\Http\Controllers\PaiementController::class);
    Route::resource('pieces-jointes', \App\Http\Controllers\PieceJointeController::class);
    Route::resource('etapes-mariage', \App\Http\Controllers\EtapeMariageController::class);
    Route::resource('documents-mariage', DocumentMariageController::class);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('documents-mariage/{documentMariage}/print/certificat', [DocumentMariageController::class, 'printCertificat'])
        ->name('documents-mariage.print.certificat');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
