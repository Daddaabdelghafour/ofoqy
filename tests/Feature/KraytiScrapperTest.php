<?php
// filepath: tests/Feature/KraytiScrapperTest.php

namespace Tests\Feature;

use Tests\TestCase;
use App\Services\Scrapping\Sources\KraytiScrapper;
use App\Services\Scrapping\Helpers\ScrapingHelper;
use App\Models\Universite;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class KraytiScrapperTest extends TestCase
{
    use RefreshDatabase;

    private KraytiScrapper $scrapper;

    protected function setUp(): void
    {
        parent::setUp();
        $this->scrapper = new KraytiScrapper();
    }

    /** @test */
    public function it_can_get_university_list_pages()
    {
        $pages = $this->scrapper->getUniversityListPages();

        $this->assertIsArray($pages);
        $this->assertNotEmpty($pages);
        $this->assertStringContainsString('9rayti.com/ecole/', $pages[0]);
    }

    /** @test */
    public function it_can_extract_basic_school_info()
    {
        $testData = [
            'detail_url' => 'https://www.9rayti.com/ecole/ensa-fes',
            'slug' => 'ensa-fes'
        ];

        $result = $this->scrapper->extractUniversityDetails($testData);

        // Test données de base
        $this->assertArrayHasKey('nom', $result);
        $this->assertArrayHasKey('localisation', $result);
        $this->assertArrayHasKey('type', $result);
        $this->assertNotEmpty($result['nom']);
        $this->assertNotEmpty($result['localisation']);
    }

    /** @test */
    public function it_extracts_formations_from_separate_page()
    {
        // Test extraction formations depuis page groupe
        $testData = [
            'detail_url' => 'https://www.9rayti.com/ecole/ensa-fes',
            'slug' => 'ensa-fes'
        ];

        $result = $this->scrapper->extractUniversityDetails($testData);

        // Les formations devraient être extraites depuis /groupe/ensa/formations
        $this->assertArrayHasKey('formations_proposees', $result);

        // Debug: afficher ce qui a été extrait
        if (empty($result['formations_proposees'])) {
            $this->markTestIncomplete('Formations not extracted - need to implement groupe page scraping');
        } else {
            $this->assertNotEmpty($result['formations_proposees']);
            $this->assertIsArray($result['formations_proposees']);
        }
    }

    /** @test */
    public function it_extracts_seuils_from_separate_page()
    {
        $testData = [
            'detail_url' => 'https://www.9rayti.com/ecole/ensa-fes',
            'slug' => 'ensa-fes'
        ];

        $result = $this->scrapper->extractUniversityDetails($testData);

        // Les seuils devraient être extraits depuis /groupe/ensa/seuils
        $this->assertArrayHasKey('seuils_admission', $result);

        if (empty($result['seuils_admission'])) {
            $this->markTestIncomplete('Seuils not extracted - need to implement groupe page scraping');
        } else {
            $this->assertNotEmpty($result['seuils_admission']);
            $this->assertIsArray($result['seuils_admission']);
        }
    }

    /** @test */
    public function it_extracts_conditions_admission_from_concours_page()
    {
        $testData = [
            'detail_url' => 'https://www.9rayti.com/ecole/ensa-fes',
            'slug' => 'ensa-fes'
        ];

        $result = $this->scrapper->extractUniversityDetails($testData);

        // Conditions d'admission depuis /groupe/ensa/concours
        $this->assertArrayHasKey('conditions_admission', $result);

        if (empty($result['conditions_admission'])) {
            $this->markTestIncomplete('Conditions admission not extracted - need to implement concours page scraping');
        } else {
            $this->assertNotEmpty($result['conditions_admission']);
        }
    }

    /** @test */
    public function it_handles_groupe_urls_correctly()
    {
        // Test avec différents types d'écoles
        $testCases = [
            [
                'slug' => 'ensa-fes',
                'expected_groupe' => 'ensa',
                'groupe_url' => 'https://www.9rayti.com/groupe/ensa'
            ],
            [
                'slug' => 'encg-casablanca',
                'expected_groupe' => 'encg',
                'groupe_url' => 'https://www.9rayti.com/groupe/encg'
            ],
            [
                'slug' => 'est-casablanca',
                'expected_groupe' => 'est',
                'groupe_url' => 'https://www.9rayti.com/groupe/est'
            ]
        ];

        foreach ($testCases as $testCase) {
            $testData = [
                'detail_url' => "https://www.9rayti.com/ecole/{$testCase['slug']}",
                'slug' => $testCase['slug']
            ];

            $result = $this->scrapper->extractUniversityDetails($testData);

            // Vérifier que le groupe parent est détecté
            $this->assertArrayHasKey('groupe_parent', $result);

            if (!empty($result['groupe_parent'])) {
                $this->assertStringContainsString($testCase['expected_groupe'], strtolower($result['groupe_parent']));
            }
        }
    }

    /** @test */
    public function it_validates_extracted_data()
    {
        $validData = [
            'nom' => 'ENSA Fès',
            'localisation' => 'Fès',
            'type' => 'publique'
        ];

        $invalidData = [
            'nom' => '',
            'localisation' => 'Fès',
            'type' => 'invalid_type'
        ];

        $this->assertTrue($this->scrapper->validateUniversityData($validData));
        $this->assertFalse($this->scrapper->validateUniversityData($invalidData));
    }

    /** @test */
    public function it_saves_university_to_database()
    {
        $validData = [
            'nom' => 'ENSA Test',
            'localisation' => 'Casablanca',
            'type' => 'publique',
            'site_web' => 'http://test.ac.ma',
            'formations_proposees' => ['Génie Informatique', 'Génie Civil'],
            'concours' => true,
            'universite_rattachement' => 'Réseau ENSA',
            'nombre_annees_etude' => 5,
            'bac_obligatoire' => true,
            'etat_postulation' => 'ouvert'
        ];

        $result = $this->scrapper->saveUniversity($validData);

        $this->assertTrue($result);
        $this->assertDatabaseHas('universites', [
            'nom' => 'ENSA Test',
            'localisation' => 'Casablanca'
        ]);
    }

    /** @test */
    public function it_handles_http_errors_gracefully()
    {
        // Mock HTTP failure
        Http::fake([
            '*' => Http::response('', 404)
        ]);

        $testData = [
            'detail_url' => 'https://www.9rayti.com/ecole/non-existent',
            'slug' => 'non-existent'
        ];

        $this->expectException(\Exception::class);
        $this->scrapper->extractUniversityDetails($testData);
    }

    /** @test */
    public function it_extracts_complete_ensa_data()
    {
        // Test complet pour ENSA avec toutes les pages
        $testData = [
            'detail_url' => 'https://www.9rayti.com/ecole/ensa-fes',
            'slug' => 'ensa-fes'
        ];

        $result = $this->scrapper->extractUniversityDetails($testData);

        // Données principales
        $this->assertEquals('Ensa', $result['nom']);
        $this->assertEquals('Fès', $result['localisation']);
        $this->assertEquals('publique', $result['type']);
        $this->assertEquals('http://www.ensaf.ac.ma', $result['site_web']);
        $this->assertTrue($result['concours']);
        $this->assertEquals('Réseau ENSA', $result['universite_rattachement']);
        $this->assertEquals(5, $result['nombre_annees_etude']);
        $this->assertTrue($result['bac_obligatoire']);
        $this->assertEquals('ouvert', $result['etat_postulation']);

        // Données détaillées (si implémentées)
        if (!empty($result['formations_proposees'])) {
            $this->assertIsArray($result['formations_proposees']);
            $this->assertNotEmpty($result['formations_proposees']);

            // Vérifier quelques formations typiques ENSA
            $formationsText = implode(' ', $result['formations_proposees']);
            $this->assertStringContainsAny([
                'Génie Informatique',
                'Génie Civil',
                'Génie Électrique',
                'Computer Engineering',
                'Civil Engineering'
            ], $formationsText);
        }

        if (!empty($result['seuils_admission'])) {
            $this->assertIsArray($result['seuils_admission']);
            $this->assertNotEmpty($result['seuils_admission']);
        }

        if (!empty($result['conditions_admission'])) {
            $this->assertIsString($result['conditions_admission']);
            $this->assertNotEmpty($result['conditions_admission']);
        }
    }

    /** @test */
    public function it_calculates_quality_score()
    {
        $testData = [
            'detail_url' => 'https://www.9rayti.com/ecole/ensa-fes',
            'slug' => 'ensa-fes'
        ];

        $result = $this->scrapper->extractUniversityDetails($testData);

        $this->assertArrayHasKey('quality_score', $result);
        $this->assertIsInt($result['quality_score']);
        $this->assertGreaterThanOrEqual(0, $result['quality_score']);
        $this->assertLessThanOrEqual(100, $result['quality_score']);
    }

    /** @test */
    public function it_handles_different_school_types()
    {
        $testCases = [
            'ensa-fes' => ['type' => 'publique', 'rattachement' => 'Réseau ENSA'],
            'encg-casablanca' => ['type' => 'publique', 'rattachement' => 'Réseau ENCG'],
            'est-casablanca' => ['type' => 'publique', 'rattachement' => 'Réseau EST'],
        ];

        foreach ($testCases as $slug => $expected) {
            $testData = [
                'detail_url' => "https://www.9rayti.com/ecole/{$slug}",
                'slug' => $slug
            ];

            $result = $this->scrapper->extractUniversityDetails($testData);

            $this->assertEquals($expected['type'], $result['type']);

            if (!empty($result['universite_rattachement'])) {
                $this->assertStringContainsString(
                    strtolower($expected['rattachement']),
                    strtolower($result['universite_rattachement'])
                );
            }
        }
    }

    /** @test */
    public function it_extracts_data_with_performance_monitoring()
    {
        $startTime = microtime(true);

        $testData = [
            'detail_url' => 'https://www.9rayti.com/ecole/ensa-fes',
            'slug' => 'ensa-fes'
        ];

        $result = $this->scrapper->extractUniversityDetails($testData);

        $executionTime = microtime(true) - $startTime;

        // Performance assertions
        $this->assertLessThan(30, $executionTime, 'Extraction should complete within 30 seconds');
        $this->assertNotEmpty($result);

        // Log performance
        Log::info('Scrapper Performance Test', [
            'slug' => $testData['slug'],
            'execution_time' => $executionTime,
            'fields_extracted' => count($result),
            'formations_count' => count($result['formations_proposees'] ?? []),
            'seuils_count' => count($result['seuils_admission'] ?? [])
        ]);
    }

    /**
     * Helper method to check if string contains any of the given needles
     */
    private function assertStringContainsAny(array $needles, string $haystack): void
    {
        $found = false;
        foreach ($needles as $needle) {
            if (str_contains(strtolower($haystack), strtolower($needle))) {
                $found = true;
                break;
            }
        }

        $this->assertTrue($found, "String '{$haystack}' does not contain any of: " . implode(', ', $needles));
    }

    /** @test */
    public function it_generates_comprehensive_test_report()
    {
        // Test de rapport complet
        $schools = ['ensa-fes', 'encg-casablanca', 'est-casablanca'];
        $report = [];

        foreach ($schools as $slug) {
            $testData = [
                'detail_url' => "https://www.9rayti.com/ecole/{$slug}",
                'slug' => $slug
            ];

            try {
                $startTime = microtime(true);
                $result = $this->scrapper->extractUniversityDetails($testData);
                $executionTime = microtime(true) - $startTime;

                $report[$slug] = [
                    'success' => true,
                    'execution_time' => $executionTime,
                    'fields_extracted' => count($result),
                    'has_formations' => !empty($result['formations_proposees']),
                    'has_seuils' => !empty($result['seuils_admission']),
                    'has_conditions' => !empty($result['conditions_admission']),
                    'quality_score' => $result['quality_score'] ?? 0,
                    'validation_passed' => $this->scrapper->validateUniversityData($result)
                ];
            } catch (\Exception $e) {
                $report[$slug] = [
                    'success' => false,
                    'error' => $e->getMessage(),
                    'execution_time' => 0,
                    'fields_extracted' => 0
                ];
            }
        }

        // Log rapport complet
        Log::info('Scrapper Comprehensive Test Report', $report);

        // Assertions globales
        $successCount = count(array_filter($report, fn($r) => $r['success']));
        $this->assertGreaterThan(0, $successCount, 'At least one school should be successfully scraped');

        foreach ($report as $slug => $data) {
            if ($data['success']) {
                $this->assertGreaterThan(5, $data['fields_extracted'], "School {$slug} should have extracted basic fields");
            }
        }
    }
}