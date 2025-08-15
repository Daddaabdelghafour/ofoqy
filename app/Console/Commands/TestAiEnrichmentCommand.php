<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Scrapping\Helpers\AiEnrichmentService;

class TestAiEnrichmentCommand extends Command
{
    protected $signature = 'ai:test {slug? : Slug de l\'école à tester}';
    protected $description = 'Teste l\'enrichissement AI des données d\'école';

    public function handle()
    {
        $slug = $this->argument('slug') ?? 'encg-casablanca';
        
        $this->info("Test enrichissement AI pour {$slug}");
        
        // Données simulées pour test
        $testData = [
            'nom' => strtoupper(explode('-', $slug)[0]) . ' ' . ucfirst(explode('-', $slug)[1]),
            'slug' => $slug,
            'localisation' => ucfirst(explode('-', $slug)[1]),
            'type' => str_contains($slug, 'encg') || str_contains($slug, 'ensa') ? 'publique' : 'privée',
            'conditions_admission' => 'Concours national d\'accès',
        ];
        
        $this->info("Données initiales:");
        $this->table(
            ['Champ', 'Valeur'],
            collect($testData)->map(function ($value, $key) {
                return [$key, is_array($value) ? json_encode($value) : $value];
            })
        );
        
        $aiService = new AiEnrichmentService();
        
        // Test concours detection
        $hasConcours = $aiService->determineHasConcours($testData);
        $this->info("Détection concours: " . ($hasConcours ? 'Oui' : 'Non'));
        
        // Test full enrichment
        $enrichedData = $aiService->enrichUniversityData($testData);
        
        $this->info("Données enrichies:");
        $this->table(
            ['Champ', 'Valeur'],
            collect($enrichedData)->map(function ($value, $key) {
                return [$key, is_array($value) ? json_encode($value) : $value];
            })
        );
        
        return 0;
    }
}