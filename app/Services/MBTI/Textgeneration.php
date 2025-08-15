<?php
// filepath: c:\Users\fadwa\Herd\ofoqy\app\Services\MBTI\TextGeneration.php

namespace App\Services\MBTI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TextGeneration
{
    private string $apiKey;
    private string $apiUrl;
    private string $model;
    private bool $enabled;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key');
        $this->apiUrl = config('services.openrouter.api_url');
        $this->model = config('services.openrouter.model');
        $this->enabled = config('services.openrouter.enabled', true);
    }

    /**
     * Generate personalized MBTI message using AI
     */
    public function generateMBTIMessage(string $mbtiType): string
    {
        // Check if OpenRouter is enabled
        /*
        if (!$this->enabled) {
            Log::info('OpenRouter disabled, returning empty', ['mbti_type' => $mbtiType]);
            return '';
        }
        */

        try {
            $prompt = $this->buildMBTIPrompt($mbtiType);
            
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name') . ' - MBTI Analysis'
            ])->timeout(30)->post($this->apiUrl, [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Tu es un expert en psychologie et en typologie MBTI. Génère des messages personnalisés, positifs et encourageants pour chaque type de personnalité. Utilise des emojis appropriés et écris en français. Sois précis, bienveillant et motivant.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'max_tokens' => 300,
                'temperature' => 0.3,
                'top_p' => 1,
                'frequency_penalty' => 0,
                'presence_penalty' => 0
            ]);

            if ($response->successful()) {
                $data = $response->json();
                $generatedMessage = $data['choices'][0]['message']['content'] ?? '';
                
                // Return whatever AI gave us (even if empty) - controller will handle fallback
                return trim($generatedMessage);
            }

            Log::warning('OpenRouter API request failed', [
                'status' => $response->status(),
                'mbti_type' => $mbtiType,
                'response' => $response->body()
            ]);
            
            // Return empty string for API failures - controller will handle fallback
            return '';

        } catch (\Exception $e) {
            Log::error('OpenRouter API exception occurred', [
                'error' => $e->getMessage(),
                'mbti_type' => $mbtiType,
                'line' => $e->getLine(),
                'file' => $e->getFile()
            ]);

            // Return empty string for exceptions - controller will handle fallback
            return '';
        }
    }

    /**
     * Build the prompt for MBTI message generation
     */
    private function buildMBTIPrompt(string $mbtiType): string
    {
        $typeDescriptions = [
            'SCJL' => 'Sociable, Concret, Jugement, Logique - Leader pragmatique et organisé',
            'SCJH' => 'Sociable, Concret, Jugement, Humaniste - Coordinateur empathique',
            'SCPL' => 'Sociable, Concret, Perception, Logique - Adaptateur pragmatique',
            'SCPH' => 'Sociable, Concret, Perception, Humaniste - Médiateur flexible',
            'STJL' => 'Sociable, Théorique, Jugement, Logique - Stratège analytique',
            'STJH' => 'Sociable, Théorique, Jugement, Humaniste - Conseiller équilibré',
            'STPL' => 'Sociable, Théorique, Perception, Logique - Innovateur ouvert',
            'STPH' => 'Sociable, Théorique, Perception, Humaniste - Créatif bienveillant',
            'ICJL' => 'Introverti, Concret, Jugement, Logique - Planificateur méthodique',
            'ICJH' => 'Introverti, Concret, Jugement, Humaniste - Organisateur attentionné',
            'ICPL' => 'Introverti, Concret, Perception, Logique - Observateur adaptable',
            'ICPH' => 'Introverti, Concret, Perception, Humaniste - Sensible et ouvert',
            'ITJL' => 'Introverti, Théorique, Jugement, Logique - Visionnaire indépendant',
            'ITJH' => 'Introverti, Théorique, Jugement, Humaniste - Guide intuitif',
            'ITPL' => 'Introverti, Théorique, Perception, Logique - Explorateur curieux',
            'ITPH' => 'Introverti, Théorique, Perception, Humaniste - Artiste empathique'
        ];

        $description = $typeDescriptions[$mbtiType] ?? 'Type de personnalité unique';

        return "Génère un message personnalisé pour une personne avec le type de personnalité {$mbtiType} ({$description}) avec une recommendation de carrière.

Le message doit :
- Faire exactement 4-5 lignes
- Être positif, valorisant
- Inclure 3 emojis appropriés et pertinents
- Décrire ses forces et talents naturels spécifiques
- Être écrit en français 
- Commencer par un emoji représentatif du type
- Éviter les généralités et être spécifique aux traits du type

Format souhaité : [emoji] [message personnalisé avec emojis intégrés naturellement dans le texte]

Exemple de style : 🎯 Vous êtes un leader naturel avec une approche structurée...";
    }

    
    
}