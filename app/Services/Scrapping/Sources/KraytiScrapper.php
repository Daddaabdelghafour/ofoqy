<?php
// filepath: app/Services/Scrapping/Sources/KraytiScrapper.php

namespace App\Services\Scrapping\Sources;

use App\Services\Scrapping\Helpers\ScrapingHelper;
use App\Services\Scrapping\Sources\BaseScrapper;
use App\Models\Universite;
use App\Exceptions\ScrappingException;
use Illuminate\Support\Facades\Http;
use Symfony\Component\DomCrawler\Crawler;

use App\Services\Scrapping\Helpers\AiEnrichmentService;


class KraytiScrapper extends BaseScrapper
{
    protected string $baseUrl = 'https://www.9rayti.com';
    protected AiEnrichmentService $aiService;

    public function __construct()
    {
        $this->aiService = new AiEnrichmentService();
    }

    /**
     * ÉTAPE 1: Récupérer les URLs directes des écoles
     */
    public function getUniversityListPages(): array
    {
        ScrapingHelper::logScrapping('info', "Récupération liste écoles prédéfinies");

        $ecolesSlugs = config('scrapping.ecoles_to_scrape', []);

        $pages = [];
        foreach ($ecolesSlugs as $slug) {
            $pages[] = $this->baseUrl . '/ecole/' . $slug;
        }

        ScrapingHelper::logScrapping('info', "Total écoles à scraper: " . count($pages));
        return $pages;
    }

    /**
     * ÉTAPE 2: Préparation pour extraction directe
     */
    public function extractUniversitiesFromPage(string $ecoleUrl): array
    {
        return [
            [
                'detail_url' => $ecoleUrl,
                'slug' => $this->extractSlugFromUrl($ecoleUrl),
            ]
        ];
    }

    /**
     * ÉTAPE 3: Extraction complète d'une école - VERSION CORRIGÉE
     */
    public function extractUniversityDetails(array $ecoleBasicData): array
    {
        $detailUrl = $ecoleBasicData['detail_url'];
        $slug = $ecoleBasicData['slug'];

        ScrapingHelper::logScrapping('info', "Extraction école: {$detailUrl}");

        try {
            $html = $this->makeHttpRequest($detailUrl);
            $crawler = new Crawler($html);

            // EXTRACTION AMÉLIORÉE DES DONNÉES PRINCIPALES
            $nom = $this->extractEcoleName($crawler);
            $localisation = $this->extractEcoleLocation($crawler);
            $typeRaw = $this->extractTextSafely($crawler, '.school-type, .type, .etablissement-type, .category');

            // Si le nom est toujours vide, essayer depuis le slug
            if (empty($nom)) {
                $nom = $this->generateNameFromSlug($slug);
            }

            // Si la localisation est toujours vide, essayer depuis le slug
            if (empty($localisation)) {
                $localisation = $this->extractLocationFromSlug($slug);
            }

            // Validation nom obligatoire
            if (empty($nom) || strlen($nom) < 5) {
                throw new \Exception("Nom d'école invalide ou trop court: '{$nom}'");
            }

            // Nettoyer avec ScrapingHelper
            $nom = ScrapingHelper::cleanUniversityName($nom);
            $localisation = ScrapingHelper::normalizeLocation($localisation);
            $type = $this->normalizeEcoleType($typeRaw, $slug);

            // CONSTRUIRE DONNÉES DE BASE
            $ecoleData = [
                'nom' => $nom,
                'localisation' => $localisation,
                'type' => $type,
                'slug' => $slug,
                'source_url' => $detailUrl,
            ];

            // Extraction formations DEPUIS LA MÊME PAGE
            $formations = $this->extractFormations($crawler);
            if (!empty($formations)) {
                $ecoleData['formations_proposees'] = $formations;
            }

            // Extraction conditions admission
            $conditions = $this->extractTextSafely($crawler, '.admission, .conditions, .prerequis, .admission-info');
            if (!empty($conditions)) {
                $ecoleData['conditions_admission'] = strip_tags($conditions);
            }

            // Détection concours
            $pageText = $crawler->text();
            $ecoleData['concours'] = $this->aiService->determineHasConcours($ecoleData);
            ScrapingHelper::logScrapping('info', "🤖 Détection concours intelligente: " . ($ecoleData['concours'] ? 'Oui' : 'Non'));

            // Extraction site web
            $siteWeb = $this->extractWebsite($crawler);
            if ($siteWeb) {
                $ecoleData['site_web'] = $siteWeb;
            }

            // DEBUG: Recherche groupe parent avec logs détaillés
            ScrapingHelper::logScrapping('debug', "🔍 === DEBUG GROUPE PARENT pour {$slug} ===");

            $groupeSlugFromHtml = $this->extractGroupeSlug($crawler);
            $groupeSlugFromSlug = $this->extractGroupeFromSlug($slug);

            ScrapingHelper::logScrapping('debug', "  - Groupe depuis HTML: " . ($groupeSlugFromHtml ?? 'null'));
            ScrapingHelper::logScrapping('debug', "  - Groupe depuis slug: " . ($groupeSlugFromSlug ?? 'null'));

            // FORCER l'utilisation du slug au lieu du HTML pour éviter les conflits
            $groupeSlug = $groupeSlugFromSlug ?? $groupeSlugFromHtml;
            ScrapingHelper::logScrapping('debug', "  - Groupe final choisi: " . ($groupeSlug ?? 'null'));

            if ($groupeSlug) {
                $ecoleData['groupe_parent'] = $groupeSlug;
                ScrapingHelper::logScrapping('info', "✅ Groupe parent assigné: {$groupeSlug}");

                // Enrichissement avec données groupe (SEULEMENT seuils et concours)
                if (config('scrapping.processing.scrape_groupe_details', true)) {
                    ScrapingHelper::logScrapping('debug', "📊 Extraction données groupe: {$groupeSlug}");
                    $groupeData = $this->extractGroupeDetails($groupeSlug);

                    // MERGE sans écraser les formations déjà extraites
                    foreach ($groupeData as $key => $value) {
                        if ($key !== 'formations_proposees' || empty($ecoleData['formations_proposees'])) {
                            $ecoleData[$key] = $value;
                            ScrapingHelper::logScrapping('debug', "  - Ajouté: {$key}");
                        }
                    }
                }
            } else {
                ScrapingHelper::logScrapping('warning', "❌ Aucun groupe parent trouvé pour: {$slug}");
            }

            // DEBUG: Calcul université de rattachement
            ScrapingHelper::logScrapping('debug', "🏛️ === DEBUG UNIVERSITÉ DE RATTACHEMENT ===");
            $rattachement = $this->determineUniversiteRattachement($ecoleData);
            ScrapingHelper::logScrapping('debug', "  - Données pour calcul:");
            ScrapingHelper::logScrapping('debug', "    * slug: {$slug}");
            ScrapingHelper::logScrapping('debug', "    * groupe_parent: " . ($ecoleData['groupe_parent'] ?? 'null'));
            ScrapingHelper::logScrapping('debug', "  - Rattachement calculé: " . ($rattachement ?? 'null'));

            if (config('services.openrouter.enabled', true)) {
                ScrapingHelper::logScrapping('info', "🤖 Enrichissement IA des données...");
                $ecoleData = $this->aiService->enrichUniversityData($ecoleData);


            } // End of AI enrichment block

            // Calcul score qualité
            $ecoleData['quality_score'] = ScrapingHelper::calculateQualityScore($ecoleData);

            ScrapingHelper::logScrapping('info', "🎓 École extraite: {$nom} à {$localisation} → {$rattachement}");
            ScrapingHelper::logScrapping('debug', "🔍 === FIN DEBUG EXTRACTION ===");

            return $ecoleData;

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('error', "❌ Erreur extraction {$detailUrl}: " . $e->getMessage());
            throw new ScrappingException("Échec extraction école: " . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Sauvegarder université dans la base de données
     */
    public function saveUniversity(array $data): bool
    {
        try {
            $universiteData = $this->mapScrapedDataToModel($data);

            // Vérifier doublons
            $existingUniversite = Universite::where('nom', $universiteData['nom'])
                ->where('localisation', $universiteData['localisation'])
                ->first();

            if ($existingUniversite) {
                $existingUniversite->update($universiteData);
                ScrapingHelper::logScrapping('info', "Université mise à jour: {$universiteData['nom']}");
            } else {
                Universite::create($universiteData);
                ScrapingHelper::logScrapping('info', "Nouvelle université créée: {$universiteData['nom']}");
            }

            return true;

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('error', "Erreur sauvegarde: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Valider données d'université
     */
    public function validateUniversityData(array $data): bool
    {
        $requiredFields = ['nom', 'localisation', 'type'];

        foreach ($requiredFields as $field) {
            if (empty($data[$field])) {
                ScrapingHelper::logScrapping('debug', "Champ requis manquant: {$field}");
                return false;
            }
        }

        if (!in_array($data['type'], ['publique', 'privée'])) {
            ScrapingHelper::logScrapping('debug', "Type invalide: {$data['type']}");
            return false;
        }

        return true;
    }

    // =============================================================================
    // MÉTHODES HELPER PRIVÉES AMÉLIORÉES
    // =============================================================================

    private function makeHttpRequest(string $url): string
    {
        $config = config('scrapping.sources.9rayti', [
            'headers' => [
                'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language' => 'fr-FR,fr;q=0.9,en;q=0.8',
                'Accept-Encoding' => 'gzip, deflate, br',
                'Connection' => 'keep-alive',
            ],
            'timeout' => 30,
            'retry_attempts' => 3,
            'retry_delay' => 3,
        ]);

        try {
            $response = Http::withHeaders($config['headers'] ?? [])
                ->timeout($config['timeout'] ?? 30)
                ->retry($config['retry_attempts'] ?? 3, ($config['retry_delay'] ?? 3) * 1000)
                ->get($url);

            if ($response->successful()) {
                return $response->body();
            } else {
                throw new \Exception("HTTP {$response->status()}: {$url}");
            }

        } catch (\Exception $e) {
            throw new ScrappingException("Erreur HTTP {$url}: " . $e->getMessage(), 0, $e);
        }
    }

    private function extractTextSafely(Crawler $crawler, string $selector): string
    {
        try {
            // Essayer plusieurs sélecteurs séparés par des virgules
            $selectors = explode(',', $selector);

            foreach ($selectors as $singleSelector) {
                $singleSelector = trim($singleSelector);
                $elements = $crawler->filter($singleSelector);

                if ($elements->count() > 0) {
                    $text = trim($elements->first()->text());
                    if (!empty($text)) {
                        return $text;
                    }
                }
            }

            return '';

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('debug', "Erreur extraction '{$selector}': " . $e->getMessage());
            return '';
        }
    }

    private function extractEcoleName(Crawler $crawler): string
    {
        // Utiliser les sélecteurs de config pour le nom
        $selectors = config('scrapping.9rayti_config.selectors.ecole_name', [
            'h1.page-title',
            'h1.entry-title',
            'h1.title',
            '.page-header h1',
            '.entry-header h1',
            '.school-title',
            '.etablissement-nom',
            '.main-title',
            'h1',
            'title'
        ]);

        foreach ($selectors as $selector) {
            try {
                $elements = $crawler->filter($selector);
                if ($elements->count() > 0) {
                    $text = trim($elements->first()->text());
                    $text = $this->cleanEcoleName($text);

                    if (strlen($text) > 5) {
                        return $text;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return '';
    }

    private function cleanEcoleName(string $name): string
    {
        // Utiliser les règles de nettoyage de config
        $name = trim(strip_tags($name));

        $removePrefixes = config('scrapping.9rayti_config.cleaning_rules.remove_prefixes', [
            'École',
            'Ecole',
            'Institut',
            'Institute',
            'Université',
            'University'
        ]);

        foreach ($removePrefixes as $prefix) {
            $name = preg_replace('/^' . preg_quote($prefix) . '\s*/i', '', $name);
        }

        $removeSuffixes = config('scrapping.9rayti_config.cleaning_rules.remove_suffixes', [
            '- 9rayti.com',
            '| 9rayti.com',
            '9rayti.com'
        ]);

        foreach ($removeSuffixes as $suffix) {
            $name = preg_replace('/\s*' . preg_quote($suffix) . '$/i', '', $name);
        }

        return trim($name);
    }

    private function extractEcoleLocation(Crawler $crawler): string
    {
        // Utiliser les sélecteurs de config pour la localisation
        $selectors = config('scrapping.9rayti_config.selectors.ecole_location', [
            '.school-location',
            '.etablissement-ville',
            '.location-info',
            '.ville',
            '.city',
            '.address .locality',
            '.location',
            '.localisation'
        ]);

        foreach ($selectors as $selector) {
            try {
                $elements = $crawler->filter($selector);
                if ($elements->count() > 0) {
                    $text = trim($elements->first()->text());
                    $text = $this->cleanLocation($text);

                    if (!empty($text)) {
                        return $text;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return $this->extractLocationFromSchoolName($crawler);
    }

    private function extractLocationFromSchoolName(Crawler $crawler): string
    {
        $name = $this->extractTextSafely($crawler, 'h1, title');

        $cities = config('scrapping.9rayti_config.data_mapping.location_mapping', [
            'Casablanca' => 'Casablanca',
            'Rabat' => 'Rabat',
            'Fès' => 'Fès',
            'Marrakech' => 'Marrakech',
            'Agadir' => 'Agadir',
            'Tanger' => 'Tanger',
            'Oujda' => 'Oujda',
            'Kénitra' => 'Kénitra',
            'Meknès' => 'Meknès',
            'Settat' => 'Settat',
            'Berrechid' => 'Berrechid',
            'Safi' => 'Safi',
            'Tétouan' => 'Tétouan',
            'Dakhla' => 'Dakhla',
            'El Jadida' => 'El Jadida',
        ]);

        foreach ($cities as $city => $normalized) {
            if (stripos($name, $city) !== false) {
                return $normalized;
            }
        }

        return '';
    }

    private function cleanLocation(string $location): string
    {
        $location = trim(strip_tags($location));

        $mapping = config('scrapping.9rayti_config.data_mapping.location_mapping', [
            'Casa' => 'Casablanca',
            'Casablanca' => 'Casablanca',
            'Rabat' => 'Rabat',
            'Fès' => 'Fès',
            'Fez' => 'Fès',
            'Marrakech' => 'Marrakech',
            'Marrakesh' => 'Marrakech',
        ]);

        foreach ($mapping as $pattern => $normalized) {
            if (stripos($location, $pattern) !== false) {
                return $normalized;
            }
        }

        return $location;
    }

    private function generateNameFromSlug(string $slug): string
    {
        $parts = explode('-', $slug);

        if (count($parts) >= 2) {
            $prefix = strtoupper($parts[0]);
            $city = ucfirst($parts[1]);

            $groupeMapping = config('scrapping.9rayti_config.data_mapping.groupes_ecoles', [
                'ENCG' => 'École Nationale de Commerce et de Gestion',
                'ENSA' => 'École Nationale des Sciences Appliquées',
                'ENSEM' => 'École Nationale Supérieure d\'Électricité et de Mécanique',
                'ENIM' => 'École Nationale d\'Industrie Minérale',
                'EHTP' => 'École Hassania des Travaux Publics',
                'HEM' => 'HEM Business School',
                'ISCAE' => 'Institut Supérieur de Commerce et d\'Administration des Entreprises',
                'EMINES' => 'École des Mines de Rabat',
            ]);

            if (isset($groupeMapping[$prefix])) {
                return $groupeMapping[$prefix] . ' - ' . $city;
            }

            return $prefix . ' ' . $city;
        }

        return ucwords(str_replace('-', ' ', $slug));
    }

    private function extractLocationFromSlug(string $slug): string
    {
        $parts = explode('-', $slug);

        if (count($parts) >= 2) {
            $city = ucfirst($parts[1]);

            $mapping = config('scrapping.9rayti_config.data_mapping.location_mapping', [
                'casablanca' => 'Casablanca',
                'rabat' => 'Rabat',
                'fes' => 'Fès',
                'marrakech' => 'Marrakech',
            ]);

            $cityLower = strtolower($city);
            return $mapping[$cityLower] ?? $city;
        }

        return '';
    }

    private function normalizeEcoleType(string $type, string $slug): string
    {
        if (empty($type)) {
            if (str_contains($slug, 'encg') || str_contains($slug, 'ensa') || str_contains($slug, 'ensem')) {
                return 'publique';
            }

            if (str_contains($slug, 'hem') || str_contains($slug, 'iscae') || str_contains($slug, 'universiapolis')) {
                return 'privée';
            }
        }

        $type = strtolower(trim($type));

        $typeMapping = config('scrapping.9rayti_config.data_mapping.ecole_types', []);

        foreach ($typeMapping as $pattern => $normalized) {
            if (str_contains($type, strtolower($pattern))) {
                return $normalized;
            }
        }

        if (str_contains($type, 'privé') || str_contains($type, 'private')) {
            return 'privée';
        }

        return 'publique';
    }


    private function extractFormations(Crawler $crawler): array
    {
        $formations = [];

        // Utiliser les nouveaux sélecteurs avec priorité <ol>
        $selectors = config('scrapping.9rayti_config.selectors.formations_list', [
            // Structure confirmée avec <ol>
            '.desc-content ol li',
            '.desc-content div ol li',
            'div.desc-content ol li',
            '.desc-content > div > ol > li',

            // Fallbacks avec <ul>
            '.desc-content ul li',
            '.desc-content div ul li',
            'div.desc-content ul li',

            // Fallbacks génériques
            '.formations-list li',
            'ol.formations li',
            'ul.formations li',
            '.content ol li',
            '.content ul li'
        ]);

        foreach ($selectors as $selector) {
            try {
                $elements = $crawler->filter($selector);
                if ($elements->count() > 0) {
                    ScrapingHelper::logScrapping('debug', "Formations trouvées avec sélecteur: {$selector} ({$elements->count()} éléments)");

                    $elements->each(function (Crawler $element) use (&$formations) {
                        $formation = trim($element->text());

                        // Nettoyer et valider la formation
                        $formation = $this->cleanFormationText($formation);

                        if ($this->isValidFormation($formation) && !in_array($formation, $formations)) {
                            $formations[] = $formation;
                        }
                    });

                    // Si on a trouvé des formations avec ce sélecteur, on s'arrête
                    if (!empty($formations)) {
                        ScrapingHelper::logScrapping('info', "Formations extraites: " . count($formations) . " avec sélecteur: {$selector}");
                        break;
                    }
                }
            } catch (\Exception $e) {
                ScrapingHelper::logScrapping('debug', "Erreur sélecteur '{$selector}': " . $e->getMessage());
                continue;
            }
        }

        // Log final
        if (empty($formations)) {
            ScrapingHelper::logScrapping('warning', "Aucune formation trouvée avec tous les sélecteurs");

            // Debug: afficher la structure HTML pour analyse
            $this->debugHtmlStructure($crawler);
        } else {
            ScrapingHelper::logScrapping('info', "Total formations extraites: " . count($formations));
        }

        return $formations;
    }

    /**
     * Nettoyer le texte d'une formation
     */
    private function cleanFormationText(string $formation): string
    {
        // Supprimer tags HTML résiduels
        $formation = strip_tags($formation);

        // Supprimer espaces multiples
        $formation = preg_replace('/\s+/', ' ', $formation);

        // Supprimer caractères spéciaux en début/fin
        $formation = trim($formation, " \t\n\r\0\x0B•-*");

        // Supprimer préfixes courants
        $prefixesToRemove = [
            'Formation en',
            'Diplôme de',
            'Diplôme en',
            'Master en',
            'Licence en',
            '→', // Flèches
            '•', // Puces
            '-', // Tirets
        ];

        foreach ($prefixesToRemove as $prefix) {
            if (stripos($formation, $prefix) === 0) {
                $formation = trim(substr($formation, strlen($prefix)));
            }
        }

        return trim($formation);
    }

    /**
     * Valider si c'est une formation valide
     */
    private function isValidFormation(string $formation): bool
    {
        // Longueur minimale
        if (strlen($formation) < 3) {
            return false;
        }

        // Longueur maximale
        if (strlen($formation) > 100) {
            return false;
        }

        // Éviter les textes génériques
        $invalidTexts = [
            'formations',
            'programmes',
            'voir plus',
            'lire la suite',
            'en savoir plus',
            'découvrir',
            'plus d\'infos',
            'détails',
            'formation',
            'programme',
            'cursus',
            'filière',
            'spécialité'
        ];

        $formationLower = strtolower($formation);
        foreach ($invalidTexts as $invalid) {
            if ($formationLower === $invalid) {
                return false;
            }
        }

        // Éviter les textes trop courts ou vides
        if (preg_match('/^[^a-zA-Z]*$/', $formation)) {
            return false;
        }

        return true;
    }

    /**
     * Debug de la structure HTML pour analyse
     */
    private function debugHtmlStructure(Crawler $crawler): void
    {
        try {
            // Chercher des divs avec "desc" dans la classe
            $descDivs = $crawler->filter('div[class*="desc"]');
            if ($descDivs->count() > 0) {
                ScrapingHelper::logScrapping('debug', "Divs avec 'desc' trouvées: " . $descDivs->count());

                $descDivs->each(function (Crawler $div, $i) {
                    $class = $div->attr('class') ?? 'no-class';
                    $innerHtml = substr($div->html(), 0, 200);
                    ScrapingHelper::logScrapping('debug', "Div {$i}: class='{$class}', content: " . $innerHtml);
                });
            }

            // Chercher toutes les listes
            $allLists = $crawler->filter('ul, ol');
            if ($allLists->count() > 0) {
                ScrapingHelper::logScrapping('debug', "Listes trouvées: " . $allLists->count());

                $allLists->each(function (Crawler $list, $i) {
                    $items = $list->filter('li');
                    $parentClass = $list->closest('div')->attr('class') ?? 'no-parent-class';
                    ScrapingHelper::logScrapping('debug', "Liste {$i}: {$items->count()} items, parent class: '{$parentClass}'");
                });
            }

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('debug', "Erreur debug HTML: " . $e->getMessage());
        }
    }

    private function extractWebsite(Crawler $crawler): ?string
    {
        // Utiliser les sélecteurs améliorés de config
        $selectors = config('scrapping.9rayti_config.selectors.website_link', [
            '.site-web a[href^="http"]:not([href*="9rayti.com"])',
            '.website a[href^="http"]:not([href*="9rayti.com"])',
            '.contact a[href^="http"]:not([href*="9rayti.com"])',
            'a[href*="www."]:not([href*="9rayti.com"]):not([href*="actualite"])',
        ]);

        foreach ($selectors as $selector) {
            try {
                $element = $crawler->filter($selector)->first();
                if ($element->count() > 0) {
                    $url = $element->attr('href');

                    $blockedDomains = config('scrapping.9rayti_config.validation_rules.blocked_domains', [
                        '9rayti.com',
                        'facebook.com',
                        'instagram.com',
                        'twitter.com'
                    ]);

                    $isBlocked = false;
                    foreach ($blockedDomains as $domain) {
                        if (str_contains($url, $domain)) {
                            $isBlocked = true;
                            break;
                        }
                    }

                    if (!$isBlocked) {
                        $cleanUrl = ScrapingHelper::validateAndCleanUrl($url);
                        if ($cleanUrl) {
                            return $cleanUrl;
                        }
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }

        return null;
    }

    private function extractGroupeSlug(Crawler $crawler): ?string
    {
        try {
            $selectors = config('scrapping.9rayti_config.selectors.groupe_parent_link', [
                'a[href*="/groupe/"]',
                '.groupe-link a',
                '.parent-group a'
            ]);

            foreach ($selectors as $selector) {
                $groupeLink = $crawler->filter($selector)->first();
                if ($groupeLink->count() > 0) {
                    $href = $groupeLink->attr('href');
                    if (preg_match('/\/groupe\/([^\/\?]+)/', $href, $matches)) {
                        return $matches[1];
                    }
                }
            }

        } catch (\Exception $e) {
            // Ignorer erreurs
        }

        return null;
    }

    private function extractSlugFromUrl(string $url): string
    {
        if (preg_match('/\/ecole\/([^\/\?]+)/', $url, $matches)) {
            return $matches[1];
        }

        return basename($url);
    }



    private function mapScrapedDataToModel(array $scrapedData): array
    {
        $slug = strtolower($scrapedData['slug'] ?? '');
        $nom = strtolower($scrapedData['nom'] ?? '');
        $localisation = $scrapedData['localisation'] ?? '';

        // Ensure school name includes location for abbreviated names
        $abbreviations = ['encg', 'ensa', 'est', 'fsjes', 'ensam', 'ensem', 'enim', 'ehtp', 'emi', 'inpt'];
        $formattedNom = $scrapedData['nom'];

        // Check if name is just an abbreviation
        $isJustAbbreviation = false;
        foreach ($abbreviations as $abbr) {
            if (strtolower($formattedNom) === $abbr || strtoupper($formattedNom) === strtoupper($abbr)) {
                $isJustAbbreviation = true;
                break;
            }
        }

        // If name is just an abbreviation, append the location
        if ($isJustAbbreviation && !empty($localisation)) {
            $formattedNom = strtoupper($formattedNom) . ' ' . ucfirst($localisation);
            ScrapingHelper::logScrapping('debug', "Nom complété avec localisation: {$formattedNom}");
        }
        // If name doesn't already include location, check if we should add it
        elseif (!empty($localisation) && !str_contains(strtolower($formattedNom), strtolower($localisation))) {
            // Extract abbreviation from the beginning of the name
            $parts = explode(' ', $formattedNom);
            $firstWord = $parts[0];

            if (in_array(strtolower($firstWord), $abbreviations)) {
                $formattedNom = $firstWord . ' ' . ucfirst($localisation);
                ScrapingHelper::logScrapping('debug', "Nom complété avec localisation: {$formattedNom}");
            }
        }

        $concours = true;
        if (str_contains($slug, 'est-') || str_contains($nom, 'école supérieure de technologie')) {
            $concours = false;
        }

        // RESTRUCTURE SEUILS D'ADMISSION IF NEEDED
        $seuilsAdmission = $scrapedData['seuils_admission'] ?? [];

        // Check if already in year-based format
        $hasYearKeys = false;
        if (!empty($seuilsAdmission) && is_array($seuilsAdmission)) {
            foreach (array_keys($seuilsAdmission) as $key) {
                if (is_numeric($key) && strlen($key) == 4) {
                    $hasYearKeys = true;
                    break;
                }
            }

            if (!$hasYearKeys) {
                ScrapingHelper::logScrapping('debug', "🔄 Restructuration des seuils d'admission dans mapScrapedDataToModel");
                $currentYear = date('Y');
                $seuilsAdmission = [
                    $currentYear => $seuilsAdmission
                ];
            }
        }

        return [
            // Champs disponibles via scrapping
            'nom' => $formattedNom,
            'localisation' => $scrapedData['localisation'],
            'type' => $scrapedData['type'],
            'site_web' => $scrapedData['site_web'] ?? null,
            'formations_proposees' => $scrapedData['formations_proposees'] ?? [],
            'conditions_admission' => $scrapedData['conditions_admission'] ?? null,
            'concours' => $concours,
            'seuils_admission' => $seuilsAdmission, // Use the restructured data
            'deroulement_concours' => $scrapedData['deroulement_concours'] ?? null,

            // Valeurs par défaut
            'universite_rattachement' => $scrapedData['universite_rattachement'] ?? $this->determineUniversiteRattachement($scrapedData),
            'annee_creation' => $scrapedData['annee_creation'] ?? null,
            'accreditation' => $scrapedData['accreditation'] ?? true,
            'nombre_annees_etude' => $scrapedData['nombre_annees_etude'] ?? $this->determineNombreAnneesEtude($scrapedData),
            'bac_obligatoire' => $scrapedData['bac_obligatoire'] ?? true,
            'etat_postulation' => $scrapedData['etat_postulation'] ?? 'ouvert',
            'date_ouverture' => $scrapedData['date_ouverture'] ?? null,
            'date_fermeture' => $scrapedData['date_fermeture'] ?? null,
            'mission_objectifs' => $scrapedData['mission_objectifs'] ?? null,
        ];
    }

    private function determineUniversiteRattachement(array $data): ?string
    {
        $groupeParent = $data['groupe_parent'] ?? null;
        $slug = $data['slug'] ?? null;

        // Si pas de groupe parent trouvé, essayer d'extraire depuis le slug
        if (!$groupeParent && $slug) {
            $groupeParent = $this->extractGroupeFromSlug($slug);
        }

        if ($groupeParent) {
            $groupeMapping = [
                'encg' => 'Réseau ENCG',
                'ensa' => 'Réseau ENSA',
                'ensam' => 'Réseau ENSAM',
                'ensem' => 'Université Hassan II',
                'enim' => 'Université Mohammed V',
                'ehtp' => 'École Hassania des Travaux Publics',
                'emi' => 'École Mohammadia d\'Ingénieurs',
                'inpt' => 'Institut National des Postes et Télécommunications',
                'est' => 'École Supérieure de Technologie',
                'fsac' => 'Faculté des Sciences Ain Chock',
                'fsjes' => 'Faculté des Sciences Juridiques',
                'flsh' => 'Faculté des Lettres et Sciences Humaines',
                'hem' => 'HEM Business School',
                'iscae' => 'Institut Supérieur de Commerce et d\'Administration des Entreprises',
                'emines' => 'École des Mines de Rabat',
                'universiapolis' => 'Universiapolis'
            ];

            return $groupeMapping[$groupeParent] ?? null;
        }

        return null;
    }


    private function extractGroupeFromSlug(string $slug): ?string
    {
        // Patterns pour extraire le groupe depuis le slug
        $groupePatterns = [
            '/^(encg)[-_]/' => 'encg',
            '/^(ensa)[-_]/' => 'ensa',
            '/^(ensam)[-_]/' => 'ensam',
            '/^(ensem)[-_]/' => 'ensem',
            '/^(enim)[-_]/' => 'enim',
            '/^(ehtp)[-_]/' => 'ehtp',
            '/^(emi)[-_]/' => 'emi',
            '/^(inpt)[-_]/' => 'inpt',
            '/^(est)[-_]/' => 'est',
            '/^(fsac)[-_]/' => 'fsac',
            '/^(fsjes)[-_]/' => 'fsjes',
            '/^(flsh)[-_]/' => 'flsh',
            '/^(hem)[-_]/' => 'hem',
            '/^(iscae)[-_]/' => 'iscae',
            '/^(emines)[-_]/' => 'emines',
            '/^(universiapolis)[-_]/' => 'universiapolis'
        ];

        foreach ($groupePatterns as $pattern => $groupe) {
            if (preg_match($pattern, strtolower($slug))) {
                return $groupe;
            }
        }

        return null;
    }


    private function determineNombreAnneesEtude(array $data): int
    {
        $nom = strtolower($data['nom']);

        if (str_contains($nom, 'encg') || str_contains($nom, 'commerce')) {
            return 3;
        }

        if (str_contains($nom, 'ensa') || str_contains($nom, 'ingénieur')) {
            return 5;
        }

        if (str_contains($nom, 'master') || str_contains($nom, 'mba')) {
            return 2;
        }

        return 3; // Défaut
    }

    /**
     * Extraire du texte depuis plusieurs sélecteurs (méthode utilitaire)
     */
    private function extractTextFromMultipleSelectors(Crawler $crawler, array $selectors): string
    {
        foreach ($selectors as $selector) {
            try {
                $elements = $crawler->filter($selector);
                if ($elements->count() > 0) {
                    $text = trim($elements->first()->text());
                    if (!empty($text) && strlen($text) > 10) {
                        ScrapingHelper::logScrapping('debug', "Texte trouvé avec sélecteur: {$selector}");
                        return $text;
                    }
                }
            } catch (\Exception $e) {
                ScrapingHelper::logScrapping('debug', "Erreur sélecteur '{$selector}': " . $e->getMessage());
                continue;
            }
        }

        ScrapingHelper::logScrapping('warning', "Aucun texte trouvé avec tous les sélecteurs");
        $this->debugConditionsStructure($crawler);
        return '';
    }


    private function debugConditionsStructure(Crawler $crawler): void
    {
        try {
            ScrapingHelper::logScrapping('debug', "=== DEBUG STRUCTURE CONDITIONS ADMISSION ===");

            // Chercher .desc-content
            $descContent = $crawler->filter('.desc-content');
            if ($descContent->count() > 0) {
                ScrapingHelper::logScrapping('debug', ".desc-content trouvée: " . $descContent->count());

                // Chercher .school-description dans .desc-content
                $schoolDesc = $descContent->filter('.school-description');
                if ($schoolDesc->count() > 0) {
                    ScrapingHelper::logScrapping('debug', ".school-description trouvée dans .desc-content: " . $schoolDesc->count());

                    $schoolDesc->each(function (Crawler $div, $i) {
                        $text = trim($div->text());
                        ScrapingHelper::logScrapping('debug', "school-description {$i}: " . substr($text, 0, 200) . "...");
                    });
                } else {
                    ScrapingHelper::logScrapping('debug', "Aucun .school-description trouvé dans .desc-content");

                    // Afficher le contenu direct de .desc-content
                    $descContent->each(function (Crawler $div, $i) {
                        $innerHtml = substr($div->html(), 0, 300);
                        ScrapingHelper::logScrapping('debug', "desc-content {$i} HTML: " . $innerHtml);
                    });
                }
            } else {
                ScrapingHelper::logScrapping('debug', "Aucun .desc-content trouvé");
            }

            // Chercher .school-description directement
            $schoolDescDirect = $crawler->filter('.school-description');
            if ($schoolDescDirect->count() > 0) {
                ScrapingHelper::logScrapping('debug', ".school-description trouvée directement: " . $schoolDescDirect->count());
            }

            // Chercher autres divs possibles
            $allDivs = $crawler->filter('div[class*="desc"], div[class*="school"], div[class*="content"]');
            ScrapingHelper::logScrapping('debug', "Divs avec 'desc', 'school' ou 'content': " . $allDivs->count());

            $allDivs->each(function (Crawler $div, $i) {
                $class = $div->attr('class') ?? 'no-class';
                ScrapingHelper::logScrapping('debug', "Div {$i}: class='{$class}'");
            });

            ScrapingHelper::logScrapping('debug', "=== FIN DEBUG STRUCTURE CONDITIONS ===");

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('debug', "Erreur debug conditions: " . $e->getMessage());
        }
    }


    private function extractGroupeDetails(string $groupeSlug): array
    {
        $groupeData = [];
        $endpoints = config('scrapping.sources.9rayti.endpoints', []);

        try {
            // CONCOURS depuis page concours
            if (isset($endpoints['groupe_concours'])) {
                $concoursUrl = $this->baseUrl . str_replace('{groupe_slug}', $groupeSlug, $endpoints['groupe_concours']);
                $concoursHtml = $this->makeHttpRequest($concoursUrl);
                $concoursCrawler = new Crawler($concoursHtml);

                // NOUVEAUX SÉLECTEURS pour structure: .desc-content > .school-description
                $concoursSelectors = config('scrapping.9rayti_config.selectors.concours_description', [
                    // PRIORITÉ 1: Structure confirmée
                    '.desc-content .school-description',
                    '.desc-content div.school-description',
                    'div.desc-content .school-description',
                    '.desc-content > .school-description',

                    // PRIORITÉ 2: Fallbacks pour .desc-content seul
                    '.desc-content',
                    'div.desc-content',

                    // PRIORITÉ 3: .school-description directement
                    '.school-description',
                    'div.school-description',

                    // PRIORITÉ 4: Autres sélecteurs existants (fallback)
                    '.concours-description',
                    '.admission-process',
                    '.concours-info',
                    '.process-description',
                    '.deroulement',
                    '.description'
                ]);

                $concoursInfo = $this->extractTextFromMultipleSelectors($concoursCrawler, $concoursSelectors);
                if (!empty($concoursInfo)) {
                    // Nettoyer et améliorer le texte
                    $concoursInfo = $this->cleanConditionsText($concoursInfo);
                    $groupeData['conditions_admission'] = $concoursInfo;
                    ScrapingHelper::logScrapping('info', "Conditions admission extraites: " . strlen($concoursInfo) . " caractères");
                } else {
                    ScrapingHelper::logScrapping('warning', "Aucune condition d'admission trouvée pour groupe: {$groupeSlug}");
                }
            }

            sleep(config('scrapping.processing.delay_between_requests', 2));

            // SEUILS depuis page seuils (méthode existante)
            if (isset($endpoints['groupe_seuils'])) {
                $seuilsUrl = $this->baseUrl . str_replace('{groupe_slug}', $groupeSlug, $endpoints['groupe_seuils']);
                $seuilsHtml = $this->makeHttpRequest($seuilsUrl);
                $seuilsCrawler = new Crawler($seuilsHtml);

                $seuils = $this->extractSeuils($seuilsCrawler);
                if (!empty($seuils)) {
                    $groupeData['seuils_admission'] = $seuils;
                }
            }

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('warning', "Erreur extraction groupe {$groupeSlug}: " . $e->getMessage());
        }

        return $groupeData;
    }

    /**
     * Nettoyer le texte des conditions d'admission
     */
    private function cleanConditionsText(string $text): string
    {
        // Supprimer tags HTML résiduels
        $text = strip_tags($text);

        // Supprimer espaces multiples
        $text = preg_replace('/\s+/', ' ', $text);

        // Supprimer caractères spéciaux en début/fin
        $text = trim($text);

        // Supprimer préfixes courants
        $prefixesToRemove = [
            'Conditions d\'admission:',
            'Conditions d\'admission :',
            'Admission:',
            'Admission :',
            'Concours:',
            'Concours :',
            'Processus d\'admission:',
            'Processus d\'admission :'
        ];

        foreach ($prefixesToRemove as $prefix) {
            if (stripos($text, $prefix) === 0) {
                $text = trim(substr($text, strlen($prefix)));
            }
        }

        // Limiter la longueur si trop long
        if (strlen($text) > 2000) {
            $text = substr($text, 0, 2000) . '...';
        }

        return trim($text);
    }












    /**
     * Extraire les seuils d'admission depuis les pages groupe/seuils
     * Structure: div.desc-content > div > ul > li
     */
    private function extractSeuils(Crawler $crawler): array
    {
        $seuils = [];

        try {
            // SÉLECTEURS basés sur la structure confirmée : div.desc-content > div > ul > li
            $selectors = [
                // PRIORITÉ 1: Structure confirmée desc-content avec ul
                '.desc-content ul li',
                '.desc-content div ul li',
                'div.desc-content ul li',
                '.desc-content > div > ul > li',

                // PRIORITÉ 2: Aussi ol dans desc-content
                '.desc-content ol li',
                '.desc-content div ol li',
                'div.desc-content ol li',
                '.desc-content > div > ol > li',

                // PRIORITÉ 3: Tables classiques (fallback)
                'table.seuils tr',
                '.seuils-table tr',
                '.admissions-table tr',
                'table tr',
                '.table-seuils tr',

                // PRIORITÉ 4: Autres structures possibles
                '.seuils ul li',
                '.seuils ol li',
                '.admissions ul li',
                '.admissions ol li',
                '.content ul li',
                '.content ol li'
            ];

            foreach ($selectors as $selector) {
                $elements = $crawler->filter($selector);
                if ($elements->count() > 0) {
                    ScrapingHelper::logScrapping('debug', "Seuils trouvés avec sélecteur: {$selector} ({$elements->count()} éléments)");

                    // Deux méthodes selon le type d'élément
                    if (str_contains($selector, 'tr')) {
                        // Traitement pour les tables
                        $seuils = $this->extractSeuilsFromTable($elements);
                    } else {
                        // Traitement pour les listes ul/ol
                        $seuils = $this->extractSeuilsFromList($elements);
                    }

                    if (!empty($seuils)) {
                        ScrapingHelper::logScrapping('info', "Seuils extraits: " . count($seuils) . " avec sélecteur: {$selector}");
                        break;
                    }
                }
            }

            if (empty($seuils)) {
                ScrapingHelper::logScrapping('warning', "Aucun seuil trouvé avec tous les sélecteurs");
                $this->debugSeuilsStructure($crawler);
            }

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('error', "Erreur extraction seuils: " . $e->getMessage());
        }

        return $seuils;
    }

    /**
     * Extraire seuils depuis une table (méthode existante améliorée)
     */
    private function extractSeuilsFromTable(Crawler $tableRows): array
    {
        $seuils = [];

        $tableRows->each(function (Crawler $row) use (&$seuils) {
            $cells = $row->filter('td');
            if ($cells->count() >= 2) {
                $filiere = trim($cells->eq(0)->text());
                $seuil = trim($cells->eq(1)->text());

                if ($this->isValidSeuilEntry($filiere, $seuil)) {
                    $seuils[$filiere] = $seuil;
                }
            }
        });

        return $seuils;
    }

    /**
     * Extraire seuils depuis une liste ul/ol (NOUVEAU pour desc-content)
     */
    private function extractSeuilsFromList(Crawler $listItems): array
    {
        $seuils = [];

        $listItems->each(function (Crawler $item) use (&$seuils) {
            $text = trim($item->text());

            // Nettoyer le texte
            $text = $this->cleanSeuilText($text);

            // Essayer de parser le format "Filière: Seuil" ou "Filière - Seuil"
            $parsedSeuil = $this->parseSeuilFromText($text);

            if ($parsedSeuil && $this->isValidSeuilEntry($parsedSeuil['filiere'], $parsedSeuil['seuil'])) {
                $seuils[$parsedSeuil['filiere']] = $parsedSeuil['seuil'];
            }
        });

        return $seuils;
    }

    /**
     * Nettoyer le texte d'un seuil
     */
    private function cleanSeuilText(string $text): string
    {
        // Supprimer tags HTML résiduels
        $text = strip_tags($text);

        // Supprimer espaces multiples
        $text = preg_replace('/\s+/', ' ', $text);

        // Supprimer caractères spéciaux en début/fin
        $text = trim($text, " \t\n\r\0\x0B•-*");

        return trim($text);
    }

    /**
     * Parser seuil depuis texte libre
     */
    private function parseSeuilFromText(string $text): ?array
    {
        // Formats possibles pour les seuils:
        // "Sciences Mathématiques: 14.50"
        // "Sciences Mathématiques - 14.50" 
        // "Sciences Mathématiques (14.50)"
        // "Sciences Mathématiques 14.50"
        // "SM: 14.50" (format abrégé)

        $patterns = [
            '/^(.+?):\s*([0-9]+[.,][0-9]+)$/i',           // Filière: Note
            '/^(.+?)\s*-\s*([0-9]+[.,][0-9]+)$/i',        // Filière - Note
            '/^(.+?)\s*\(\s*([0-9]+[.,][0-9]+)\s*\)$/i',  // Filière (Note)
            '/^(.+?)\s+([0-9]+[.,][0-9]+)$/i',            // Filière Note
            '/^([A-Z]{2,})\s*:\s*([0-9]+[.,][0-9]+)$/i',  // Abréviation: Note
        ];

        foreach ($patterns as $pattern) {
            if (preg_match($pattern, $text, $matches)) {
                $filiere = trim($matches[1]);
                $seuil = str_replace(',', '.', trim($matches[2]));

                return [
                    'filiere' => $filiere,
                    'seuil' => $seuil
                ];
            }
        }

        // Essayer de détecter si c'est juste une filière sans seuil
        if (preg_match('/^[A-Za-zÀ-ÿ\s]+$/', $text) && strlen($text) > 5) {
            ScrapingHelper::logScrapping('debug', "Filière sans seuil détectée: {$text}");
        }

        return null;
    }

    /**
     * Valider une entrée seuil
     */
    private function isValidSeuilEntry(string $filiere, string $seuil): bool
    {
        // Vérifier filière
        if (empty($filiere) || strlen($filiere) < 2) {
            return false;
        }

        // Éviter les en-têtes de table
        $invalidFilieres = ['filière', 'formation', 'spécialité', 'programme', 'seuil', 'note', 'bac'];
        if (in_array(strtolower($filiere), $invalidFilieres)) {
            return false;
        }

        // Vérifier seuil
        if (empty($seuil)) {
            return false;
        }

        $seuilNumeric = str_replace(',', '.', $seuil);
        if (!is_numeric($seuilNumeric)) {
            return false;
        }

        $seuilFloat = (float) $seuilNumeric;
        if ($seuilFloat < 8.0 || $seuilFloat > 20.0) {
            return false; // Seuils aberrants
        }

        return true;
    }

    /**
     * Debug structure HTML pour seuils
     */
    private function debugSeuilsStructure(Crawler $crawler): void
    {
        try {
            ScrapingHelper::logScrapping('debug', "=== DEBUG STRUCTURE SEUILS ===");

            // Chercher .desc-content
            $descContent = $crawler->filter('.desc-content');
            if ($descContent->count() > 0) {
                ScrapingHelper::logScrapping('debug', ".desc-content trouvée: " . $descContent->count());

                $listsInDesc = $descContent->filter('ul, ol');
                ScrapingHelper::logScrapping('debug', "Listes dans .desc-content: " . $listsInDesc->count());

                $listsInDesc->each(function (Crawler $list, $i) {
                    $tagName = $list->nodeName();
                    $items = $list->filter('li');
                    ScrapingHelper::logScrapping('debug', "Liste {$i}: <{$tagName}> avec {$items->count()} items");

                    // Afficher quelques items pour debug
                    if ($items->count() > 0 && $items->count() <= 10) {
                        $items->each(function (Crawler $item, $j) use ($i) {
                            $text = trim($item->text());
                            ScrapingHelper::logScrapping('debug', "  Item {$i}.{$j}: " . substr($text, 0, 100));
                        });
                    }
                });
            }

            // Chercher tables
            $tables = $crawler->filter('table');
            if ($tables->count() > 0) {
                ScrapingHelper::logScrapping('debug', "Tables trouvées: " . $tables->count());

                $tables->each(function (Crawler $table, $i) {
                    $rows = $table->filter('tr');
                    ScrapingHelper::logScrapping('debug', "Table {$i}: {$rows->count()} lignes");
                });
            }

            // Chercher autres structures possibles
            $seuilsDiv = $crawler->filter('div[class*="seuil"]');
            if ($seuilsDiv->count() > 0) {
                ScrapingHelper::logScrapping('debug', "Divs avec 'seuil': " . $seuilsDiv->count());
            }

            ScrapingHelper::logScrapping('debug', "=== FIN DEBUG STRUCTURE SEUILS ===");

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('debug', "Erreur debug seuils: " . $e->getMessage());
        }
    }
}