<?php
namespace App\Console\Commands;

use App\Models\Universite;
use App\Models\Filiere;
use App\Models\Metier;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GenerateFiliereMetiers extends Command
{
    protected $signature = 'generate:filieres-metiers {--limit=2} {--test}';
    protected $description = 'Generate filières and métiers using AI based on existing university formations';

    private string $apiKey;
    private string $apiUrl;
    private string $model;

    public function __construct()
    {
        parent::__construct();
        $this->apiKey = config('services.openrouter.api_key');
        $this->apiUrl = config('services.openrouter.api_url');
        $this->model = config('services.openrouter.model');
    }

    public function handle()
    {
        $this->info('🤖 Starting AI generation of filières and métiers...');
        
        $universites = Universite::whereNotNull('formations_proposees')
            ->whereDoesntHave('filieres')
            ->limit($this->option('limit'))
            ->get();
            
        if ($universites->isEmpty()) {
            $total = Universite::whereNotNull('formations_proposees')->count();
            $done = Universite::whereHas('filieres')->count();
            $this->info("✅ All universities processed! ({$done}/{$total} completed)");
            return;
        }
            
        $this->info("📚 Found {$universites->count()} universities without filières...");
        
        foreach($universites as $universite) {
            $this->info("🏫 Processing: {$universite->nom}");
            $this->processUniversite($universite);
            $this->newLine();
        }
        
        $remaining = Universite::whereNotNull('formations_proposees')->whereDoesntHave('filieres')->count();
        $this->info("🎉 Batch completed! {$remaining} universities remaining.");
    }
    
    private function processUniversite($universite)
    {
        $formations = $this->extractFormations($universite);
        
        if (empty($formations)) {
            $this->warn("  ⚠️ No formations found for {$universite->nom}");
            return;
        }
        
        $this->line("  📋 Found formations: " . implode(', ', $formations));
        
        $aiResponse = $this->callAI($formations, $universite);
        
        if ($this->option('test')) {
            $this->showTestResults($universite, $aiResponse);
        } else {
            if ($aiResponse && isset($aiResponse['filieres'])) {
                $this->createFiliereAndMetiers($universite, $aiResponse['filieres']);
            }
        }
    }
    
    private function extractFormations($universite)
    {
        $formations = $universite->formations_proposees;
        
        $this->line("  🔍 Raw formations data: " . json_encode($formations));
        
        if (is_string($formations)) {
            $formations = json_decode($formations, true) ?? [];
        }
        
        if (!is_array($formations)) {
            return [];
        }
        
        $formationNames = [];
        
        foreach($formations as $formation) {
            if (is_string($formation)) {
                $formationNames[] = $formation;
            } elseif (is_array($formation)) {
                $name = $formation['nom'] ?? $formation['name'] ?? $formation['titre'] ?? '';
                if (!empty($name)) {
                    $formationNames[] = $name;
                }
            }
        }
        
        return array_filter($formationNames);
    }
    
    private function callAI($formations, $universite)
    {
        $formationsText = implode(', ', $formations);
        
        $prompt = "Basé sur cette université marocaine et ses formations:
- Université: '{$universite->nom}'
- Type: '{$universite->type}'
- Formations proposées: {$formationsText}

Génère toutes les filières académiques détaillées et réalistes basées sur ces formations, avec 2-3 métiers pour chaque filière.

IMPORTANT: 
- Pour les filières: mets toutes les informations (durée, niveau, spécialisations, compétences) dans la description
- Pour les métiers: mets toutes les informations (compétences requises, niveau d'expérience, secteur d'activité, perspectives d'évolution) dans la description
- Le salaire doit être un nombre entier en MAD (exemple: 10000 pour 10000 MAD)

Retourne UNIQUEMENT ce JSON:
{
    \"filieres\": [
        {
            \"nom\": \"Sciences de l'Informatique et Technologies\",
            \"description\": \"Formation complète couvrant le développement logiciel, les systèmes d'information et les nouvelles technologies. Durée: 3 ans. Niveau: License. Spécialisations disponibles: Développement Web, Intelligence Artificielle, Cybersécurité. Compétences développées: Programmation (Java, Python, PHP), Base de données (MySQL, MongoDB), Réseaux et sécurité, Algorithmique et structures de données, Gestion de projet informatique. Stages pratiques et projet de fin d'études obligatoires.\",
            \"competences\": \"Programmation, Base de données, Réseaux, Algorithmique, Développement Web\",
            \"parcours_formation\": \"License en 3 ans avec stages pratiques et projet de fin d'études. Possibilité de poursuite en Master spécialisé.\",
            \"metiers\": [
                {
                    \"nom\": \"Développeur Full Stack\",
                    \"salaire_indicatif\": 12000,
                    \"description\": \"Développement d'applications web complètes avec technologies modernes front-end et back-end. Compétences requises: JavaScript, PHP, React, MySQL, Git, API REST. Niveau d'expérience: Junior à Senior. Secteur d'activité: Technologies de l'information. Perspectives d'évolution: Lead Developer, Architecte logiciel, CTO. Environnement de travail: Startups, ESN, grandes entreprises. Missions: Conception d'interfaces utilisateur, développement d'API, optimisation des performances, maintenance applicative.\"
                }
            ]
        }
    ]
}";
        
        $this->line("  🤖 Calling AI for {$universite->nom}...");
        
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name') . ' - Filières et Métiers Generator'
            ])->timeout(60)->post($this->apiUrl, [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Tu es un expert en enseignement supérieur marocain et marché du travail. Crée des programmes académiques (filières) et carrières (métiers) réalistes en français. Retourne UNIQUEMENT du JSON valide. Mets toutes les informations détaillées dans les champs description.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 8000,
                'temperature' => 0.2,
                'top_p' => 1,
                'frequency_penalty' => 0,
                'presence_penalty' => 0
            ]);
            
            if ($response->successful()) {
                $data = $response->json();
                $content = $data['choices'][0]['message']['content'] ?? '';
                
                $this->line("  📥 Raw AI response:");
                $this->line("     " . substr($content, 0, 200) . "...");
                
                // Clean the response to extract only JSON
                $content = preg_replace('/```json\s*/', '', $content);
                $content = preg_replace('/\s*```/', '', $content);
                $content = trim($content);
                
                $decoded = json_decode($content, true);
                
                if (json_last_error() !== JSON_ERROR_NONE) {
                    $this->error("  ❌ JSON decode error: " . json_last_error_msg());
                    $this->line("  📄 Cleaned content: " . substr($content, 0, 500));
                    return null;
                }
                
                $this->line("  ✅ AI response decoded successfully");
                return $decoded;
                
            } else {
                $this->error("  ❌ API request failed: " . $response->status());
                $this->error("  📄 Response body: " . $response->body());
                return null;
            }
            
        } catch (\Exception $e) {
            $this->error("  ❌ AI call failed: " . $e->getMessage());
            Log::error('Filière generation API exception', [
                'error' => $e->getMessage(),
                'university' => $universite->nom,
                'formations' => $formationsText
            ]);
            return null;
        }
    }
    
    private function showTestResults($universite, $aiResponse)
    {
        if (!$aiResponse || !isset($aiResponse['filieres'])) {
            $this->error("  ❌ No valid AI response");
            return;
        }
        
        $this->line("  🎯 Generated data preview:");
        
        foreach($aiResponse['filieres'] as $index => $filiereData) {
            $this->line("    📖 Filière " . ($index + 1) . ": {$filiereData['nom']}");
            $this->line("       Description: " . substr($filiereData['description'] ?? '', 0, 150) . "...");
            
            if (isset($filiereData['metiers'])) {
                $this->line("       Métiers ({" . count($filiereData['metiers']) . "}):");
                foreach($filiereData['metiers'] as $metier) {
                    $salaire = $metier['salaire_indicatif'] ?? 0;
                    $this->line("         💼 {$metier['nom']} - {$salaire} MAD");
                    $this->line("            " . substr($metier['description'] ?? '', 0, 100) . "...");
                }
            }
            $this->newLine();
        }
    }
    
    private function createFiliereAndMetiers($universite, $filieres)
    {
        foreach($filieres as $filiereData) {
            // Create filière using exact fields from migration
            $filiere = Filiere::create([
                'nom' => $filiereData['nom'],
                'description' => $filiereData['description'] ?? '',
                'competences' => $filiereData['competences'] ?? '',
                'parcours_formation' => $filiereData['parcours_formation'] ?? '',
                'universite_id' => $universite->id,
            ]);
            
            $this->line("  📖 Created filière: {$filiere->nom}");
            
            // Create métiers using ONLY the fields that exist in migration
            if (isset($filiereData['metiers']) && is_array($filiereData['metiers'])) {
                foreach($filiereData['metiers'] as $metierData) {
                    $metier = Metier::create([
                        'nom' => $metierData['nom'],
                        'salaire_indicatif' => $metierData['salaire_indicatif'] ?? null,
                        'description' => $metierData['description'] ?? '',
                        'universite_id' => $universite->id,
                    ]);
                    
                    $this->line("    💼 Created métier: {$metier->nom} ({$metier->salaire_indicatif} MAD)");
                }
            }
        }
    }
}