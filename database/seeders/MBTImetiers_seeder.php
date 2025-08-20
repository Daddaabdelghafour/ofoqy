<?php


namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class MBTImetiers_seeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = base_path('correspondancemetiersMBTI.json');
        
        if (!file_exists($jsonPath)) {
            $this->command->error('JSON file not found at: ' . $jsonPath);
            return;
        }
        
        $jsonData = file_get_contents($jsonPath);
        $correspondances = json_decode($jsonData, true);
        
        if (!$correspondances) {
            $this->command->error('Failed to parse JSON data');
            return;
        }
        
        $this->command->info('Importing ' . count($correspondances) . ' MBTI-Metier correspondances...');
        
        $now = Carbon::now();
        $count = 0;
        
        // Process in batches to improve performance
        $batchSize = 100;
        $batches = array_chunk($correspondances, $batchSize);
        
        foreach ($batches as $batch) {
            $data = [];
            
            foreach ($batch as $item) {
                $data[] = [
                    'metier_id' => $item['metier_id'],
                    'type_mbti' => $item['type_mbti'],
                    'niveau_affinite' => $item['niveau_affinite'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ];
                $count++;
            }
            
            try {
                DB::table('correspondances_mbti_metiers')->insert($data);
            } catch (\Exception $e) {
                $this->command->error('Error inserting records: ' . $e->getMessage());
                Log::error('Seeder error: ' . $e->getMessage());
            }
        }
        
        $this->command->info("Successfully imported $count MBTI-Metier correspondances");
    }
}