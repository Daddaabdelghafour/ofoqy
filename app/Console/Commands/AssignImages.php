<?php

namespace App\Console\Commands;

use App\Models\Metier;
use App\Models\Filiere;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;

class AssignImages extends Command
{
    protected $signature = 'images:assign {--reset : Reset existing images}';
    protected $description = 'Assign Pexels images to métiers and filières using grouped keywords';

    private $pexelsApiKey = 'UMyxqALHyvEuGbFp245KQgh5kCi0v7TUdc21G3PqpbDympPzBHkzMg9F';

    // Groupement intelligent avec moins de keywords
    private $metierKeywords = [
        'technology' => [
            'keywords' => ['Développeur', 'Data', 'DevOps', 'Cybersécurité', 'Réseau', 'Tech', 'Web', 'Mobile', 'Backend', 'Frontend', 'Sécurité'],
            'pexels' => 'technology'
        ],
        'gestion' => [
            'keywords' => ['Manager', 'Contrôleur', 'Audit', 'Gestion', 'Commercial', 'Marketing', 'RH', 'Comptable', 'Finance', 'Consultant', 'Conseil', 'Analyste', 'Chef'],
            'pexels' => 'gestion'
        ],
        'ingenieur' => [
            'keywords' => ['Ingénieur', 'Civil', 'Mécanique', 'Électrique', 'Production', 'Process', 'Maintenance', 'Conception', 'Automatisation'],
            'pexels' => 'ingenieur'
        ],
        'industrie' => [
            'keywords' => ['Production', 'Qualité', 'Logistique', 'Supply', 'Lean', 'Manufacturing', 'Industriel'],
            'pexels' => 'industrie'
        ]
    ];

    private $filiereKeywords = [
        'technology' => [
            'keywords' => ['Informatique', 'Génie', 'Systèmes', 'Réseaux', 'Télécommunications', 'Intelligence'],
            'pexels' => 'technology'
        ],
        'gestion' => [
            'keywords' => ['Gestion', 'Management', 'Commerce', 'Marketing', 'Finance', 'Économie'],
            'pexels' => 'gestion'
        ],
        'ingenieur' => [
            'keywords' => ['Civil', 'Mécanique', 'Électrique', 'Électronique'],
            'pexels' => 'ingenieur'
        ],
        'industriel' => [
            'keywords' => ['Industriel', 'Production', 'Qualité', 'Logistique', 'Textile', 'Agroalimentaire'],
            'pexels' => 'industriel'
        ]
    ];

    public function handle()
    {
        $reset = $this->option('reset');
        
        $this->info('🖼️ Starting image assignment with grouped keywords...');
        
        $this->assignMetierImages($reset);
        $this->assignFiliereImages($reset);
        
        $this->info('✅ Image assignment completed!');
    }

    private function assignMetierImages($reset)
    {
        $query = Metier::query();
        if (!$reset) {
            $query->whereNull('image_path');
        }
        
        $metiers = $query->get();
        $this->info("Processing {$metiers->count()} métiers...");
        
        $progressBar = $this->output->createProgressBar($metiers->count());
        
        foreach ($metiers as $metier) {
            $category = $this->findCategory($metier->nom, $this->metierKeywords);
            $imageUrl = $this->getPexelsImageUrl($category['pexels']);
            
            if ($imageUrl) {
                $metier->update(['image_path' => $imageUrl]);
                $this->line("\n✅ {$metier->nom} -> {$category['pexels']} -> {$imageUrl}");
            } else {
                $this->line("\n❌ {$metier->nom} -> Failed to get image");
            }
            
            $progressBar->advance();
            sleep(1); // Respecter les limites de l'API Pexels
        }
        
        $progressBar->finish();
        $this->newLine();
    }

    private function assignFiliereImages($reset)
    {
        $query = Filiere::query();
        if (!$reset) {
            // Ne traiter que celles sans image ou avec une image qui a échoué
            $query->whereNull('image_path');
        }
        
        $filieres = $query->get();
        $this->info("Processing {$filieres->count()} filières...");
        
        if ($filieres->count() === 0) {
            $this->info("No filières to process.");
            return;
        }
        
        $progressBar = $this->output->createProgressBar($filieres->count());
        
        foreach ($filieres as $filiere) {
            $category = $this->findCategory($filiere->nom, $this->filiereKeywords);
            $imageUrl = $this->getPexelsImageUrl($category['pexels']);
            
            if ($imageUrl) {
                $filiere->update(['image_path' => $imageUrl]);
                $this->line("\n✅ {$filiere->nom} -> {$category['pexels']} -> {$imageUrl}");
            } else {
                $this->line("\n❌ {$filiere->nom} -> Failed to get image");
            }
            
            $progressBar->advance();
            sleep(1); // Respecter les limites de l'API Pexels
        }
        
        $progressBar->finish();
        $this->newLine();
    }

    private function findCategory($text, $categories)
    {
        foreach ($categories as $categoryName => $categoryData) {
            foreach ($categoryData['keywords'] as $keyword) {
                if (stripos($text, $keyword) !== false) {
                    return $categoryData;
                }
            }
        }
        
        // Fallback par défaut
        return ['pexels' => 'gestion'];
    }

    private function getPexelsImageUrl($keyword)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => $this->pexelsApiKey
            ])->get('https://api.pexels.com/v1/search', [
                'query' => $keyword,
                'per_page' => 1
            ]);

            if ($response->successful()) {
                $data = $response->json();
                
                if (!empty($data['photos'])) {
                    // Utiliser l'image 'medium' qui est bien dimensionnée
                    return $data['photos'][0]['src']['medium'];
                }
            }
            
            $this->warn("Failed to fetch image for keyword: {$keyword}");
            return null;
            
        } catch (\Exception $e) {
            $this->error("Error fetching image for {$keyword}: " . $e->getMessage());
            return null;
        }
    }
}
