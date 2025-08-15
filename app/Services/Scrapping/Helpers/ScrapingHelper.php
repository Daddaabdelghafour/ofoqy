<?php
// filepath: app/Services/Scrapping/Helpers/ScrapingHelper.php

namespace App\Services\Scrapping\Helpers;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

/**
 * Helper principal pour fonctions utilitaires de scrapping
 */
class ScrapingHelper
{
    /**
     * Nettoyer nom université
     * TODO: Supprimer préfixes courants (Université, Institut, École)
     * TODO: Supprimer suffixes géographiques (Maroc, Morocco, -Rabat)
     * TODO: Normaliser espaces multiples
     * TODO: Capitaliser correctement
     */
    public static function cleanUniversityName(string $nom): string
    {
        // TODO: Array des préfixes à supprimer
        $prefixes = [
            'université de ',
            'université du ',
            'université des ',
            'institut de ',
            'institut du ',
            'institut des ',
            'école de ',
            'école du ',
            'école des ',
            'faculté de ',
            'faculté du ',
            'faculté des '
        ];

        // TODO: Array des suffixes à supprimer  
        $suffixes = [
            ' maroc',
            ' morocco',
            ' royaume du maroc',
            ' rabat',
            ' casablanca',
            ' fès',
            ' marrakech'
        ];

        // TODO: Convertir en minuscules pour comparaison
        $nomClean = strtolower(trim($nom));

        // TODO: Supprimer préfixes (boucle foreach) 
        foreach ($prefixes as $prefix) {
            // Vérifier avec espace d'abord
            if (str_starts_with($nomClean, $prefix . ' ')) {
                $nomClean = trim(substr($nomClean, strlen($prefix . ' ')));
                break;
            }
            // Puis sans espace 
            elseif (str_starts_with($nomClean, $prefix)) {
                $nomClean = trim(substr($nomClean, strlen($prefix)));
                break;
            }
        }

        // TODO: Supprimer suffixes (boucle foreach) 
        foreach ($suffixes as $suffix) {
            // Vérifier avec espace d'abord
            if (str_ends_with($nomClean, ' ' . $suffix)) {
                $nomClean = trim(substr($nomClean, 0, -strlen(' ' . $suffix)));
                break;
            }
            // Puis sans espace (cas où le suffixe est collé)
            elseif (str_ends_with($nomClean, $suffix)) {
                $nomClean = trim(substr($nomClean, 0, -strlen($suffix)));
                break;
            }
        }

        // TODO: Nettoyer espaces multiples et capitaliser
        $nomClean = preg_replace('/\s+/', ' ', $nomClean);
        return Str::title($nomClean);
    }

    /**
     * Normaliser localisation (ville marocaine)
     * TODO: Mapping des variantes vers noms standards
     * TODO: Extraire ville principale si adresse complète
     * TODO: Gérer cas spéciaux (Casa = Casablanca)
     */
    public static function normalizeLocation(string $location): string
    {
        // TODO: Array mapping variantes -> nom standard
        $cityMappings = [
            'casa' => 'Casablanca',
            'casablanca' => 'Casablanca',
            'rabat' => 'Rabat',
            'fès' => 'Fès',
            'fez' => 'Fès',
            'marrakech' => 'Marrakech',
            'marrakesh' => 'Marrakech',
            'agadir' => 'Agadir',
            'tanger' => 'Tanger',
            'tangier' => 'Tanger',
            'oujda' => 'Oujda',
            'kenitra' => 'Kénitra',
            'témara' => 'Témara',
            'salé' => 'Salé'
        ];

        // TODO: Nettoyer et normaliser - CORRIGÉ
        $locationClean = strtolower(trim($location));

        // TODO: Chercher correspondance dans mapping
        foreach ($cityMappings as $variant => $standard) {
            if (str_contains($locationClean, $variant)) {
                return $standard;
            }
        }

        // TODO: Si pas de correspondance, capitaliser première lettre
        return Str::title($locationClean);
    }

    /**
     * Générer clé unique université pour déduplication
     * TODO: Combiner nom normalisé + localisation
     * TODO: Supprimer accents et caractères spéciaux
     * TODO: Générer hash MD5 pour comparaison rapide
     */
    public static function generateUniversityKey(array $university): string
    {
        // TODO: Récupérer nom et localisation
        $nom = $university['nom'] ?? '';
        $localisation = $university['localisation'] ?? '';

        // TODO: Nettoyer et normaliser
        $nomClean = self::removeAccents(strtolower($nom));
        $locClean = self::removeAccents(strtolower($localisation));

        // TODO: Supprimer caractères non alphanumériques
        $nomClean = preg_replace('/[^a-z0-9]/', '', $nomClean);
        $locClean = preg_replace('/[^a-z0-9]/', '', $locClean);

        // TODO: Combiner et hasher
        $combined = $nomClean . '_' . $locClean;
        return md5($combined);
    }

    /**
     * Supprimer accents français/arabes
     * TODO: Mapping complet caractères accentués
     * TODO: Gestion caractères arabes si nécessaire
     */
    public static function removeAccents(string $text): string
    {
        // TODO: Array mapping accents -> lettres simples
        $accents = [
            'à' => 'a',
            'á' => 'a',
            'â' => 'a',
            'ã' => 'a',
            'ä' => 'a',
            'å' => 'a',
            'è' => 'e',
            'é' => 'e',
            'ê' => 'e',
            'ë' => 'e',
            'ì' => 'i',
            'í' => 'i',
            'î' => 'i',
            'ï' => 'i',
            'ò' => 'o',
            'ó' => 'o',
            'ô' => 'o',
            'õ' => 'o',
            'ö' => 'o',
            'ù' => 'u',
            'ú' => 'u',
            'û' => 'u',
            'ü' => 'u',
            'ç' => 'c',
            'ñ' => 'n'
        ];

        // TODO: Remplacer tous les accents
        return strtr($text, $accents);
    }

    /**
     * Détecter présence concours depuis texte
     * TODO: Liste mots-clés français et arabe
     * TODO: Recherche insensible à la casse
     * TODO: Score basé sur nombre d'occurrences
     */
    public static function detectConcours(string $text): bool
    {
        // TODO: Mots-clés indicateurs de concours
        $keywords = [
            'concours',
            'concours d\'accès',
            'examen',
            'examen d\'entrée',
            'test',
            'test d\'admission',
            'sélection',
            'sélectif',
            'admission sur',
            'accès sur',
            'épreuve',
            'épreuves'
        ];

        // TODO: Convertir texte en minuscules
        $textLower = strtolower($text);

        // TODO: Compter occurrences mots-clés
        $keywordCount = 0;
        foreach ($keywords as $keyword) {
            if (str_contains($textLower, $keyword)) {
                $keywordCount++;
            }
        }

        // TODO: Seuil minimum pour détecter concours
        return $keywordCount >= 1;
    }

    /**
     * Valider et nettoyer URL
     * TODO: Vérifier format URL valide
     * TODO: Ajouter protocole si manquant
     * TODO: Normaliser (supprimer trailing slash)
     */
    public static function validateAndCleanUrl(?string $url): ?string
    {
        if (empty($url)) {
            return null;
        }

        // TODO: Nettoyer espaces
        $url = trim($url);

        // TODO: Ajouter protocole si manquant
        if (!preg_match('/^https?:\/\//', $url)) {
            $url = 'https://' . $url;
        }

        // TODO: Valider format URL
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return null;
        }

        // TODO: Supprimer trailing slash
        return rtrim($url, '/');
    }

    /**
     * Logger avec contexte scrapping
     * TODO: Ajouter préfixe [SCRAPPING] 
     * TODO: Inclure timestamp et contexte
     * TODO: Gérer différents niveaux de log
     */
    public static function logScrapping(string $level, string $message, array $context = []): void
    {
        // TODO: Channel de log configuré
        $channel = config('scrapping.logging.channel', 'daily');

        // TODO: Ajouter contexte automatique
        $context['scrapping'] = true;
        $context['timestamp'] = now()->toISOString();

        // TODO: Logger selon niveau
        Log::channel($channel)->$level("[SCRAPPING] {$message}", $context);
    }

    /**
     * Calculer score qualité données université
     * TODO: Points par champ rempli selon importance
     * TODO: Bonus pour données enrichies
     * TODO: Malus pour incohérences détectées
     */
    public static function calculateQualityScore(array $university): int
    {
        $score = 0;

        // TODO: Poids ajustés selon importance métier
        $fieldWeights = [
            // Trio essentiel pour identification unique
            'nom' => 25,
            'type' => 15,                   // Utilisé dans scopePublique()/scopePrivee()
            'localisation' => 15,

            // Données d'admission critiques
            'formations_proposees' => 10,   // Array principal pour matching étudiant
            'seuils_admission' => 8,        // Utilisé dans isEligibleForStudent()
            'concours' => 4,                // Boolean - scopeWithConcours()
            'bac_obligatoire' => 3,         // Boolean - logique éligibilité

            // Données temporelles et contact
            'etat_postulation' => 4,        // Utilisé dans scopeOuverte()
            'site_web' => 5,
            'date_ouverture' => 3,          // Utilisé dans isOpenForApplication()
            'date_fermeture' => 3,          // Utilisé dans isOpenForApplication()

            // Informations descriptives
            'conditions_admission' => 2,
            'mission_objectifs' => 2,
            'deroulement_concours' => 1,    // Array détails concours
        ];

        // TODO: Calculer score base
        foreach ($fieldWeights as $field => $weight) {
            if (isset($university[$field]) && !empty($university[$field])) {
                $score += $weight;
            }
        }

        // TODO: BONUS pour cohérence métier (détails dans commentaire précédent)
        // [Logique bonus omise pour concision]

        // TODO: MALUS pour incohérences (détails dans commentaire précédent)
        // [Logique malus omise pour concision]

        // TODO: Garantir score final entre 0 et 100
        return max(0, min(100, $score));
    }
}


