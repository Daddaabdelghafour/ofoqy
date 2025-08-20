<?php
// filepath: c:\Users\fadwa\Herd\ofoqy\app\Http\Controllers\ProfileController.php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\TestPersonnalite;
use App\Models\Student;
use App\Models\Metier;
use App\Models\Filiere;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class FilieresMetiersController extends Controller
{
    public function FilieresMetiers()
    {
        // Check if student is authenticated
        if (!Auth::guard('student')->check()) {
            return redirect('/login');
        }
        
        $student = Auth::guard('student')->user();
        
        // Get their MBTI result if they have one
        $mbtiResult = TestPersonnalite::where('student_id', $student->id)->first();
        $allMetiers = Metier::select('id','nom', 'description','image_path')->orderBy('nom')->get();
        $metiers = $allMetiers->unique('nom')->values()->all();
        $allFilieres = Filiere::select('id','nom', 'description','image_path')->orderBy('nom')->get();
        $filieres = $allFilieres->unique('nom')->values()->all();
        
        // Add type to each metier
        $metiers = collect($metiers)->map(function($metier) {
            $metier['type'] = 'metier';
            return $metier;
        })->values()->all();

        // Add type to each filiere
        $filieres = collect($filieres)->map(function($filiere) {
            $filiere['type'] = 'filiere';
            return $filiere;
        })->values()->all();
        
        return Inertia::render('Dashboard/FilieresMetiers', [
            'student' => $student,
            'mbtiResult' => $mbtiResult,
            'metiers' => $metiers,
            'filieres' => $filieres
        ]);
    }

    public function searchFilieresMetiers(Request $request)
    {
        // Extract search parameters
        $search = $request->input('search');
        $secteur = $request->input('secteur');
        $mbti = $request->input('mbti');
        
        
        // Start with base queries
        $metiersQuery = Metier::select('metiers.id', 'metiers.nom', 'metiers.description', 'metiers.image_path');
        $filieresQuery = Filiere::select('filieres.id', 'filieres.nom', 'filieres.description', 'filieres.image_path');
        
        // Apply name search if provided
        if (!empty($search)) {
            $metiersQuery->where('nom', 'LIKE', "%{$search}%");
            $filieresQuery->where('nom', 'LIKE', "%{$search}%");
        }
        
        // Apply secteur search - look for keyword in name or description
        if (!empty($secteur)) {
            $metiersQuery->where(function($query) use ($secteur) {
                $query->where('nom', 'LIKE', "%{$secteur}%")
                      ->orWhere('description', 'LIKE', "%{$secteur}%");
            });
            
            $filieresQuery->where(function($query) use ($secteur) {
                $query->where('nom', 'LIKE', "%{$secteur}%")
                      ->orWhere('description', 'LIKE', "%{$secteur}%");
            });
        }
        
        // Apply MBTI filtering using the correspondance table
        if (!empty($mbti)) {
            $metiersQuery->join('correspondances_mbti_metiers', 'metiers.id', '=', 'correspondances_mbti_metiers.metier_id')
                         ->where('correspondances_mbti_metiers.type_mbti', $mbti)

                         ->distinct();
                         
            // Instead, we can try to find filieres that lead to matched metiers
            $matchedMetierIds = DB::table('correspondances_mbti_metiers')
                                  ->where('type_mbti', $mbti)
                                  ->pluck('metier_id');
                                  
            $relatedFiliereIds = DB::table('filiere_metier')
                                   ->whereIn('metier_id', $matchedMetierIds)
                                   ->pluck('filiere_id');
                                   
            $filieresQuery->whereIn('id', $relatedFiliereIds);
        }
        
        // Execute the queries
        $metiers = $metiersQuery->get()->unique('nom')->values();
        $filieres = $filieresQuery->get()->unique('nom')->values();
        
        // Prepare the combined results - each with a type indicator
        $results = [];
        
        foreach ($metiers as $metier) {
            $results[] = [
                'id' => $metier->id,
                'nom' => $metier->nom,
                'description' => $metier->description,
                'image_path' => $metier->image_path ?? null, // Metiers might not have images
                'type' => 'metier'
            ];
        }
        
        foreach ($filieres as $filiere) {
            $results[] = [
                'id' => $filiere->id,
                'nom' => $filiere->nom,
                'description' => $filiere->description,
                'image_path' => $filiere->image_path ?? null,
                'type' => 'filiere'
            ];
        }
        
        return response()->json($results);
    }
}