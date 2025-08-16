<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Filiere;
use App\Models\Metier;
use App\Models\Universite;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class ImportFiliereMetierSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Read the JSON file using absolute path
        $filePath = storage_path('app/filieresmetiers.json');
        
        if (!file_exists($filePath)) {
            $this->command->error('JSON file not found at: ' . $filePath);
            return;
        }
        
        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);

        if (!$data || !isset($data['filieres'])) {
            $this->command->error('Invalid JSON structure or file not found');
            $this->command->info('JSON content preview: ' . substr($jsonContent, 0, 200));
            $this->command->info('JSON decode error: ' . json_last_error_msg());
            return;
        }

        $this->command->info('Starting import of filières and métiers...');

        // Keep track of unique métiers to avoid duplicates
        $uniqueMetiers = [];
        $filiereMetierRelations = [];

        // Start transaction
        DB::beginTransaction();

        try {
            foreach ($data['filieres'] as $filiereData) {
                $universite_id = $filiereData['universite_id'];
                
                // Check if université exists
                $universite = Universite::find($universite_id);
                if (!$universite) {
                    $this->command->warn("Université with ID {$universite_id} not found, skipping...");
                    continue;
                }

                // Create filière (each university can have its own)
                $filiere = Filiere::create([
                    'nom' => $filiereData['nom'],
                    'universite_id' => $universite_id,
                    'description' => $filiereData['description'],
                    'competences' => $filiereData['competences'],
                    'parcours_formation' => $filiereData['parcours_formation'],
                ]);

                $this->command->info("Filière '{$filiere->nom}' created/found for université {$universite->nom}");

                // Process métiers for this filière
                if (isset($filiereData['metiers']) && is_array($filiereData['metiers'])) {
                    foreach ($filiereData['metiers'] as $metierData) {
                        // Skip empty métiers or invalid entries
                        if (!isset($metierData['nom']) || empty(trim($metierData['nom'])) || 
                            !is_string($metierData['nom'])) {
                            $this->command->warn("Skipping invalid métier for filière {$filiere->nom}");
                            continue;
                        }

                        $metierNom = trim($metierData['nom']);
                        
                        // Create unique métier if not exists
                        if (!isset($uniqueMetiers[$metierNom])) {
                            $metier = Metier::firstOrCreate(
                                ['nom' => $metierNom],
                                ['description' => $metierData['description'] ?? '']
                            );
                            $uniqueMetiers[$metierNom] = $metier;
                            $this->command->info("Métier '{$metierNom}' created");
                        } else {
                            $metier = $uniqueMetiers[$metierNom];
                        }

                        // Store filière-métier relationship
                        $filiereMetierRelations[] = [
                            'filiere_id' => $filiere->id,
                            'metier_id' => $metier->id
                        ];

                        // Store université-métier relationship with salary
                        $salaire = $metierData['salaire_indicatif'] ?? null;
                        
                        // Check if this université-métier relationship already exists
                        $existingRelation = DB::table('universite_metier')
                            ->where('universite_id', $universite_id)
                            ->where('metier_id', $metier->id)
                            ->first();

                        if (!$existingRelation) {
                            DB::table('universite_metier')->insert([
                                'universite_id' => $universite_id,
                                'metier_id' => $metier->id,
                                'salaire_indicatif' => $salaire,
                                'created_at' => now(),
                                'updated_at' => now()
                            ]);
                            $this->command->info("Relation université-métier created: {$universite->nom} - {$metierNom}");
                        }
                    }
                }
            }

            // Bulk insert filière-métier relationships (avoid duplicates)
            $uniqueFiliereMetierRelations = collect($filiereMetierRelations)
                ->unique(function ($item) {
                    return $item['filiere_id'] . '-' . $item['metier_id'];
                })
                ->values()
                ->all();

            foreach ($uniqueFiliereMetierRelations as $relation) {
                // Check if relation already exists
                $exists = DB::table('filiere_metier')
                    ->where('filiere_id', $relation['filiere_id'])
                    ->where('metier_id', $relation['metier_id'])
                    ->exists();

                if (!$exists) {
                    DB::table('filiere_metier')->insert([
                        'filiere_id' => $relation['filiere_id'],
                        'metier_id' => $relation['metier_id'],
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }

            DB::commit();

            $this->command->info('✅ Import completed successfully!');
            $this->command->info('📊 Summary:');
            $this->command->info('- Unique métiers created: ' . count($uniqueMetiers));
            $this->command->info('- Filière-métier relations: ' . count($uniqueFiliereMetierRelations));
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('❌ Import failed: ' . $e->getMessage());
            throw $e;
        }
    }
}
