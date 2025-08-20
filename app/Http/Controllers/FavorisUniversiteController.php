<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FavorisUniversiteController extends Controller
{
    public function list()
    {
        $student = Auth::guard('student')->user();
        Log::info("Fetching favorite universities for student: " . $student->id);
        // Get favorite university IDs for this student
        $favoriteIds = \App\Models\FavorisRecommandationUniversite::where('student_id', $student->id)
            ->pluck('universite_id');

        // Fetch university objects
        $universities = \App\Models\Universite::whereIn('id', $favoriteIds)->get();

        return response()->json(['data' => $universities]);
    }




    public function store(Request $request)
    {

        $student = Auth::guard("student")->user();
        $universiteId = $request->input('universite_id');
        $isFavorite = $request->input('is_favorite');

        if ($isFavorite) {
            \App\Models\FavorisRecommandationUniversite::firstOrCreate([
                'student_id' => $student->id,
                'universite_id' => $universiteId,
                'date_favoris' => now(),
            ]);
        } else {
            \App\Models\FavorisRecommandationUniversite::where([
                'student_id' => $student->id,
                'universite_id' => $universiteId,
            ])->delete();
        }

        return response()->json(['success' => true]);

    }


    public function favoriteids()
    {
        Log::info("hello");
        $student = Auth::guard('student')->user();
        $favoriteIds = \App\Models\FavorisRecommandationUniversite::where('student_id', $student->id)
            ->pluck('universite_id')
            ->toArray();
        Log::info('Favorite IDs for student ' . $student->id . ': ' . implode(', ', $favoriteIds));

        return response()->json(['favorites' => $favoriteIds]);
    }


    public function isFavorite($id)
    {
        $student = Auth::guard('student')->user();
        $isFavorite = \App\Models\FavorisRecommandationUniversite::where('student_id', $student->id)
            ->where('universite_id', $id)
            ->exists();

        return response()->json(['is_favorite' => $isFavorite]);
    }

}
