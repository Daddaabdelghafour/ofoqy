<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use App\Models\TestPersonnalite;
use App\Services\MBTI\TextGeneration;
use Inertia\Inertia;

class MBTIController extends Controller
{
    private TextGeneration $textGeneration;

    public function __construct(TextGeneration $textGeneration)
    {
        $this->textGeneration = $textGeneration;
    }

    // Keep your existing getMBTIMessage method as fallback
    public function getMBTIMessage(string $mbtiType): string
    {
        $messages = [
            'SCJL' => '🎯 Vous êtes un leader naturel doté d\'une approche structurée et pragmatique. Votre capacité à organiser et à diriger avec fermeté tout en restant ancré dans la réalité fait de vous un pilier sur lequel les autres peuvent compter. ⚡ Vous excellez dans la prise de décisions rapides et efficaces, préférant les solutions concrètes aux théories abstraites. 🏆 Votre détermination et votre sens de l\'organisation vous permettent de mener à bien des projets complexes avec succès.',

            'SCJH' => '🤝 Vous excellez dans la coordination d\'équipe et la création d\'harmonie autour de vous. Votre don naturel pour comprendre les besoins des autres et votre approche structurée vous permettent de créer des environnements de travail positifs et productifs. 💫 Vous savez allier efficacité et bienveillance, ce qui fait de vous un leader apprécié et respecté. 🌟 Votre capacité à motiver les équipes tout en maintenant des standards élevés est remarquable.',

            'SCPL' => '🔄 Vous êtes remarquablement adaptable et pragmatique dans vos décisions. Votre flexibilité vous permet de naviguer avec aisance dans des situations changeantes tout en gardant une approche terre-à-terre. 🌊 Vous préférez explorer les options disponibles plutôt que de vous enfermer dans un plan rigide. ⚡ Cette combinaison de pragmatisme et d\'ouverture au changement vous rend particulièrement efficace dans des environnements dynamiques et imprévisibles.',

            'SCPH' => '💕 Vous combinez de manière naturelle flexibilité et empathie, créant des solutions authentiquement humaines. Votre approche bienveillante et votre capacité d\'adaptation vous permettent de comprendre les besoins émotionnels des autres tout en restant pratique. 🕊️ Vous excellez dans la résolution de conflits et la création de compromis qui satisfont toutes les parties. 🌈 Votre sensibilité aux dynamiques interpersonnelles fait de vous un médiateur naturel.',

            'STJL' => '🧠 Vous êtes profondément analytique avec une vision claire et méthodique des objectifs à atteindre. Votre esprit logique et votre approche systématique vous permettent de décomposer les problèmes complexes en éléments gérables. 🔍 Vous excellez dans la planification stratégique et l\'optimisation des processus. ⚙️ Votre capacité à voir les patterns et les connexions logiques vous donne un avantage considérable dans la résolution de problèmes sophistiqués.',

            'STJH' => '⚖️ Vous équilibrez parfaitement logique rigoureuse et considération humaine authentique. Cette rare combinaison vous permet de prendre des décisions rationnelles tout en tenant compte de l\'impact sur les personnes concernées. 💎 Votre approche réfléchie et votre empathie naturelle font de vous un conseiller précieux. 🎭 Vous savez quand appliquer la logique pure et quand laisser place à la compassion, créant ainsi des solutions à la fois efficaces et humaines.',

            'STPL' => '💡 Vous êtes un penseur remarquablement flexible et innovant, constamment ouvert aux nouvelles approches et perspectives. Votre curiosité intellectuelle et votre capacité d\'adaptation vous permettent d\'explorer des territoires inexplorés avec confiance. 🚀 Vous excellez dans la génération d\'idées créatives et la résolution de problèmes par des moyens non conventionnels. 🌟 Votre esprit ouvert et votre agilité mentale vous rendent particulièrement doué pour l\'innovation et la découverte.',

            'STPH' => '🎨 Vous alliez magnifiquement créativité intellectuelle et bienveillance authentique dans toutes vos interactions. Votre imagination fertile et votre sensibilité aux besoins des autres créent une synergie unique qui vous permet de développer des solutions à la fois innovantes et humainement satisfaisantes. 💫 Vous excellez dans les domaines qui requièrent à la fois vision créative et compréhension interpersonnelle profonde.',

            'ICJL' => '🤔 Vous privilégiez la réflexion approfondie et la planification minutieuse, approchant chaque défi avec soin et précision. Votre nature contemplative vous permet d\'analyser les situations sous tous les angles avant d\'agir. 📋 Vous excellez dans l\'élaboration de stratégies détaillées et dans l\'anticipation des obstacles potentiels. 🏗️ Votre approche méthodique et votre attention aux détails vous permettent de créer des fondations solides pour vos projets.',

            'ICJH' => '💖 Vous êtes naturellement attentionné avec un excellent sens de l\'organisation et une profonde considération pour les autres. Votre capacité à structurer votre environnement tout en restant sensible aux besoins émotionnels de votre entourage crée une atmosphère à la fois ordonnée et chaleureuse. 🏡 Vous excellez dans la création de systèmes qui favorisent le bien-être collectif tout en maintenant l\'efficacité.',

            'ICPL' => '👁️ Vous êtes remarquablement observateur et vous adaptez avec une aisance naturelle aux changements et aux nouvelles circonstances. Votre capacité d\'observation fine vous permet de capter des nuances que d\'autres pourraient manquer, tandis que votre flexibilité vous aide à ajuster votre approche selon les besoins. 🔧 Cette combinaison fait de vous un excellent problème-solveur dans des situations complexes et évolutives.',

            'ICPH' => '🌸 Vous êtes profondément sensible et remarquablement ouvert aux possibilités infinies qui vous entourent. Votre intuition développée et votre empathie naturelle vous permettent de percevoir les potentiels cachés dans les situations et les personnes. 🔮 Vous excellez dans la compréhension des dynamiques subtiles et dans l\'identification d\'opportunités que d\'autres pourraient négliger. 💝 Votre sensibilité vous guide vers des solutions créatives et humainement enrichissantes.',

            'ITJL' => '🦅 Vous êtes un penseur profondément indépendant et remarquablement déterminé dans vos convictions personnelles. Votre capacité à développer des perspectives uniques et à les défendre avec cohérence vous distingue comme un visionnaire authentique. 🔬 Vous excellez dans la conceptualisation de systèmes complexes et dans la poursuite d\'objectifs à long terme. 💪 Votre indépendance intellectuelle et votre persévérance vous permettent de réaliser des innovations significatives.',

            'ITJH' => '🌙 Vous combinez une intuition profonde avec une compassion authentique et une vision humaniste du monde. Cette rare synthèse vous permet de comprendre les besoins profonds des autres tout en gardant une perspective large et inspirante. 🕊️ Vous excellez dans l\'identification de solutions qui servent à la fois les individus et le bien commun. ✨ Votre sagesse intuitive et votre bienveillance naturelle font de vous un guide précieux pour votre entourage.',

            'ITPL' => '🌟 Vous êtes animé d\'une curiosité insatiable et constamment ouvert aux nouvelles idées et perspectives innovantes. Votre soif d\'apprentissage et votre flexibilité intellectuelle vous permettent d\'explorer des domaines variés avec enthousiasme. 🔗 Vous excellez dans la connexion d\'idées apparemment disparates pour créer des insights originaux. 🦋 Votre esprit ouvert et votre adaptabilité vous rendent particulièrement doué pour naviguer dans la complexité du monde moderne.',

            'ITPH' => '🎭 Vous êtes doté d\'une créativité exceptionnelle alliée à une intelligence émotionnelle remarquable qui vous permet de toucher profondément les autres. Votre capacité à comprendre les nuances émotionnelles et à les traduire en expressions créatives fait de vous un communicateur unique. 🌈 Vous excellez dans la création de ponts entre les idées abstraites et les expériences humaines concrètes, apportant beauté et sens dans tout ce que vous entreprez.'
        ];

        return $messages[$mbtiType] ?? '🌟 Votre profil de personnalité unique vous apporte des perspectives intéressantes et des capacités distinctives qui enrichissent votre approche de la vie et vos relations avec les autres.';
    }

    /**
     * Store MBTI test result
     * POST /mbti-result
     */
    public function store(Request $request): JsonResponse
    {

        $student = Auth::guard('student')->user();

        if (!$student) {
            Log::warning('MBTI API - No student authenticated');
            return response()->json([
                'success' => false,
                'message' => 'Student not authenticated'
            ], 401);
        }

        $validator = Validator::make($request->all(), [
            'result' => 'required|string|in:SCJL,SCJH,SCPL,SCPH,STJL,STJH,STPL,STPH,ICJL,ICJH,ICPL,ICPH,ITJL,ITJH,ITPL,ITPH',
            'percentages' => 'required|array', // Ajout de la validation pour les pourcentages

        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            // Try AI-generated message first, fallback to hardcoded if it fails
            $personalizedMessage = $this->textGeneration->generateMBTIMessage($request->result);

            // If AI fails completely, use hardcoded message

            if (empty($personalizedMessage)) {
                $personalizedMessage = $this->getMBTIMessage($request->result);
            }


            TestPersonnalite::updateOrCreate(
                ['student_id' => $student->id],
                [
                    'type_mbti' => $request->result,
                    'percentages' => $request->percentages,
                    'resultat_json' => [
                        'message' => $personalizedMessage,
                        'generated_at' => now()->toISOString(),
                        'generated_by' => 'ai',
                        'model_used' => config('services.openrouter.model')
                    ]
                ]
            );

            // Keep this log - it's useful for monitoring MBTI test completions
            Log::info('MBTI test completed', [
                'student_id' => $student->id,
                'mbti_type' => $request->result
            ]);

            return response()->json([
                'success' => true,
                'message' => 'MBTI result saved successfully',
                'mbti_type' => $request->result,
                'personalized_message' => $personalizedMessage
            ], 201);

        } catch (\Exception $e) {
            // Keep error logs - important for monitoring
            Log::error('Failed to save MBTI result', [
                'student_id' => $student->id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to save MBTI result',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function showDetails()
    {
        $student = Auth::guard("student")->user();
        $mbtiResult = TestPersonnalite::where('student_id', $student->id)->first();
        $shortName = $this->getMBTIShortName($mbtiResult->type_mbti);

        $type_mbti = $mbtiResult->type_mbti;
        $metiers = [];
        $filieres = [];

        if ($type_mbti) {
            $correspondaces = \App\Models\CorrespondanceMbtiMetier::with('metier')->forMBTI($type_mbti)->orderedByCompatibility()->limit(20)->inRandomOrder()->get();
            Log::info('MBTI correspondences fetched', [
                'student_id' => $student->id,
                'type_mbti' => $type_mbti,
                'correspondances_count' => $correspondaces->count()
            ]);
            $metiers = $correspondaces->pluck('metier')->unique('nom')->take(10)->values();
            Log::info('Metiers fetched', [
                'student_id' => $student->id,
                'metiers_count' => $metiers->count()
            ]);

        }




        return Inertia::render('Dashboard/PersonnaliteDetails', [
            'student' => $student,
            'mbtiResult' => $mbtiResult,
            'shortName' => $shortName,
            'metiers' => $metiers,
        ]);

    }



    public function getMBTIShortName(string $mbtiType): string
    {
        $shortNames = [
            'SCJL' => "🏛️ L'architecte visionnaire : bâtit des structures solides et imagine l'avenir avec clarté.",
            'SCJH' => "🤝 Le coordinateur harmonieux : rassemble les talents et crée l'entente dans chaque équipe.",
            'SCPL' => "🧭 L'explorateur pragmatique : avance avec souplesse et trouve des solutions concrètes.",
            'SCPH' => "🫶 Le médiateur humain : apaise les conflits et favorise l'empathie dans les relations.",
            'STJL' => "📊 Le stratège analytique : analyse, planifie et optimise chaque projet avec logique.",
            'STJH' => "⚖️ Le conseiller équilibré : allie raison et cœur pour guider avec justesse.",
            'STPL' => "🪄 L'innovateur flexible : invente, adapte et transforme les idées en actions.",
            'STPH' => "🎨 Le créatif bienveillant : imagine et inspire tout en prenant soin des autres.",
            'ICJL' => "📝 Le planificateur réfléchi : observe, prépare et structure chaque étape.",
            'ICJH' => "🏡 L'organisateur attentionné : crée des environnements chaleureux et ordonnés.",
            'ICPL' => "👁️ L'observateur adaptable : capte les détails et s'ajuste aux changements.",
            'ICPH' => "🌸 Le sensible ouvert : ressent profondément et accueille la nouveauté.",
            'ITJL' => "🔭 Le visionnaire indépendant : explore de nouveaux horizons avec détermination.",
            'ITJH' => "🫱 Le guide humaniste : inspire et accompagne avec sagesse et bienveillance.",
            'ITPL' => "💡 Le curieux innovant : relie les idées et explore sans cesse.",
            'ITPH' => "❤️‍🔥 Le créateur empathique : exprime ses émotions et touche les cœurs par sa créativité.",
        ];

        return $shortNames[$mbtiType] ?? "🌟 Profil personnalisé : une personnalité unique et inspirante !";
    }









}