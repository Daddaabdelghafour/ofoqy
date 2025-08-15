<?php

namespace App\Services\Scrapping\Helpers;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class AiEnrichmentService
{

    protected $apiKey;
    protected $model;
    protected $baseUrl;
    protected $enabled;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key', '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');
        $this->model = config('services.openrouter.model');
        $this->baseUrl = config('services.openrouter.api_url', 'https://openrouter.ai/api/v1/chat/completions');
        $this->enabled = true;

        // Log de diagnostic au démarrage du service
        ScrapingHelper::logScrapping('debug', "🚀 AiEnrichmentService initialisé avec:");
        ScrapingHelper::logScrapping('debug', "  - API URL: " . $this->baseUrl);
        ScrapingHelper::logScrapping('debug', "  - Modèle: " . $this->model);
        ScrapingHelper::logScrapping('debug', "  - API Key: " . (empty($this->apiKey) ? "MANQUANTE ❌" : "Présente ✅ [" . substr($this->apiKey, 0, 5) . "..." . substr($this->apiKey, -5) . "]"));
        ScrapingHelper::logScrapping('debug', "  - Statut: " . ($this->enabled ? "Activé ✅" : "Désactivé ❌"));
    }

    public function enrichUniversityData(array $scrapedData): array
    {

        if (!$this->enabled) {
            ScrapingHelper::logScrapping("warning", "⚠️ Enrichissement AI désactivé par configuration");
            return $scrapedData;
        }

        if (!$this->apiKey) {
            ScrapingHelper::logScrapping("error", "🔑 Clé API OpenRouter manquante - vérifiez OPENROUTER_API_KEY dans .env");
            return $scrapedData;
        }

        //check cache to save API Calls
        /*
         $cacheKey = 'ai_enrichment' . md5(json_encode($scrapedData));
         if(Cache::has($cacheKey)){
             ScrapingHelper::logScrapping('info', "✅ Utilisation données AI en cache pour: " . ($scrapedData['nom'] ?? 'unknown'));
             return Cache::get($cacheKey);
         }
         */
        try {
            ScrapingHelper::logScrapping('debug', "🔄 Démarrage enrichissement AI pour: " . ($scrapedData['nom'] ?? $scrapedData['slug'] ?? 'unknown'));

            //préparer la prompt 
            $prompt = $this->buildUniversityPrompt($scrapedData);
            ScrapingHelper::logScrapping('debug', "📝 Prompt généré: " . strlen($prompt) . " caractères");

            //Configuration du modèle pour l'appel
            ScrapingHelper::logScrapping('debug', "📡 Appel API OpenRouter avec modèle: " . $this->model);
            $response = $this->callOpenRouterApi($prompt);
            ScrapingHelper::logScrapping('debug', "📩 Réponse reçue: " . strlen($response) . " caractères");

            // Enrichissement des données .
            $enrichData = $this->parseAiResponse($response, $scrapedData);
            ScrapingHelper::logScrapping('debug', "🔍 Données enrichies: " . count($enrichData) . " champs");

            //Sauvegarde dans le cache pour ne pas trop consommer les api calls et pour avoir des temps de réponses rapide
            //Cache::put($cacheKey,$enrichData,now()->addDays(7));

            ScrapingHelper::logScrapping('info', "✅ Enrichissement AI réussi pour: " . ($scrapedData['nom'] ?? 'unknown'));
            return $enrichData;


        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('error', "❌ Erreur enrichissement AI: " . $e->getMessage());
            ScrapingHelper::logScrapping('error', "⚠️ Trace: " . $e->getTraceAsString());
            return $scrapedData; // Retourner les données originales en cas d'erreur
        }
    }

    public function determineHasConcours(array $scrapedData)
    {

        if (!$this->enabled) {
            ScrapingHelper::logScrapping("warning", "⚠️ Enrichissement AI désactivé par configuration");
            return $this->fallbackDetectConcours($scrapedData);
        }

        if (!$this->apiKey) {
            ScrapingHelper::logScrapping("error", "🔑 Clé API OpenRouter manquante - vérifiez OPENROUTER_API_KEY dans .env");
            return $this->fallbackDetectConcours($scrapedData);
        }

        $cacheKey = 'ai_concours' . md5(json_encode([
            'slug' => $scrapedData['slug'] ?? '',
            'nom' => $scrapedData['nom'] ?? '',
            'type' => $scrapedData['type'] ?? '',
            'conditions' => substr($scrapedData['conditions_admission'] ?? '', 0, 50)
        ]));

        if (Cache::has($cacheKey)) {
            ScrapingHelper::logScrapping('debug', "📋 Utilisation cache pour détection concours: " . ($scrapedData['nom'] ?? $scrapedData['slug'] ?? 'unknown'));
            return Cache::get($cacheKey);
        }

        try {
            $slug = $scrapedData['slug'] ?? '';
            $nom = $scrapedData['nom'] ?? '';
            $type = $scrapedData['type'] ?? '';
            $conditions = $scrapedData['conditions_admission'] ?? '';

            ScrapingHelper::logScrapping('debug', "🔍 Analyse pour détection concours: " . $slug);

            if (str_contains($slug, 'est-')) {
                ScrapingHelper::logScrapping('debug', "⚙️ EST détecté dans slug: admission sur dossier");
                return false;
            }

            if (
                str_contains($slug, 'encg-') || str_contains($slug, 'ensa-') ||
                str_contains($slug, 'ensam-') || str_contains($slug, 'ehtp') ||
                str_contains($slug, 'enim') || str_contains($slug, 'ensem')
            ) {
                ScrapingHelper::logScrapping('debug', "⚙️ École d'ingénieurs publique détectée: concours requis");
                return true;

            }

            // Analyse AI
            ScrapingHelper::logScrapping('debug', "🤖 Pas de règle directe, utilisation AI pour déterminer concours");

            $prompt = <<<EOT
Analyse les informations suivantes sur une école/université au Maroc et détermine si l'admission se fait par concours ou sur dossier:

Nom: $nom
Type: $type
Slug: $slug
Conditions d'admission: $conditions

En te basant sur ces informations et tes connaissances du système éducatif marocain, indique si l'école utilise un concours d'admission (true) ou seulement une sélection sur dossier (false).
Réponds UNIQUEMENT par true ou false.
EOT;

            ScrapingHelper::logScrapping('debug', "📝 Prompt concours généré: " . strlen($prompt) . " caractères");
            $response = $this->callOpenRouterApi($prompt);
            ScrapingHelper::logScrapping('debug', "📩 Réponse concours: " . $response);

            $result = trim(strtolower($response));

            // Extract just true/false from potentially verbose responses
            if (strpos($result, 'true') !== false) {
                $result = true;
            } elseif (strpos($result, 'false') !== false) {
                $result = false;
            } else {
                // Fallback if AI response is unclear
                ScrapingHelper::logScrapping('warning', "⚠️ Réponse AI non claire pour concours, utilisation fallback");
                $result = $this->fallbackDetectConcours($scrapedData);
            }

            Cache::put($cacheKey, $result, now()->addDays(7));

            ScrapingHelper::logScrapping('info', "🤖 AI a déterminé: " . ($result ? "concours requis" : "admission sur dossier"));
            return $result;

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('error', "❌ Erreur AI détection concours: " . $e->getMessage());
            ScrapingHelper::logScrapping('error', "⚠️ Trace: " . $e->getTraceAsString());
            return $this->fallbackDetectConcours($scrapedData);
        }
    }

    private function fallbackDetectConcours(array $scrapedData): bool
    {
        $slug = strtolower($scrapedData['slug'] ?? '');
        $nom = strtolower($scrapedData['nom'] ?? '');
        $type = strtolower($scrapedData['type'] ?? '');

        ScrapingHelper::logScrapping('debug', "⚙️ Méthode fallback détection concours pour: " . $slug);

        // EST = PAS de concours (admission sur dossier)
        if (str_contains($slug, 'est-') || str_contains($nom, 'école supérieure de technologie')) {
            ScrapingHelper::logScrapping('debug', "⚙️ EST détecté: admission sur dossier (fallback)");
            return false;
        }

        // Écoles d'ingénieurs publiques = concours
        if (preg_match('/^(encg|ensa|ensam|ehtp|enim|ensem|emines|emi)[-_]/', $slug)) {
            ScrapingHelper::logScrapping('debug', "⚙️ École d'ingénieurs publique: concours requis (fallback)");
            return true;
        }

        // Privées généralement = dossier, sauf exceptions
        if (
            str_contains($slug, 'hem') || str_contains($slug, 'mundiapolis') ||
            str_contains($slug, 'universiapolis') || str_contains($slug, 'privee')
        ) {
            ScrapingHelper::logScrapping('debug', "⚙️ École privée: admission sur dossier (fallback)");
            return false;
        }

        // Défaut: publique = concours, privée = dossier
        ScrapingHelper::logScrapping('debug', "⚙️ Règle par défaut selon type: " . $type);
        return $type === 'publique';
    }


    private function buildUniversityPrompt(array $scrapedData)
    {
        $nom = $scrapedData['nom'] ?? 'Non spécifié';
        $slug = $scrapedData['slug'] ?? 'Non spécifié';
        $type = $scrapedData['type'] ?? 'Non spécifié';
        $localisation = $scrapedData['localisation'] ?? 'Non spécifié';
        $siteWeb = $scrapedData['site_web'] ?? 'Non spécifié';
        $formations = implode(", ", $scrapedData['formations_proposees'] ?? []);
        $conditions = $scrapedData['conditions_admission'] ?? 'Non spécifié';
        $groupeParent = $scrapedData['groupe_parent'] ?? 'Non spécifié';

        return <<<EOT
[FORMAT STRICT] RÉPONDS UNIQUEMENT AVEC UN OBJET JSON VALIDE, sans texte avant ou après.

Contexte : Tu es un expert du système d'enseignement supérieur marocain. Analyse cette institution :

- Nom : $nom
- Slug : $slug
- Type : $type
- Localisation : $localisation
- Site web : $siteWeb
- Groupe/Réseau : $groupeParent
- Formations : $formations
- Conditions : $conditions

INSTRUCTIONS SPÉCIALES :

1. Recherche et fournis l'ANNÉE DE CRÉATION. Si incertain, applique ces règles :
   - ENCG : entre 2003 et 2011 selon la ville
   - ENSA : entre 2000 et 2008 selon la ville
   - EST : entre 1990 et 2000 selon la ville
   - HEM : 1988
   - EMSI : 1986
   - Écoles privées récentes : après 2010
   - Ne jamais renvoyer null pour annee_creation

2. SEUILS D'ADMISSION :
   - Inclure uniquement les seuils les plus récents disponibles (ex : 2024, 2025)
   - Chaque seuil doit être un objet associant année et valeurs par filière, exemple :
     {
       "2025": {"Sciences Mathématiques": "14.75", "Sciences Physiques": "15.20"},
       "2024": {"Sciences Mathématiques": "14.50", "Sciences Physiques": "15.00"}
     }
   - Seuils types : Sciences Math (13-16), Physiques (14-17), Économie (15-17)

3. DÉROULEMENT DU CONCOURS :
   - Donne une description synthétique du déroulement typique du concours (épreuves, phases, durée)
   - Si information inconnue, donne une description générale des concours similaires dans le système marocain

4. Recherche dans ta base interne et connaissances les informations les plus à jour et fiables (simule une recherche approfondie sur les sites officiels, universités, réseaux ENSA, ministères...)

RENVOIE UN OBJET JSON AVEC CETTE STRUCTURE EXACTE :

{
  "type": "publique",
  "concours": true,
  "nombre_annees_etude": 5,
  "universite_rattachement": "Réseau ENSA",
  "annee_creation": 2005,
  "accreditation": true,
  "bac_obligatoire": true,
  "etat_postulation": "ouvert",
  "mission_objectifs": "Former des ingénieurs hautement qualifiés dans les domaines techniques",
  "seuils_admission": {
    "2025": {
      "Sciences Mathématiques": "14.75",
      "Sciences Physiques": "15.20"
    },
    "2024": {
      "Sciences Mathématiques": "14.50",
      "Sciences Physiques": "15.00"
    }
  },
  "deroulement_concours": "Le concours comprend une épreuve écrite de mathématiques, une épreuve de physique, suivie d'un oral pour les candidats sélectionnés. La durée totale est d'environ 4 heures pour l’écrit, avec l’oral sur plusieurs jours."
}

RÈGLES IMPÉRATIVES :

- Tous les champs doivent être remplis, jamais null.
- Pour "type" : "publique" ou "privée" uniquement.
- Pour "concours" : true ou false uniquement.
- Pour "etat_postulation" : "ouvert", "fermé" ou "prochainement" uniquement.
- "annee_creation" doit toujours être fournie (année estimée si nécessaire).
- Le JSON doit être strictement formaté avec guillemets doubles uniquement.
- Ne rien écrire en dehors du JSON.

EOT;


    }

    private function callOpenRouterApi(string $prompt)
    {
        // FIX: Correction de l'erreur dans l'en-tête Authorization - ajout d'un espace après 'Bearer'
        ScrapingHelper::logScrapping('debug', "📡 Appel API OpenRouter: URL=" . $this->baseUrl);

        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $this->apiKey, // CORRECTION: espace ajouté après Bearer
            'Content-Type' => 'application/json',
            'HTTP-Referer' => config('app.url'),
            'X-Title' => 'University Data Enrichment',
        ])->post($this->baseUrl, [
                    'model' => $this->model,
                    'messages' => [
                        ['role' => 'system', 'content' => 'Tu es un expert en éducation supérieure au Maroc qui fournit des informations factuelles précises.'],
                        ['role' => 'user', 'content' => $prompt]
                    ],
                    'temperature' => 0.2,
                    'max_tokens' => 5000
                ]);

        ScrapingHelper::logScrapping('debug', "📡 Statut réponse API: " . $response->status());

        if ($response->successful()) {
            $content = $response->json('choices.0.message.content') ?? '';
            ScrapingHelper::logScrapping('debug', "✅ Réponse API réussie: " . substr($content, 0, 50) . "...");
            return $content;
        }

        ScrapingHelper::logScrapping('error', "⚠️ Erreur réponse API: " . json_encode($response->json()));
        throw new \Exception("Erreur API OpenRouter: " . ($response->json('error.message') ?? 'Erreur inconnue'));
    }


    private function parseAiResponse(string $aiResponse, array $originalData)
    {
        try {
            ScrapingHelper::logScrapping('debug', "🔍 Parsing réponse AI: " . substr($aiResponse, 0, 50) . "...");

            // Log full response for debugging
            ScrapingHelper::logScrapping('debug', "📄 Réponse brute: [" . $aiResponse . "]");

            if (empty(trim($aiResponse))) {
                ScrapingHelper::logScrapping('warning', "⚠️ Réponse API vide");
                throw new \Exception("Réponse API vide");
            }

            if (preg_match('/\{.*\}/s', $aiResponse, $matches)) {
                $jsonStr = $matches[0];
                ScrapingHelper::logScrapping('debug', "✅ JSON extrait: " . substr($jsonStr, 0, 50) . "...");
                $aiData = json_decode($jsonStr, true);
            } else {
                ScrapingHelper::logScrapping('warning', "⚠️ Aucun JSON trouvé dans la réponse");
                throw new \Exception("Format de réponse AI non reconnu - pas de JSON");
            }

            if (!$aiData || !is_array($aiData)) {
                ScrapingHelper::logScrapping('error', "❌ JSON invalide: " . $jsonStr);
                throw new \Exception("Réponse AI invalide: impossible de parser le JSON");
            }

            $result = $originalData;
            $fieldsAdded = 0;

            foreach ($aiData as $key => $value) {
                // Special handling for admission thresholds
                if ($key === 'seuils_admission' && !empty($value) && is_array($value)) {
                    // Verify if the structure is already by year
                    $hasYearKeys = false;
                    foreach (array_keys($value) as $possibleYear) {
                        if (is_numeric($possibleYear) && strlen($possibleYear) == 4) {
                            $hasYearKeys = true;
                            break;
                        }
                    }

                    // If not organized by year, restructure it
                    if (!$hasYearKeys) {
                        ScrapingHelper::logScrapping('debug', "🔄 Restructuration des seuils d'admission par année");
                        // Use current year as default
                        $currentYear = date('Y');
                        $value = [$currentYear => $value];
                    }

                    if (empty($result[$key])) {
                        $result[$key] = $value;
                        $fieldsAdded++;
                        ScrapingHelper::logScrapping('debug', "AI a ajouté des seuils d'admission: " . json_encode($value));
                    }
                } elseif (!empty($value) && (!isset($result[$key]) || empty($result[$key]))) {
                    $result[$key] = $value;
                    $fieldsAdded++;
                    ScrapingHelper::logScrapping('debug', "AI a ajouté/complété: {$key} = " . (is_array($value) ? json_encode($value) : $value));
                }
            }

            ScrapingHelper::logScrapping('info', "✅ AI a enrichi {$fieldsAdded} champs");
            return $result;

            // REMOVE THIS UNREACHABLE CODE
            // throw new \Exception("Format de réponse AI non reconnu");

        } catch (\Exception $e) {
            ScrapingHelper::logScrapping('error', "Erreur lors du parsing de la réponse AI: " . $e->getMessage());
            return $originalData;
        }
    }
}