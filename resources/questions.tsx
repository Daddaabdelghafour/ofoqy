// questions.ts

export interface Question {
  id: number;
  dimension: string;
  question: string;
  options: {
    [key: string]: string;
  };
}

export const questions_SI: Question[] = [
  {
    id: 1,
    dimension: 'S_I',
    question: 'Tu préfères apprendre :',
    options: {
      S: 'En groupe, avec des échanges',
      I: 'Seul, au calme',
    },
  },
  {
    id: 2,
    dimension: 'S_I',
    question: 'En classe, tu es plutôt :',
    options: {
      S: 'Celui qui participe souvent',
      I: 'Celui qui observe et réfléchit',
    },
  },
  {
    id: 3,
    dimension: 'S_I',
    question: 'Pour les projets, tu préfères :',
    options: {
      S: 'Travailler en équipe',
      I: 'Gérer tout à ton rythme',
    },
  },
  {
    id: 4,
    dimension: 'S_I',
    question: 'Les présentations orales, c’est :',
    options: {
      S: 'Un bon moyen d’exprimer ses idées',
      I: 'Stressant, je préfère écrire',
    },
  },
  {
    id: 5,
    dimension: 'S_I',
    question: 'Tu te sens à l’aise :',
    options: {
      S: 'Quand tu échanges avec d’autres',
      I: 'Quand tu réfléchis dans ton coin',
    },
  },
  {
    id: 6,
    dimension: 'S_I',
    question: 'Tu te vois dans un métier où :',
    options: {
      S: 'Tu es souvent en contact avec des gens',
      I: 'Tu travailles en autonomie',
    },
  },
];

export const questions_CT: Question[] = [
  {
    id: 7,
    dimension: 'C_T',
    question: 'Tu préfères les matières :',
    options: {
      C: 'Avec des exercices pratiques',
      T: 'Avec des idées à explorer',
    },
  },
  {
    id: 8,
    dimension: 'C_T',
    question: 'En science, tu préfères :',
    options: {
      C: 'Faire des expériences',
      T: 'Comprendre les théories',
    },
  },
  {
    id: 9,
    dimension: 'C_T',
    question: 'Quand tu apprends, tu aimes :',
    options: {
      C: 'Les exemples concrets',
      T: 'Les concepts abstraits',
    },
  },
  {
    id: 10,
    dimension: 'C_T',
    question: 'Tu es plus à l’aise avec :',
    options: {
      C: 'Les faits et la réalité',
      T: 'Les idées et possibilités',
    },
  },
  {
    id: 11,
    dimension: 'C_T',
    question: 'Tu préfères :',
    options: {
      C: 'Construire ou réparer quelque chose',
      T: 'Imaginer de nouvelles choses',
    },
  },
  {
    id: 12,
    dimension: 'C_T',
    question: 'Pour toi, un bon projet, c’est :',
    options: {
      C: 'Un projet utile et applicable',
      T: 'Un projet original et ambitieux',
    },
  },
];

export const questions_LH: Question[] = [
  {
    id: 13,
    dimension: 'L_H',
    question: 'Tu préfères résoudre :',
    options: {
      L: 'Des énigmes logiques',
      H: 'Des conflits entre personnes',
    },
  },
  {
    id: 14,
    dimension: 'L_H',
    question: 'Tu te sens plus utile quand :',
    options: {
      L: 'Tu résous un problème technique',
      H: 'Tu aides quelqu’un à se sentir mieux',
    },
  },
  {
    id: 15,
    dimension: 'L_H',
    question: 'Tu préfères :',
    options: {
      L: 'Analyser les données',
      H: 'Écouter et comprendre les gens',
    },
  },
  {
    id: 16,
    dimension: 'L_H',
    question: 'Tu te vois plus tard :',
    options: {
      L: 'En ingénieur, chercheur, analyste',
      H: 'En coach, prof, psychologue',
    },
  },
  {
    id: 17,
    dimension: 'L_H',
    question: 'Tu trouves plus satisfaisant :',
    options: {
      L: 'Trouver la bonne solution',
      H: 'Apporter du soutien',
    },
  },
  {
    id: 18,
    dimension: 'L_H',
    question: 'Tu t’épanouis quand :',
    options: {
      L: 'Tu fais un travail structuré',
      H: 'Tu fais un travail relationnel',
    },
  },
];

export const questions_JP: Question[] = [
  {
    id: 19,
    dimension: 'J_P',
    question: 'Quand tu as un devoir à faire, tu :',
    options: {
      J: 'Commences tôt avec un plan',
      P: 'T’y mets quand tu es inspiré(e)',
    },
  },
  {
    id: 20,
    dimension: 'J_P',
    question: 'Tu préfères :',
    options: {
      J: 'Suivre un emploi du temps précis',
      P: 'Avoir de la liberté',
    },
  },
  {
    id: 21,
    dimension: 'J_P',
    question: 'Tu es plus à l’aise quand :',
    options: {
      J: 'Tout est bien organisé',
      P: 'Tu peux improviser',
    },
  },
  {
    id: 22,
    dimension: 'J_P',
    question: 'Pour toi, un bon métier est :',
    options: {
      J: 'Stable avec des routines',
      P: 'Changeant et stimulant',
    },
  },
  {
    id: 23,
    dimension: 'J_P',
    question: 'Tu travailles mieux quand :',
    options: {
      J: 'Tu suis des règles',
      P: 'Tu fais à ta façon',
    },
  },
  {
    id: 24,
    dimension: 'J_P',
    question: 'Ton bureau est :',
    options: {
      J: 'Bien rangé',
      P: 'Un peu en bazar',
    },
  },
];
