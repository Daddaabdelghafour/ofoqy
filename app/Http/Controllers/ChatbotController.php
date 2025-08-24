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
    public function Chatbot(){

        if (!Auth::guard('student')->check()) {
            return redirect('/login');
        }
        $student = Auth::guard('student')->user();

        $mbtiResult = TestPersonnalite::where('student_id', $student->id)->first();

        $mbtiType = $mbtiResult->type_mbti;

    return Inertia::render('Dashboard/Chatbot', 
            [
            'student' => $student,
            'mbtiType' => $mbtiType

            ]);


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

    $json = $response->json();
    if (isset($json['choices']) && isset($json['choices'][0]['message']['content'])) {
        $reply = $json['choices'][0]['message']['content'];
        Log::info($reply);
    } else {
        $reply = "Désolé, je n'ai pas pu générer de réponse pour le moment.";
        Log::error('OpenRouter API error', [
            'response' => $json,
            'status' => $response->status(),
        ]);
    }
    return response()->json([
        'reply' => $reply
    ]);
}
public function storeSessionMessages(Request $request)
{
    $messages = $request->input('messages'); // tableau [{message, time, isUser}]
    $studentId = Auth::guard('student')->id();
    $firstUserMsg = null;
    foreach ($messages as $msg) {
        if ($msg['isUser']) {
            $firstUserMsg = $msg['message'];
            break;
        }
    }
    $title = $firstUserMsg
        ? implode(' ', array_slice(explode(' ', $firstUserMsg), 0, 4)) . '...'
        : 'Conversation';

    foreach ($messages as $msg) {
        
        \App\Models\MessageChatbot::create([
            'student_id' => $studentId,
            'role' => $msg['isUser'] ? 'user' : 'assistant',
            'message' => $msg['message'],
            'contexte_json' => ['title' => $title], // ou autre contexte si besoin
        ]);
    }

    return response()->json(['success' => true]);
}
public function getHistory()
{
    $studentId = Auth::guard('student')->id();

    $today = \App\Models\MessageChatbot::where('student_id', $studentId)
        ->whereDate('created_at', now()->toDateString())
        ->where('role', 'user')
        ->get();

    $yesterday = \App\Models\MessageChatbot::where('student_id', $studentId)
        ->whereDate('created_at', now()->subDay()->toDateString())
        ->where('role', 'user')
        ->get();

    $last7days = \App\Models\MessageChatbot::where('student_id', $studentId)
        ->whereBetween('created_at', [now()->subDays(7)->startOfDay(), now()->subDay()->endOfDay()])
        ->where('role', 'user')
        ->get();

    // Format for frontend
    return response()->json([
        'today' => $today->map(fn($msg) => [
            'id' => $msg->id,
            'title' => $msg->contexte_json['title'] ?? substr($msg->message, 0, 20),
            'time' => $msg->created_at->format('H:i'),
        ]),
        'yesterday' => $yesterday->map(fn($msg) => [
            'id' => $msg->id,
            'title' => $msg->contexte_json['title'] ?? substr($msg->message, 0, 20),
            'time' => $msg->created_at->format('H:i'),
        ]),
        'last7days' => $last7days->map(fn($msg) => [
            'id' => $msg->id,
            'title' => $msg->contexte_json['title'] ?? substr($msg->message, 0, 20),
            'time' => $msg->created_at->format('dddd'),
        ]),
    ]);
}
public function getConversation($title)
{
    $studentId = Auth::guard('student')->id();
    $title = urldecode($title);

    $messages = \App\Models\MessageChatbot::where('student_id', $studentId)
        ->where('contexte_json->title', $title)
        ->orderBy('created_at', 'asc')
        ->get();

    return response()->json($messages->map(function($msg) {
        return [
            'message' => $msg->message,
            'time' => $msg->created_at->format('H:i'),
            'isUser' => $msg->role === 'user'
        ];
    }));
}
public function deleteConversation($title)
{
    $studentId = Auth::guard('student')->id();
    $title = urldecode($title);
    \App\Models\MessageChatbot::where('student_id', $studentId)->where('contexte_json->title', $title)->delete();
    return response()->json(['success' => true]);
}
}