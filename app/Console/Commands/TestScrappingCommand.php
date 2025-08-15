<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\Scrapping\Sources\KraytiScrapper;
use App\Services\Scrapping\Helpers\ScrapingHelper;

class TestScrappingCommand extends Command
{
    protected $signature = 'scraping:test {--school=encg-casablanca : Slug de l\'école à tester} {--show-all : Afficher toutes les données extraites}';
    protected $description = 'Tester le scrapping d\'une école spécifique';

    public function handle()
    {
        $schoolSlug = $this->option('school');
        $showAll = $this->option('show-all');

        $this->info("🚀 Test du scrapper pour l'école: {$schoolSlug}");
        $this->line('');

        try {
            // Créer une instance du scrapper
            $scrapper = new KraytiScrapper();

            // Test avec une seule école
            $testUrl = "https://www.9rayti.com/ecole/{$schoolSlug}";

            $this->info("📡 Test de connexion à: {$testUrl}");

            // Test extraction d'une école spécifique
            $ecoleData = [
                'detail_url' => $testUrl,
                'slug' => $schoolSlug,
            ];

            // Extraire les détails
            $this->info("🔍 Extraction des données...");
            $extractedData = $scrapper->extractUniversityDetails($ecoleData);

            // Afficher les résultats
            if ($showAll) {
                $this->displayAllResults($extractedData);
            } else {
                $this->displayResults($extractedData);
            }

            // Test validation
            $this->info("✅ Test de validation...");
            $isValid = $scrapper->validateUniversityData($extractedData);

            if ($isValid) {
                $this->info("✅ Données valides !");

                // Afficher le mapping vers le modèle
                $this->displayModelMapping($scrapper, $extractedData);

                // Test sauvegarde (optionnel)
                if ($this->confirm('Voulez-vous sauvegarder cette école en base de données ?')) {
                    $saved = $scrapper->saveUniversity($extractedData);

                    if ($saved) {
                        $this->info("💾 École sauvegardée avec succès !");
                    } else {
                        $this->error("❌ Erreur lors de la sauvegarde");
                    }
                }
            } else {
                $this->error("❌ Données invalides");
                $this->displayValidationErrors($extractedData);
            }

        } catch (\Exception $e) {
            $this->error("❌ Erreur lors du test: " . $e->getMessage());
            $this->line("Stack trace: " . $e->getTraceAsString());
        }
    }

    private function displayResults(array $data)
    {
        $this->line('');
        $this->info("📋 RÉSULTATS D'EXTRACTION:");
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Données principales
        $this->line("🏫 <fg=yellow>Nom:</> " . ($data['nom'] ?? 'Non trouvé'));
        $this->line("📍 <fg=yellow>Localisation:</> " . ($data['localisation'] ?? 'Non trouvé'));
        $this->line("🏛️ <fg=yellow>Type:</> " . ($data['type'] ?? 'Non trouvé'));
        $this->line("🌐 <fg=yellow>Site web:</> " . ($data['site_web'] ?? 'Non trouvé'));
        $this->line("🎯 <fg=yellow>Concours:</> " . ($data['concours'] ? 'Oui' : 'Non'));

        // Formations
        if (!empty($data['formations_proposees'])) {
            $this->line("📚 <fg=yellow>Formations (" . count($data['formations_proposees']) . "):</>");
            foreach (array_slice($data['formations_proposees'], 0, 5) as $formation) {
                $this->line("   • " . $formation);
            }
            if (count($data['formations_proposees']) > 5) {
                $this->line("   ... et " . (count($data['formations_proposees']) - 5) . " autres");
            }
        }

        // Conditions admission
        if (!empty($data['conditions_admission'])) {
            $this->line("📋 <fg=yellow>Conditions:</> " . substr($data['conditions_admission'], 0, 100) . "...");
        }

        // Groupe parent
        if (!empty($data['groupe_parent'])) {
            $this->line("🏢 <fg=yellow>Groupe parent:</> " . $data['groupe_parent']);
        }

        // Seuils admission

        /*
        if (!empty($data['seuils_admission'])) {
            $this->line("📊 <fg=yellow>Seuils admission:</>");
            
            // Loop through years
            foreach ($data['seuils_admission'] as $year => $seuils) {
                $this->line("   📅 <fg=cyan>Année {$year}:</>");
                
                // Loop through seuils for this year
                if (is_array($seuils)) {
                    foreach ($seuils as $filiere => $seuil) {
                        $this->line("      • {$filiere}: {$seuil}");
                    }
                } else {
                    // Handle case where value isn't an array (shouldn't happen but safer)
                    $this->line("      • Erreur: format inattendu");
                }
            }
        }
            */

        // Score qualité
        if (isset($data['quality_score'])) {
            $score = $data['quality_score'];
            $color = $score >= 80 ? 'green' : ($score >= 60 ? 'yellow' : 'red');
            $this->line("⭐ <fg=yellow>Score qualité:</> <fg={$color}>{$score}/100</>");
        }

        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line('');
    }

    // Simple helper to display array data safely
    private function formatForDisplay($value)
    {
        if (is_array($value)) {
            return json_encode($value, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }
        return $value;
    }

    // Display a single data field with formatted output
    private function formatDataField(string $fieldName, $value): void
    {
        // Handle array values properly
        if (is_array($value)) {
            $this->line("{$fieldName}: [" . count($value) . " éléments]");
            
            // For seuils_admission, handle the nested array structure
            if ($fieldName === 'seuils_admission') {
                foreach ($value as $year => $yearData) {
                    $this->line("  📅 <fg=cyan>Année {$year}:</>");
                    
                    // Handle both array and non-array values for backward compatibility
                    if (is_array($yearData)) {
                        foreach ($yearData as $subject => $threshold) {
                            $this->line("    • {$subject}: {$threshold}");
                        }
                    } else {
                        $this->line("    • {$year}: {$yearData}");
                    }
                }
            }
            // For formations_proposees and other simple arrays
            else {
                $count = 0;
                foreach ($value as $item) {
                    // Show the first 5 items, then summarize
                    if ($count < 5) {
                        $this->line("  • " . (is_array($item) ? json_encode($item) : $item));
                        $count++;
                    } else {
                        $remaining = count($value) - 5;
                        if ($remaining > 0) {
                            $this->line("  ... et {$remaining} autres");
                        }
                        break;
                    }
                }
            }
        } 
        // Handle non-array values
        elseif (is_string($value)) {
            // For long text fields, truncate with ellipsis
            if (strlen($value) > 100) {
                $truncated = substr($value, 0, 100) . "...";
                $this->line("{$fieldName}: {$truncated}");
                $this->line("     (" . strlen($value) . " caractères)");
            } else {
                $this->line("{$fieldName}: {$value}");
            }
        }
        // Handle all other types (numbers, booleans, null)
        else {
            $this->line("{$fieldName}: " . var_export($value, true));
        }
    }

    private function displayAllResults(array $data)
    {
        $this->line('');
        $this->info("📋 TOUTES LES DONNÉES EXTRAITES:");
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        foreach ($data as $key => $value) {
            $this->formatDataField($key, $value);
        }

        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line('');
    }

    private function formatBytes(int $bytes): string
    {
        if ($bytes < 1024)
            return "{$bytes} caractères";
        return round($bytes / 1024, 1) . "KB";
    }

    private function displayModelMapping($scrapper, array $extractedData)
    {
        $this->line('');
        $this->info("🗂️ MAPPING VERS MODÈLE UNIVERSITE:");
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Utiliser la méthode privée via réflexion
        $reflection = new \ReflectionClass($scrapper);
        $mapMethod = $reflection->getMethod('mapScrapedDataToModel');
        $mapMethod->setAccessible(true);

        $mappedData = $mapMethod->invoke($scrapper, $extractedData);

        foreach ($mappedData as $field => $value) {
            $this->formatDataField($field, $value);
        }

        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line('');
    }

    private function displayValidationErrors(array $data)
    {
        $this->line('');
        $this->error("❌ ERREURS DE VALIDATION:");
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        $requiredFields = ['nom', 'localisation', 'type'];

        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                $this->line("  • <fg=red>Champ manquant:</> {$field}");
            }
        }

        if (!empty($data['type']) && !in_array($data['type'], ['publique', 'privée'])) {
            $this->line("  • <fg=red>Type invalide:</> " . $data['type']);
        }

        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line('');
    }
}