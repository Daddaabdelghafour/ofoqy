<?php


namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use App\Services\Scrapping\Sources\KraytiScrapper;
use App\Services\Scrapping\Helpers\ScrapingHelper;

class ScrapeAllSchoolsCommand extends Command
{
    protected $signature = 'scraping:all 
                            {--force : Force rescraping des écoles déjà existantes}
                            {--batch=all : Traiter un lot spécifique (all, public, private)}
                            {--delay=2 : Délai entre chaque requête (secondes)}
                            {--limit=0 : Limiter le nombre d\'écoles à scraper (0 = toutes)}';

    protected $description = 'Scraper toutes les écoles définies dans la configuration et les ajouter à la base de données';

    private $scrapper;
    private $stats = [
        'total' => 0,
        'success' => 0,
        'failed' => 0,
        'skipped' => 0,
    ];

    public function handle()
    {
        $this->scrapper = new KraytiScrapper();
        $force = $this->option('force');
        $batch = $this->option('batch');
        $delay = (int) $this->option('delay');
        $limit = (int) $this->option('limit');

        // Récupérer la liste des écoles depuis la configuration
        $schools = Config::get('scrapping.ecoles_to_scrape', []);

        if (empty($schools)) {
            $this->error("❌ Aucune école définie dans la configuration.");
            return 1;
        }

        // Filtrer les écoles si un batch spécifique est demandé
        if ($batch !== 'all') {
            $this->info("🔍 Filtrage des écoles de type: {$batch}");
            $filteredSchools = [];

            foreach ($schools as $slug) {
                // Déterminer le type à partir du slug
                $isPublic = $this->isPublicSchool($slug);
                $matchesFilter = ($batch === 'public' && $isPublic) || ($batch === 'private' && !$isPublic);

                if ($matchesFilter) {
                    $filteredSchools[] = $slug;
                }
            }

            $schools = $filteredSchools;

            if (empty($schools)) {
                $this->error("❌ Aucune école trouvée pour le type: {$batch}");
                return 1;
            }
        }

        // Appliquer la limite si définie
        if ($limit > 0 && $limit < count($schools)) {
            $this->info("⚙️ Limitation à {$limit} écoles");
            $schools = array_slice($schools, 0, $limit);
        }

        $this->stats['total'] = count($schools);

        $this->line("");
        $this->line("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
        $this->line("┃ <fg=bright-blue;options=bold>             SCRAPING DE TOUTES LES ÉCOLES ({$this->stats['total']})                </> ┃");
        $this->line("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");
        $this->line("");

        $progress = $this->output->createProgressBar($this->stats['total']);
        $progress->setFormat(' %current%/%max% [%bar%] %percent:3s%% | %message%');
        $progress->setMessage('Initialisation...');
        $progress->start();

        foreach ($schools as $index => $slug) {
            // Message de progression
            $progress->setMessage("<fg=cyan>🔍 Traitement de {$slug}...</>");

            try {
                // Préparer les données d'entrée
                $schoolData = [
                    'detail_url' => "https://www.9rayti.com/ecole/{$slug}",
                    'slug' => $slug,
                ];

                // Extraire les détails
                $extractedData = $this->scrapper->extractUniversityDetails($schoolData);

                // Valider les données
                $isValid = $this->scrapper->validateUniversityData($extractedData);

                if (!$isValid) {
                    $this->stats['failed']++;
                    $progress->setMessage("<fg=red>❌ Données invalides pour {$slug}</>");
                    $progress->advance();
                    continue;
                }

                // Sauvegarder dans la base de données
                $saved = $this->scrapper->saveUniversity($extractedData);

                if ($saved) {
                    $this->stats['success']++;
                    $progress->setMessage("<fg=green>✅ {$extractedData['nom']} sauvegardée</>");
                } else {
                    $this->stats['failed']++;
                    $progress->setMessage("<fg=red>❌ Échec sauvegarde de {$slug}</>");
                }

            } catch (\Exception $e) {
                $this->stats['failed']++;
                $progress->setMessage("<fg=red>❌ Erreur: " . substr($e->getMessage(), 0, 50) . "...</>");
                ScrapingHelper::logScrapping('error', "Erreur traitement {$slug}: " . $e->getMessage());
            }

            $progress->advance();

            // Pause entre les requêtes pour éviter de surcharger le serveur
            if ($index < $this->stats['total'] - 1 && $delay > 0) {
                sleep($delay);
            }
        }

        $progress->finish();
        $this->line("\n");

        // Afficher les statistiques
        $this->displayStats();

        return 0;
    }

    /**
     * Détermine si une école est publique en fonction de son slug
     */
    private function isPublicSchool($slug)
    {
        $publicPrefixes = ['encg', 'ensa', 'ensem', 'enim', 'ehtp', 'est', 'fsjes', 'fs'];

        foreach ($publicPrefixes as $prefix) {
            if (strpos($slug, $prefix) === 0) {
                return true;
            }
        }

        return false;
    }

    /**
     * Affiche les statistiques de fin de traitement
     */
    private function displayStats()
    {
        $this->line("");
        $this->line("┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓");
        $this->line("┃ <fg=bright-green;options=bold>                       RÉSULTATS DU SCRAPING                        </> ┃");
        $this->line("┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┫");
        $this->line("┃ 📊 <fg=bright-yellow;options=bold>Total écoles:</> " . str_pad($this->stats['total'], 52) . " ┃");
        $this->line("┃ ✅ <fg=bright-green;options=bold>Réussites:</> " . str_pad($this->stats['success'], 55) . " ┃");
        $this->line("┃ ❌ <fg=bright-red;options=bold>Échecs:</> " . str_pad($this->stats['failed'], 58) . " ┃");
        $this->line("┃ ⏩ <fg=bright-yellow;options=bold>Ignorées:</> " . str_pad($this->stats['skipped'], 56) . " ┃");

        // Calculer le taux de réussite
        $successRate = $this->stats['total'] > 0
            ? round(($this->stats['success'] / $this->stats['total']) * 100, 1)
            : 0;

        $rateColor = $successRate >= 80 ? 'bright-green' : ($successRate >= 50 ? 'bright-yellow' : 'bright-red');
        $this->line("┃ 📈 <fg=bright-cyan;options=bold>Taux de réussite:</> <fg={$rateColor}>" . str_pad("{$successRate}%", 49) . "</> ┃");
        $this->line("┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛");
        $this->line("");
    }
}