<?php
// filepath: app/Services/Scrapping/Sources/BaseScrapper.php

namespace App\Services\Scrapping\Sources;

use App\Services\Scrapping\Helpers\ScrapingHelper;
use App\Exceptions\ScrappingException;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;

abstract class BaseScrapper
{
    // TODO: Propriétés communes
    protected string $baseUrl;
    protected array $config;
    protected int $universitiesScraped = 0;
    protected array $errors = [];

    // TODO: Méthodes abstraites (à implémenter par chaque site)
    abstract public function getUniversityListPages(): array;
    abstract public function extractUniversitiesFromPage(string $html): array;
    abstract public function extractUniversityDetails(array $universityData): array;

    // TODO: Méthodes communes (implémentées ici)



    public function scrapAllUniversities()
    {

        $startTime = microtime(true);
        $this->universitiesScraped = 0;
        $this->errors = [];
        $scrapedUniversities = [];

        ScrapingHelper::logScrapping('info', "Début Scraping", [$this->baseUrl]);


        try {
            $pages = $this->getUniversityListPages();

            foreach ($pages as $pageUrl) {
                try {
                    $universitiesOnPage = $this->extractUniversitiesFromPage($pageUrl);

                    foreach ($universitiesOnPage as $universityData) {
                        try {
                            $universityDetails = $this->extractUniversityDetails($universityData);
                            if ($this->validateUniversityData($universityDetails)) {
                                $scrapedUniversities[] = $universityDetails;
                                $this->universitiesScraped++;
                            } else {
                                $this->errors[] = "Données Invalides" . ($universityDetails['nom'] ?? 'Inconnu');
                            }
                        } catch (\Exception $e) {
                            $this->errors[] = "Erreur Université" . $e->getMessage();
                        }


                    }


                } catch (\Exception $e) {
                    $this->errors[] = "Erreur page {$pageUrl}: " . $e->getMessage();

                }


            }


        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('error', "Erreur générale: " . $e->getMessage());
            throw new ScrappingException("Échec scrapping: " . $e->getMessage(), 0, $e);
        }

        $duration = round(microtime(true) - $startTime, 2);

        ScrapingHelper::logScrapping(
            'info',
            "Scrapping terminé: {$this->universitiesScraped} universités en {$duration}s"
        );

        return [
            'source' => $this->baseUrl,
            'universities_scraped' => $this->universitiesScraped,
            'errors_count' => count($this->errors),
            'errors' => $this->errors,
            'duration_seconds' => $duration,
            'scraped_data' => $scrapedUniversities
        ];


    }


    public function validateUniversityData(array $data): bool
    {
        // Champs obligatoires
        if (empty($data['nom']) || empty($data['localisation'])) {
            return false;
        }

        // Nettoyage avec ScrapingHelper
        $data['nom'] = ScrapingHelper::cleanUniversityName($data['nom']);
        $data['localisation'] = ScrapingHelper::normalizeLocation($data['localisation']);

        // Validation URL si présente
        if (!empty($data['site_web'])) {
            $data['site_web'] = ScrapingHelper::validateAndCleanUrl($data['site_web']);
        }

        return true;
    }




}