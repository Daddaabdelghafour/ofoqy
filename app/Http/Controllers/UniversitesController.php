<?php
// filepath: c:\Users\dadda\Herd\ofoqy\app\Http\Controllers\UniversitesController.php

namespace App\Http\Controllers;

use App\Models\Universite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class UniversitesController extends Controller
{
    /**
     * Get a list of all universities
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Universite::query();

            // Filter by type (public/private)
            if ($request->has('type') && !empty($request->type)) {
                if ($request->type === 'publique') {
                    $query->publique();
                } elseif ($request->type === 'privee' || $request->type === 'privée') {
                    $query->privee();
                }
            }

            // Filter by name
            if ($request->has('nom') && !empty($request->nom)) {
                $query->where('nom', 'like', '%' . $request->nom . '%');
            }

            // Filter by ville/localisation (same thing)
            if ($request->has('ville') && !empty($request->ville)) {
                $query->where('localisation', 'like', '%' . $request->ville . '%');
            } else if ($request->has('localisation') && !empty($request->localisation)) {
                $query->where('localisation', 'like', '%' . $request->localisation . '%');
            }

            // Filter by with/without concours
            if ($request->has('concours') && $request->concours === 'true') {
                $query->withConcours();
            }

            // Filter by open for applications
            if ($request->has('ouvert') && $request->ouvert === 'true') {
                $query->ouverte();
            }

            // Filter by filiere
            if ($request->has('filiere') && !empty($request->filiere)) {
                $query->whereHas('filieres', function ($q) use ($request) {
                    $q->where('nom', 'like', '%' . $request->filiere . '%');
                });
            }

            // Filter by branche
            if ($request->has('branche') && !empty($request->branche)) {
                // We need to filter universities based on which ones have a threshold for this branch
                $branchCode = $request->branche;
                $query->whereRaw('JSON_CONTAINS_PATH(seuils_admission, "one", "$.*.' . $branchCode . '")');
            }

            // Filter by minimum threshold (seuil)
            if ($request->has('seuil') && !empty($request->seuil)) {
                $minSeuil = (float) $request->seuil;


                // We'll need to get all universities first and then filter them
                $query->where(function ($q) use ($minSeuil) {
                    $q->whereRaw("1 = 1"); // Placeholder to be filtered post-query
                });
            }

            // General search
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', '%' . $search . '%')
                        ->orWhere('localisation', 'like', '%' . $search . '%');
                });
            }

            // Execute the main query 
            $baseQuery = clone $query;

            // For the threshold filter, we need to do post-processing
            if ($request->has('seuil') && !empty($request->seuil)) {
                $minSeuil = (float) $request->seuil;
                $allUniversities = $baseQuery->get();

                // Filter universities where at least one program has a threshold >= the minimum
                $filteredIds = $allUniversities->filter(function ($universite) use ($minSeuil) {
                    // Check all years and all programs for this threshold
                    foreach ($universite->seuils_admission as $year => $branches) {
                        foreach ($branches as $branch => $seuil) {
                            if ((float) $seuil >= $minSeuil) {
                                return true;
                            }
                        }
                    }
                    return false;
                })->pluck('id')->toArray();

                $query->whereIn('id', $filteredIds);
            }

            // Apply pagination
            $perPage = $request->get('per_page', 6);
            $universities = $query->paginate($perPage);

            return response()->json([
                'data' => $universities->items(),
                'pagination' => [
                    'total' => $universities->total(),
                    'per_page' => $universities->perPage(),
                    'current_page' => $universities->currentPage(),
                    'last_page' => $universities->lastPage(),
                    'from' => $universities->firstItem(),
                    'to' => $universities->lastItem(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Une erreur est survenue lors de la récupération des universités',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get details for a specific university
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show($id): JsonResponse
    {
        try {
            $university = Universite::findOrFail($id);

            return response()->json($university);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'université non trouvée',
                'message' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Get university statistics
     *
     * @return JsonResponse
     */
    public function statistics(): JsonResponse
    {
        try {
            $stats = [
                'total' => Universite::count(),
                'by_type' => [
                    'publique' => Universite::publique()->count(),
                    'privée' => Universite::privee()->count(),
                ],
                'by_location' => Universite::select('localisation', DB::raw('count(*) as total'))
                    ->groupBy('localisation')
                    ->orderBy('total', 'desc')
                    ->limit(10)
                    ->get(),
                'with_concours' => Universite::withConcours()->count(),
                'without_concours' => Universite::where('concours', false)->count(),
                'open_for_application' => Universite::ouverte()->count(),
            ];

            return response()->json($stats);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Une erreur est survenue lors de la récupération des statistiques',
                'message' => $e->getMessage()
            ], 500);
        }
    }



    public function export()
    {
        $universites = \App\Models\Universite::with(['filieres', 'metiers'])->get();

        // Structure for sample correctly formatted university
        $sampleUniversity = [
            "id" => 1,
            "nom" => "École Nationale Supérieure d'Informatique et d'Analyse des Systèmes",
            "type" => "Public",
            "localisation" => "Rabat, Rabat-Salé-Kénitra",
            "site_web" => "https://ensias.um5.ac.ma/",
            "date_creation" => "1992",
            "universite_rattachement" => "Université Mohammed V de Rabat",
            "acreditations" => ["ABET", "EUR-ACE"],
            "nombre_annees_etudes" => 3,
            "bac_obligatoire" => true,
            "concours" => "Concours National Commun (CNC)",
            "seuils_admission" => [
                "2023" => [
                    "Sciences Mathématiques A" => "16.75",
                    "Sciences Mathématiques B" => "17.20"
                ],
                "2022" => [
                    "Sciences Mathématiques A" => "16.50",
                    "Sciences Mathématiques B" => "17.00"
                ]
            ],
            "formations_proposees" => [
                "Génie Logiciel",
                "Intelligence Artificielle",
                "Sécurité des Systèmes d'Information"
            ],
            "missions" => "Former des ingénieurs hautement qualifiés dans les domaines de l'informatique et des systèmes d'information",
            "conditions_admission" => [
                "Être titulaire d'un baccalauréat scientifique",
                "Avoir une moyenne générale supérieure à 15/20",
                "Réussir le concours national commun"
            ],
            "deroulement_concours" => [
                [
                    "etape" => "Présélection sur dossier",
                    "description" => "Étude des relevés de notes du baccalauréat et des années préparatoires."
                ],
                [
                    "etape" => "Épreuves écrites",
                    "description" => "Épreuves de mathématiques, physique, informatique et langues."
                ]
            ],
            "date_postulation" => "15/06/2025"
        ];

        // Add metadata and instructions for ChatGPT
        $exportData = [
            "metadata" => [
                "version" => "1.0",
                "exported_at" => now()->format('Y-m-d H:i:s'),
                "total_records" => count($universites),
                "purpose" => "Data enrichment via ChatGPT",
                "model_compatibility" => "Designed for Ofoqy University system"
            ],
            "instructions_for_chatgpt" => [
                "task" => "Search for missing information and correct existing data for Moroccan universities",
                "data_format" => "Return a complete JSON array following exactly the same structure as provided",
                "search_instructions" => [
                    "Use university websites, education ministry pages, and reputable education portals for Morocco",
                    "Focus on official information from .ma domains when possible",
                    "For each university with missing data, search for its official name + the specific missing field",
                    "Verify information from multiple sources when possible",
                    "For threshold scores (seuils_admission), use the most recent available data",
                    "When information cannot be found after thorough search, leave as null rather than inventing data"
                ],
                "data_structure_requirements" => [
                    "Maintain the exact same JSON structure for each university",
                    "Preserve all original IDs exactly as provided",
                    "For empty arrays, use [] not null",
                    "For empty objects, use {} not null",
                    "Ensure all string values are properly quoted",
                    "Format dates consistently as DD/MM/YYYY",
                    "Format threshold scores as strings, not numbers (e.g., \"16.75\" not 16.75)",
                    "Ensure all JSON is valid and properly formatted"
                ],
                "field_requirements" => [
                    "nom" => "Full official name of the university (string)",
                    "type" => "Should be 'Public' or 'Private' (string)",
                    "localisation" => "City name, and region if available (string)",
                    "site_web" => "Official website URL starting with http:// or https:// (string or null)",
                    "date_creation" => "Year of establishment (string or null)",
                    "universite_rattachement" => "Parent university if applicable (string or null)",
                    "acreditations" => "Array of accreditation names (array of strings or null)",
                    "nombre_annees_etudes" => "Integer number of years (integer or null)",
                    "bac_obligatoire" => "Boolean - true if baccalaureate is required (boolean)",
                    "concours" => "Name of entrance exam if applicable (string or null)",
                    "seuils_admission" => "Object with years as keys, containing objects with majors and threshold scores (object)",
                    "formations_proposees" => "Array of programs/majors offered (array of strings or null)",
                    "missions" => "University mission statement (string or null)",
                    "conditions_admission" => "Array of admission requirements (array of strings or null)",
                    "deroulement_concours" => "Array of objects with 'etape' and 'description' fields (array of objects or null)",
                    "date_postulation" => "Application deadline in DD/MM/YYYY format (string or null)"
                ],
                "example_correctly_formatted_university" => $sampleUniversity,
                "response_format" => "Return a JSON array containing all universities with updated information, keeping exactly the same structure for each record",
                "prioritize" => "Focus on completing missing information (null values) first, then correcting inaccurate data",
                "common_moroccan_bac_types" => [
                    "Sciences Mathématiques A",
                    "Sciences Mathématiques B",
                    "Sciences Physiques",
                    "Sciences de la Vie et de la Terre",
                    "Sciences Économiques",
                    "Sciences et Technologies Électriques",
                    "Sciences et Technologies Mécaniques",
                    "Lettres et Sciences Humaines"
                ]
            ],
            "universities" => $universites
        ];

        $fileName = 'universites_export_' . date('Y-m-d_H-i-s') . '.json';

        return response()->json($exportData, 200, [
            'Content-Type' => 'application/json',
            'Content-Disposition' => 'attachment; filename="' . $fileName . '"'
        ]);
    }
    /**
     * Get universities with admission thresholds for a specific bac type
     * 
     * @param Request $request
     * @return JsonResponse
     */



    public function import(Request $request)
    {
        try {
            $data = $request->all();

            foreach ($data as $universityData) {
                \App\Models\Universite::updateOrCreate(
                    ['id' => $universityData['id']],
                    [
                        'nom' => $universityData['nom'],
                        'type' => $universityData['type'],
                        'localisation' => $universityData['localisation'],
                        'site_web' => $universityData['site_web'],
                        'date_creation' => $universityData['date_creation'],
                        'universite_rattachement' => $universityData['universite_rattachement'],
                        'acreditations' => json_encode($universityData['acreditations']),
                        'nombre_annees_etudes' => $universityData['nombre_annees_etudes'],
                        'bac_obligatoire' => $universityData['bac_obligatoire'],
                        'concours' => $universityData['concours'],
                        'seuils_admission' => json_encode($universityData['seuils_admission']),
                        'formations_proposees' => json_encode($universityData['formations_proposees']),
                        'missions' => $universityData['missions'],
                        'conditions_admission' => json_encode($universityData['conditions_admission']),
                        'deroulement_concours' => json_encode($universityData['deroulement_concours']),
                        'date_postulation' => $universityData['date_postulation'],
                    ]
                );
            }

            return response()->json(['message' => 'Universités importées avec succès', 'count' => count($data)]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }



    public function findByBacType(Request $request): JsonResponse
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'type_bac' => 'required|string',
                'moyenne' => 'numeric|min:0|max:20',
            ]);

            $typeBac = $validated['type_bac'];
            $moyenne = $validated['moyenne'] ?? null;

            // We need to find universities where the threshold for this bac type is defined
            $universities = Universite::all()->filter(function ($universite) use ($typeBac, $moyenne) {
                $seuil = $universite->getSeuilForBacType($typeBac);

                if ($seuil === null) {
                    return false;
                }

                if ($moyenne !== null) {
                    return $moyenne >= $seuil;
                }

                return true;
            })->values();

            return response()->json($universities);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Une erreur est survenue',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}