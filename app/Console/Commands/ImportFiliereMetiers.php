<?php

namespace App\Console\Commands;

use App\Models\Universite;
use App\Models\Filiere;
use App\Models\Metier;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class ImportFiliereMetiers extends Command
{
    protected $signature = 'import:filiere-metiers {file} {--dry-run}';
    protected $description = 'Import filières and métiers from JSON file';

    public function handle()
    {
        $filePath = $this->argument('file');
        
        if (!file_exists($filePath)) {
            $this->error("❌ File not found: {$filePath}");
            return 1;
        }
        
        $this->info('📥 Reading JSON file...');
        $jsonContent = file_get_contents($filePath);
        $data = json_decode($jsonContent, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->error("❌ Invalid JSON: " . json_last_error_msg());
            return 1;
        }
        
        if (!isset($data['filieres']) || !is_array($data['filieres'])) {
            $this->error("❌ Invalid format: 'filieres' array not found");
            return 1;
        }
        
        $this->info("📊 Found " . count($data['filieres']) . " filières in file");
        
        if ($this->option('dry-run')) {
            $this->info("🔍 DRY RUN MODE - No changes will be made");
        }
        
        $created = ['filieres' => 0, 'metiers' => 0];
        $errors = [];
        
        DB::beginTransaction();
        
        try {
            foreach ($data['filieres'] as $filiereData) {
                $result = $this->processFiliere($filiereData, $this->option('dry-run'));
                $created['filieres'] += $result['filieres'];
                $created['metiers'] += $result['metiers'];
                
                if (!empty($result['errors'])) {
                    $errors = array_merge($errors, $result['errors']);
                }
            }
            
            if ($this->option('dry-run')) {
                DB::rollBack();
                $this->info("🔍 DRY RUN COMPLETED");
            } else {
                DB::commit();
                $this->info("✅ IMPORT COMPLETED");
            }
            
            $this->info("📈 Created: {$created['filieres']} filières, {$created['metiers']} métiers");
            
            if (!empty($errors)) {
                $this->warn("⚠️ Errors encountered:");
                foreach ($errors as $error) {
                    $this->line("  - {$error}");
                }
            }
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error("❌ Import failed: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
    
    private function processFiliere($filiereData, $dryRun = false)
    {
        $result = ['filieres' => 0, 'metiers' => 0, 'errors' => []];
        
        // Check if universite_id exists
        if (!isset($filiereData['universite_id'])) {
            $result['errors'][] = "Missing universite_id for filière: " . ($filiereData['nom'] ?? 'Unknown');
            return $result;
        }
        
        // Find university
        $universite = Universite::find($filiereData['universite_id']);
        if (!$universite) {
            $result['errors'][] = "University not found for ID: " . $filiereData['universite_id'];
            return $result;
        }
        
        $this->line("🏫 Processing filière: {$filiereData['nom']} for {$universite->nom}");
        
        try {
            if (!$dryRun) {
                // Create filière - convert strings to JSON for database
                $filiere = Filiere::create([
                    'nom' => $filiereData['nom'] ?? '',
                    'description' => $filiereData['description'] ?? '',
                    'competences' => $filiereData['competences'] ?? '',
                    'parcours_formation' => $filiereData['parcours_formation'] ?? '',
                    'universite_id' => $filiereData['universite_id'],
                ]);
                
                $result['filieres']++;
                
                // Create métiers with proper validation
                if (isset($filiereData['metiers']) && is_array($filiereData['metiers'])) {
                    foreach ($filiereData['metiers'] as $metierData) {
                        // Skip métiers that only have universite_id (incomplete data)
                        if (!isset($metierData['nom']) || empty($metierData['nom'])) {
                            $this->warn("    ⚠️ Skipping incomplete métier (missing nom)");
                            continue;
                        }
                        
                        Metier::create([
                            'nom' => $metierData['nom'],
                            'salaire_indicatif' => $metierData['salaire_indicatif'] ?? null,
                            'description' => $metierData['description'] ?? '',
                            'universite_id' => $metierData['universite_id'] ?? $filiereData['universite_id'],
                        ]);
                        
                        $result['metiers']++;
                        $this->line("    💼 Created métier: {$metierData['nom']}");
                    }
                }
            } else {
                // Dry run - just count valid entries
                $result['filieres']++;
                if (isset($filiereData['metiers']) && is_array($filiereData['metiers'])) {
                    foreach ($filiereData['metiers'] as $metierData) {
                        if (isset($metierData['nom']) && !empty($metierData['nom'])) {
                            $result['metiers']++;
                        }
                    }
                }
            }
            
            $this->line("  ✅ Filière: " . ($filiereData['nom'] ?? 'Unknown'));
            
        } catch (\Exception $e) {
            $result['errors'][] = "Failed to create filière '{$filiereData['nom']}': " . $e->getMessage();
        }
        
        return $result;
    }
}
