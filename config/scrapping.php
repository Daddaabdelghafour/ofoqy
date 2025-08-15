<?php
// filepath: config/scrapping.php

return [
    // Configuration des sources de scrapping
    'sources' => [
        '9rayti' => [
            'enabled' => true,
            'priority' => 1,
            'base_url' => 'https://www.9rayti.com',
            'endpoints' => [
                // FOCUS: Écoles existantes seulement
                'ecole_detail' => '/ecole/{slug}',

                // DONNÉES ENRICHIES GROUPE (optionnel)
                'groupe_presentation' => '/groupe/{groupe_slug}',
                'groupe_concours' => '/groupe/{groupe_slug}/concours',
                'groupe_inscription' => '/groupe/{groupe_slug}/inscription',
                'groupe_seuils' => '/groupe/{groupe_slug}/seuils',
                'groupe_formations' => '/groupe/{groupe_slug}/formations',
            ],
            'rate_limit' => 2,
            'timeout' => 30,
            'retry_attempts' => 3,
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'headers' => [
                'Accept' => 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language' => 'fr-FR,fr;q=0.9,en;q=0.8',
                'Accept-Encoding' => 'gzip, deflate, br',
                'Connection' => 'keep-alive',
                'Upgrade-Insecure-Requests' => '1',
                'Cache-Control' => 'max-age=0',
            ],
        ]
    ],

    // Liste des écoles à scraper (URLs connues)
    'ecoles_to_scrape' => [
        // Écoles d'ingénieurs publiques
        'encg-meknes',
        'encg-casablanca',
        'encg-rabat',
        'encg-agadir',
        'encg-fes',
        'encg-tanger',
        'encg-settat',
        'encg-kenitra',
        'encg-oujda',
        'encg-dakhla',
        'encg-el-jadida',

        'ensa-marrakech',
        'ensa-agadir',
        'ensa-fes',
        'ensa-rabat',
        'ensa-tanger',
        'ensa-oujda',
        'ensa-kenitra',
        'ensa-berrechid',
        'ensa-safi',
        'ensa-tetouan',

        'bts-la-source-marrakech',
        'bts-marrakech',

        'cpge-rabat-al-khawarizmi',
        'cpge-beni-mellal',
        'ehtp',


        'emsi-marrakech-gueliz',
        'emsi-rabat-hassan',
        'isga-marrakech',



        'est-agadir',
        'est-essaouira',
        'est-fes',
        'est-meknes',
        'est-sale-bis',
        'est-dakhla',



        'ens-marrakech',


        // Écoles privées
        'averroes-engineering-school',
        'averroes-business-school',
        'faculte-de-droit-et-des-sciences-politiques-de-luniversite-internationale-averroes',
        'faculty-medical-sciences',
        'mahir-center',
        '1337',
        'school-hospitality-business-management',
        'school-collective-intelligence',
        'sse-al-akhawayn',
    ],

    // Configuration validation - FOCUS ÉCOLES
    'validation' => [
        'required_fields' => [
            'nom',           // Nom de l'école
            'localisation',  // Ville de l'école
            'type',          // publique/privée
        ],
        'optional_fields' => [
            'formations_proposees',
            'conditions_admission',
            'seuils_admission',
            'deroulement_concours',
            'site_web',
            'groupe_parent',
            'concours',
            'frais_scolarite',
        ],
        'min_quality_score' => 60,
        'max_quality_score' => 100,
        'duplicate_threshold' => 0.8,
        'max_formations_per_university' => 20,
    ],

    // Configuration traitement
    'processing' => [
        'batch_size' => 10,            // Plus petit pour écoles spécifiques
        'max_retries' => 3,
        'retry_delay' => 3,
        'default_study_duration' => 3,
        'clean_html_tags' => true,
        'delay_between_requests' => 2,
        'scrape_groupe_details' => true,
    ],

    // Configuration logging
    'logging' => [
        'channel' => 'daily',
        'level' => 'info',
        'path' => storage_path('logs/scrapping.log'),
        'max_files' => 30,
    ],

    // Configuration spécifique 9rayti
    '9rayti_config' => [
        'scraping_strategy' => 'ecoles_predefined',    // NOUVEAU: écoles prédéfinies

        'selectors' => [
            // SÉLECTEURS PAGE DÉTAIL ÉCOLE - OPTIMISÉS POUR 9RAYTI
            'ecole_name' => [
                'h1.page-title',
                'h1.entry-title',
                'h1.title',
                '.page-header h1',
                '.entry-header h1',
                '.school-title',
                '.etablissement-nom',
                '.main-title',
                'h1',
                'title'
            ],

            'ecole_location' => [
                '.school-location',
                '.etablissement-ville',
                '.location-info',
                '.ville',
                '.city',
                '.address .locality',
                '.location',
                '.localisation',
                'span.ville',
                '.location-text',
                '.contact-address .city'
            ],

            'ecole_type' => [
                '.school-type',
                '.etablissement-type',
                '.type-etablissement',
                '.category',
                '.school-category',
                '.type',
                '.institution-type',
                '.status'
            ],

            // FORMATIONS - Sélecteurs multiples pour différentes structures

            'formations_list' => [
                // PRIORITÉ 1: Structure confirmée avec <ol>
                '.desc-content ol li',
                '.desc-content div ol li',

                // PRIORITÉ 2: Variantes possibles avec <ol>
                'div.desc-content ol li',
                '.desc-content > div > ol > li',
                '.desc-content .formations ol li',
                '.desc-content .programmes ol li',

                // PRIORITÉ 3: Fallbacks avec <ul> aussi (au cas où)
                '.desc-content ul li',
                '.desc-content div ul li',
                'div.desc-content ul li',

                // PRIORITÉ 4: Fallbacks génériques
                '.formations-list li',
                '.programmes-list li',
                '.cursus-list li',
                'ol.formations li',
                'ul.formations li',
                'ol.programmes li',
                'ul.programmes li',
                '.formation-item',
                '.programme-item',
                '.content ol li',
                '.content ul li',
                '.post-content ol li',
                '.post-content ul li'
            ],

            'admission_conditions' => [
                '.conditions-admission',
                '.admission-requirements',
                '.prerequis',
                '.admission-info',
                '.conditions',
                '.admission-text',
                '.admission-process',
                '.concours-conditions',
                '.entry-requirements'
            ],

            'concours_info' => [
                '.concours',
                '.admission-concours',
                '.concours-required',
                '.concours-info',
                '.competitive-exam',
                '.entrance-exam'
            ],

            'frais_info' => [
                '.frais',
                '.tuition',
                '.prix',
                '.cost',
                '.fees',
                '.scolarite',
                '.frais-scolarite',
                '.tuition-fees'
            ],

            // LIENS SITE WEB - Plus précis
            'website_link' => [
                '.site-web a[href^="http"]:not([href*="9rayti.com"])',
                '.website a[href^="http"]:not([href*="9rayti.com"])',
                '.contact a[href^="http"]:not([href*="9rayti.com"])',
                '.official-site a[href^="http"]:not([href*="9rayti.com"])',
                'a[href*="www."]:not([href*="9rayti.com"]):not([href*="actualite"]):not([href*="calendrier"])',
                'a[href^="http"]:not([href*="9rayti.com"]):not([href*="facebook"]):not([href*="instagram"]):not([href*="twitter"])',
                '.contact-info a[href^="http"]',
                '.external-link a[href^="http"]'
            ],

            'groupe_parent_link' => [
                'a[href*="/groupe/"]',
                '.groupe-link a',
                '.parent-group a',
                '.network-link a',
                '.groupe a[href*="/groupe/"]'
            ],

            // SÉLECTEURS PAGES GROUPE - Plus spécifiques
            'groupe_formations' => [
                '.formations-groupe li',
                '.formations-list li',
                '.programmes li',
                'ul.formations li',
                '.formation-item',
                '.programme-titre',
                '.filiere-nom',
                '.specialite-nom',
                '.formation-name',
                '.content ul li',
                '.post-content ul li',
                '.formations-container li'
            ],

            'seuils_table' => [
                // PRIORITÉ 1: Structure desc-content avec listes
                '.desc-content ul li',
                '.desc-content div ul li',
                'div.desc-content ul li',
                '.desc-content > div > ul > li',
                '.desc-content ol li',
                '.desc-content div ol li',
                'div.desc-content ol li',
                '.desc-content > div > ol > li',

                // PRIORITÉ 2: Tables classiques (fallback)
                'table.seuils tr',
                '.seuils-table tr',
                '.admissions-table tr',
                'table.table-seuils tr',
                '.table-responsive table tr',
                'table tr',

                // PRIORITÉ 3: Autres structures
                '.seuils ul li',
                '.seuils ol li',
                '.admissions ul li',
                '.admissions ol li',
                '.seuils-container ul li',
                '.seuils-container ol li',
                '.admissions-seuils ul li',
                '.admissions-seuils ol li'
            ],

            'concours_description' => [
                // PRIORITÉ 1: Structure confirmée pour conditions
                '.desc-content .school-description',
                '.desc-content div.school-description',
                'div.desc-content .school-description',
                '.desc-content > .school-description',

                // PRIORITÉ 2: Fallbacks pour .desc-content seul
                '.desc-content',
                'div.desc-content',

                // PRIORITÉ 3: .school-description directement
                '.school-description',
                'div.school-description',

                // PRIORITÉ 4: Autres sélecteurs (fallback)
                '.concours-description',
                '.admission-process',
                '.concours-info',
                '.process-description',
                '.deroulement',
                '.description'
            ],

            // NOUVEAUX SÉLECTEURS SPÉCIFIQUES
            'date_concours' => [
                '.date-concours',
                '.exam-date',
                '.concours-calendar',
                '.admission-dates',
                '.inscription-dates'
            ],

            'frais_scolarite' => [
                '.frais-scolarite',
                '.tuition-amount',
                '.fees-amount',
                '.prix-formation',
                '.cost-info'
            ],

            'duree_formation' => [
                '.duree-formation',
                '.formation-duration',
                '.study-duration',
                '.programme-duration'
            ]
        ],

        'data_mapping' => [
            // Types d'ÉCOLES spécifiques
            'ecole_types' => [
                'école supérieure' => 'publique',
                'école privée' => 'privée',
                'école publique' => 'publique',
                'école d\'ingénieurs' => 'publique',
                'école de commerce' => 'privée',
                'école de management' => 'privée',
                'institut supérieur' => 'publique',
                'institut privé' => 'privée',
                'business school' => 'privée',
                'établissement public' => 'publique',
                'établissement privé' => 'privée',
                'université publique' => 'publique',
                'université privée' => 'privée'
            ],

            // Mapping villes - Plus complet
            'location_mapping' => [
                'Casablanca' => 'Casablanca',
                'Casa' => 'Casablanca',
                'Dar el Beida' => 'Casablanca',
                'Rabat' => 'Rabat',
                'Rabat-Salé' => 'Rabat',
                'Fès' => 'Fès',
                'Fez' => 'Fès',
                'Marrakech' => 'Marrakech',
                'Marrakesh' => 'Marrakech',
                'Agadir' => 'Agadir',
                'Tanger' => 'Tanger',
                'Tangier' => 'Tanger',
                'Oujda' => 'Oujda',
                'Kénitra' => 'Kénitra',
                'Kenitra' => 'Kénitra',
                'Meknès' => 'Meknès',
                'Meknes' => 'Meknès',
                'Settat' => 'Settat',
                'Berrechid' => 'Berrechid',
                'Safi' => 'Safi',
                'Tétouan' => 'Tétouan',
                'Tetouan' => 'Tétouan',
                'Dakhla' => 'Dakhla',
                'El Jadida' => 'El Jadida',
                'Jadida' => 'El Jadida',
                'Mohammedia' => 'Mohammedia',
                'Temara' => 'Temara',
                'Sale' => 'Salé'
            ],

            // Groupes d'écoles connus
            'groupes_ecoles' => [
                'encg' => 'École Nationale de Commerce et de Gestion',
                'ensa' => 'École Nationale des Sciences Appliquées',
                'ensem' => 'École Nationale Supérieure d\'Électricité et de Mécanique',
                'enim' => 'École Nationale d\'Industrie Minérale',
                'ehtp' => 'École Hassania des Travaux Publics',
                'est' => 'École Supérieure de Technologie',
                'fsjes' => 'Faculté des Sciences Juridiques Economiques et Sociales',
                'fs' => 'Faculté des Sciences'
            ],

            // Mapping formations communes
            'formations_mapping' => [
                'GI' => 'Génie Informatique',
                'GC' => 'Génie Civil',
                'GE' => 'Génie Électrique',
                'GM' => 'Génie Mécanique',
                'GCH' => 'Génie Chimique',
                'GIO' => 'Génie Industriel et Optimisation',
                'GSTR' => 'Génie des Systèmes de Télécommunications et Réseaux'
            ]
        ],

        'extraction_rules' => [
            'extract_from_predefined_list' => true,
            'follow_groupe_links' => true,
            'extract_seuils' => true,
            'extract_concours_info' => true,
            'detect_ecole_type' => true,
            'extract_frais_scolarite' => true,
            'max_groupe_pages' => 4,
            'extract_formations_from_groupe' => true,
            'extract_detailed_admissions' => true,
            'fallback_to_slug_data' => true,
            'clean_extracted_text' => true,
            'validate_extracted_urls' => true
        ],

        'cleaning_rules' => [
            'remove_prefixes' => ['École', 'Ecole', 'Institut', 'Institute', 'Université', 'University'],
            'remove_suffixes' => ['- 9rayti.com', '| 9rayti.com', '9rayti.com'],
            'normalize_quotes' => true,
            'remove_extra_spaces' => true,
            'convert_encoding' => 'UTF-8'
        ],

        'validation_rules' => [
            'min_name_length' => 5,
            'max_name_length' => 200,
            'min_location_length' => 3,
            'required_url_protocols' => ['http://', 'https://'],
            'blocked_domains' => ['9rayti.com', 'facebook.com', 'instagram.com', 'twitter.com'],
            'min_formations_length' => 3,
            'max_formations_count' => 50
        ]
    ],
];