<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Metier;
use App\Models\Filiere;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class FilieresMetiersComponentController extends Controller
{
    public function Showcomponent($id, $type)
    {
        $student = Auth::guard('student')->user();
        $universiteNames = [];

        if ($type === 'metier') {
            $element = Metier::find($id);
        } else if ($type === 'filiere') {
            $element = Filiere::find($id);

            if ($element) {
                // Find all filieres with the same name
                $filieres = Filiere::where('nom', $element->nom)->get();

                // Collect all university names for these filieres
                $universiteNames = $filieres->map(function($filiere) {
                    $uni = \App\Models\Universite::find($filiere->universite_id);
                    return $uni ? $uni->nom : null;
                })->filter()->unique()->values()->all();
            }
        }

        return Inertia::render('Dashboard/FilieresMetiersComponent', [
            'student' => $student,
            'element' => $element,
            'type' => $type,
            'universiteNames' => $universiteNames
        ]);

    }
}
?>