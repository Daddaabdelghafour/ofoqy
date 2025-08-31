<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Universite;
use App\Models\Student;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard()
    {

        $universities = Universite::all();

        return Inertia::render('Admin/Dashboard', [
            'universities' => $universities
            
        ]);
    }
    public function editUniversite(Request $request)
    {
        $id = $request->input('id');
        $universite = Universite::find($id);
        if ($universite) {
            $fields = [
                'nom', 'universite_rattachement', 'type', 'annee_creation', 'accreditation', 'concours',
                'nombre_annees_etude', 'bac_obligatoire', 'localisation', 'site_web', 'seuils_admission',
                'etat_postulation', 'date_ouverture', 'date_fermeture', 'conditions_admission',
                'mission_objectifs', 'formations_proposees', 'deroulement_concours'
            ];
            foreach ($fields as $field) {
                if ($request->has($field)) {
                    if (in_array($field, ['accreditation', 'concours', 'bac_obligatoire'])) {
                        $universite->$field = $request->input($field) ? 1 : 0;
                    } elseif (in_array($field, ['seuils_admission', 'conditions_admission', 'formations_proposees', 'deroulement_concours'])) {
                        $universite->$field = $request->input($field) ? json_encode($request->input($field)) : null;
                    } else {
                        $universite->$field = $request->input($field);
                    }
                }
            }

            // Handle logo upload
            if ($request->hasFile('logo')) {
                $file = $request->file('logo');
                if ($file->getClientOriginalExtension() !== 'png') {
                    return response()->json(['success' => false, 'message' => 'Le logo doit être un fichier PNG.']);
                }
                $filename = $universite->id . '.png';
                $file->move(public_path('images/Schools'), $filename);
                $universite->logo = $filename;
            }

            $universite->save();
            return response()->json(['success' => true]);
        } else {
            return response()->json(['success' => false, 'message' => 'Université non trouvée.']);
        }
    }

    public function deleteUniversite(Request $request)
    {
        $id = $request->input('id');
        Universite::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }
    public function addUniversite(Request $request)
    {
        $data = $request->except('logo');

        // Ensure booleans are integers
        foreach (['accreditation', 'concours', 'bac_obligatoire'] as $boolField) {
            if (isset($data[$boolField])) {
                $data[$boolField] = $data[$boolField] ? 1 : 0;
            }
        }

        $universite = Universite::create($data);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            if ($file->getClientOriginalExtension() !== 'png') {
                return response()->json(['success' => false, 'message' => 'Le logo doit être un fichier PNG.']);
            }
            $filename = $universite->id . '.png';
            $file->move(public_path('images/Schools'), $filename);
            $universite->logo = $filename;
            $universite->save();
        }

        return response()->json(['success' => true]);
    }
}