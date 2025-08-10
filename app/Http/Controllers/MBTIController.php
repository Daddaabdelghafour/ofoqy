<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\TestPersonnalite;

class MBTIController extends Controller
{
    /**
     * Store MBTI test result
     * POST /api/mbti-result
     */
    public function store(Request $request): JsonResponse
    {
        // Get the authenticated student using the student guard
        $student = Auth::guard('student')->user();
        
        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'Student not authenticated'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'result' => 'required|string|in:INTJ,INTP,ENTJ,ENTP,INFJ,INFP,ENFJ,ENFP,ISTJ,ISFJ,ESTJ,ESFJ,ISTP,ISFP,ESTP,ESFP'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Create or update using the model
            TestPersonnalite::updateOrCreate(
                ['student_id' => $student->id],
                [
                    'type_mbti' => $request->result,
                    'resultat_json' => [] // You can add more detailed results here if needed
                ]
            );

            return response()->json([
                'success' => true,
                'message' => 'MBTI result saved successfully',
                'mbti_type' => $request->result
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to save MBTI result',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}