<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\TestPersonnalite;
use App\Models\Student;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ChatbotController extends Controller
{
    public function Chatbot()
    {

        if (!Auth::guard('student')->check()) {
            return redirect('/login');
        }
        $student = Auth::guard('student')->user();

        $mbtiResult = TestPersonnalite::where('student_id', $student->id)->first();

        $mbtiType = $mbtiResult->type_mbti;

        return Inertia::render(
            'Dashboard/Chatbot',
            [
                'student' => $student,
                'mbtiType' => $mbtiType

            ]
        );


    }
    public function sendMessage(Request $request)
    {
        $message = $request->input('message');
        $mbti = $request->input('mbtiType');
        $apiKey = env('OPENROUTER_API_KEY');
        $model = env('OPENROUTER_MODEL');
        $apiUrl = env('OPENROUTER_API_URL');

        // Compose the prompt with MBTI info
        $systemPrompt = $mbti
            ? "Tu es un assistant d’orientation scolaire. L’utilisateur a le type de personnalité MBTI suivant : $mbti. Prends toujours en compte ce type dans tes réponses, même si l’utilisateur ne le mentionne pas."
            : "Tu es un assistant d’orientation scolaire. Réponds normalement.";

        $response = \Illuminate\Support\Facades\Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post($apiUrl, [
                    'model' => $model,
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt],
                        ['role' => 'user', 'content' => $message]
                    ],
                    'max_tokens' => 2000,
                    'temperature' => 0.1,
                    'top_p' => 1,
                    'frequency_penalty' => 0,
                    'presence_penalty' => 0
                ]);

        $reply = $response->json()['choices'][0]['message']['content'];
        log::info('Chatbot response: ' . $reply);


        return response()->json([
            'reply' => $reply
        ]);
    }

}