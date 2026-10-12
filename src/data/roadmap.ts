import type { Phase, Skill, TechKind, Technique } from '../types';

const t = (id: string, name: string, kind: TechKind, skills: Skill[], cue: string): Technique => ({
  id,
  name,
  kind,
  skills,
  cue,
});

export const PHASES: Phase[] = [
  {
    id: 'p1',
    num: 1,
    months: '0–3 mois',
    title: 'White Belt Débutant',
    tagline: 'Apprendre la carte : positions, sorties et premières finitions.',
    groups: [
      {
        label: 'Positions',
        items: [
          t('p1-closed-guard', 'Closed Guard', 'technique', ['guard'], 'Casse la posture avant de chercher quoi que ce soit.'),
          t('p1-half-guard', 'Half Guard', 'technique', ['guard'], 'Underhook + tête haute, sinon tu te fais aplatir.'),
          t('p1-side-control', 'Side Control', 'technique', ['passing'], 'Hanches basses, crossface, coupe la vision.'),
          t('p1-mount', 'Mount', 'technique', ['passing'], 'Genoux serrés sous les aisselles, pieds crochetés.'),
          t('p1-back-control', 'Back Control', 'technique', ['passing', 'submissions'], 'Seatbelt d\'abord, crochets ensuite.'),
          t('p1-turtle', 'Turtle', 'technique', ['escapes', 'wrestling'], 'Coudes aux genoux, aucun espace pour les crochets.'),
        ],
      },
      {
        label: 'Défenses',
        items: [
          t('p1-bridge-roll', 'Bridge & Roll (Upa)', 'technique', ['escapes'], 'Piège bras + pied du même côté, pont vers l\'épaule.'),
          t('p1-elbow-escape', 'Elbow Escape', 'technique', ['escapes'], 'Shrimp, genou dans l\'espace, récupère la demi-garde.'),
          t('p1-side-escape', 'Side Control Escape', 'technique', ['escapes'], 'Frames d\'abord, hanche ensuite.'),
          t('p1-back-escape', 'Back Escape', 'technique', ['escapes'], 'Mains au cou, épaules au sol côté crochet bas.'),
        ],
      },
      {
        label: 'Soumissions',
        items: [
          t('p1-rnc', 'RNC', 'submission', ['submissions'], 'Biceps sous le menton, coudes serrés, poitrine collée.'),
          t('p1-guillotine', 'Guillotine', 'submission', ['submissions'], 'Poignet profond sous la gorge, hanches en avant.'),
          t('p1-americana', 'Americana', 'submission', ['submissions'], 'Poignet cloué au sol, fais glisser le coude vers la hanche.'),
          t('p1-kimura', 'Kimura', 'submission', ['submissions'], 'Grip en figure-4, colle le poignet à sa hanche avant de tourner.'),
        ],
      },
      {
        label: 'Lutte',
        items: [
          t('p1-double-leg', 'Double Leg', 'technique', ['wrestling'], 'Changement de niveau, pas de pénétration, tête à l\'extérieur.'),
          t('p1-single-leg', 'Single Leg', 'technique', ['wrestling'], 'Tête dans la poitrine, jambe entre tes genoux.'),
          t('p1-body-lock', 'Body Lock Takedown', 'technique', ['wrestling'], 'Mains sous ses coudes, menton sur sa poitrine.'),
        ],
      },
    ],
    objectives: [
      { id: 'o1-positions', label: 'Connaître toutes les positions et leur hiérarchie' },
      { id: 'o1-mount-escape', label: 'Sortir de mount contre un débutant qui résiste' },
      { id: 'o1-double-leg', label: 'Placer un Double Leg propre en sparring' },
      { id: 'o1-rnc', label: 'RNC fonctionnel en rolling' },
    ],
  },
  {
    id: 'p2',
    num: 2,
    months: '3–6 mois',
    title: 'White Belt Intermédiaire',
    tagline: 'Passer la garde et relier le takedown au contrôle.',
    groups: [
      {
        label: 'Passes',
        items: [
          t('p2-knee-cut', 'Knee Cut', 'technique', ['passing'], 'Underhook ou crossface obligatoire, sinon il récupère.'),
          t('p2-toreando', 'Toreando', 'technique', ['passing'], 'Contrôle les genoux, pas les chevilles, puis angle.'),
          t('p2-hq', 'Headquarters Pass', 'technique', ['passing'], 'Genou entre ses jambes, hanches basses, choisis ton côté.'),
        ],
      },
      {
        label: 'Garde',
        items: [
          t('p2-butterfly', 'Butterfly Guard', 'technique', ['guard'], 'Assis, poitrine contre lui, underhook côté sweep.'),
        ],
      },
      {
        label: 'Soumissions',
        items: [
          t('p2-heg', 'High Elbow Guillotine', 'submission', ['submissions'], 'Coude haut, tire vers ton épaule opposée.'),
          t('p2-arm-triangle', 'Arm Triangle', 'submission', ['submissions'], 'Passe du côté opposé à son bras piégé avant de serrer.'),
        ],
      },
    ],
    objectives: [
      { id: 'o2-butterfly-sweep', label: 'Réussir un Butterfly Sweep en rolling' },
      { id: 'o2-chain', label: 'Enchaîner Takedown → Passe → Mount' },
    ],
  },
  {
    id: 'p3',
    num: 3,
    months: '6–12 mois',
    title: 'White Belt Avancé',
    tagline: 'Construire un style : lutte, pression et front headlock.',
    groups: [
      {
        label: 'Développer',
        items: [
          t('p3-chain-wrestling', 'Chain Wrestling', 'technique', ['wrestling'], 'Chaque échec ouvre la technique suivante : single → double → body lock.'),
          t('p3-pressure-passing', 'Pressure Passing', 'technique', ['passing'], 'Poids sur ses hanches, jamais sur tes genoux.'),
          t('p3-front-headlock', 'Front Headlock', 'technique', ['wrestling', 'submissions'], 'Tête au sol, coude bloqué, tourne autour de lui.'),
        ],
      },
      {
        label: 'Défenses',
        items: [
          t('p3-guillotine-def', 'Guillotine Defense', 'technique', ['escapes'], 'Main sur le poignet, épaule par-dessus, passe du côté du bras.'),
          t('p3-kimura-def', 'Kimura Defense', 'technique', ['escapes'], 'Saisis ta propre ceinture ou ton short, coude collé.'),
          t('p3-leglock-aware', 'Leg Lock Awareness', 'technique', ['escapes'], 'Genou en ligne, talon caché, sors en premier les hanches.'),
        ],
      },
    ],
    objectives: [
      { id: 'o3-control', label: 'Contrôler la majorité des débutants' },
      { id: 'o3-submit', label: 'Soumettre régulièrement les débutants' },
      { id: 'o3-blues', label: 'Tenir tête à certaines ceintures bleues' },
    ],
  },
  {
    id: 'p4',
    num: 4,
    months: '12–18 mois',
    title: 'Blue Belt',
    tagline: 'Maîtriser ton A-Game contre une résistance réelle.',
    groups: [
      {
        label: 'Maîtriser',
        items: [
          t('p4-double-leg', 'Double Leg (niveau bleue)', 'technique', ['wrestling'], 'Setup par les mains, finition à la course ou en levée.'),
          t('p4-single-leg', 'Single Leg (niveau bleue)', 'technique', ['wrestling'], 'Trois finitions minimum : run the pipe, shelf, trip.'),
          t('p4-sprawl', 'Sprawl', 'technique', ['wrestling'], 'Hanches au sol, jambes loin, enchaîne sur front headlock.'),
          t('p4-knee-cut', 'Knee Cut (niveau bleue)', 'technique', ['passing'], 'Fonctionne contre une garde qui frame activement.'),
          t('p4-body-lock-pass', 'Body Lock Pass', 'technique', ['passing'], 'Mains serrées sous ses hanches, marche jusqu\'à la cuisse.'),
          t('p4-butterfly', 'Butterfly Guard (niveau bleue)', 'technique', ['guard'], 'Sweeps + transition vers single leg X ou wrestle-up.'),
          t('p4-half-guard', 'Half Guard (niveau bleue)', 'technique', ['guard'], 'Dog fight et back take depuis le underhook.'),
        ],
      },
      {
        label: 'Soumissions',
        items: [
          t('p4-rnc', 'RNC (finition sous résistance)', 'submission', ['submissions'], 'Finir même quand il défend les mains.'),
          t('p4-guillotine', 'Guillotine (finition sous résistance)', 'submission', ['submissions'], 'Arm-in et high elbow selon sa réaction.'),
          t('p4-arm-triangle', 'Arm Triangle (finition sous résistance)', 'submission', ['submissions'], 'Depuis mount et depuis half guard top.'),
          t('p4-kimura', 'Kimura (finition sous résistance)', 'submission', ['submissions'], 'Utilise-la aussi comme contrôle pour le back take.'),
        ],
      },
    ],
    objectives: [
      { id: 'o4-agame', label: 'Placer ton A-Game complet en rolling libre' },
      { id: 'o4-blue-sub', label: 'Soumettre une ceinture bleue' },
      { id: 'o4-cardio', label: 'Enchaîner 5 rounds de 5 min sans craquer physiquement' },
    ],
  },
];

export const ALL_TECHNIQUES: Technique[] = PHASES.flatMap((p) => p.groups.flatMap((g) => g.items));
export const ALL_OBJECTIVES = PHASES.flatMap((p) => p.objectives);
export const TECH_BY_ID: Record<string, Technique> = Object.fromEntries(ALL_TECHNIQUES.map((x) => [x.id, x]));

/** Distinct technique names offered in pickers (journal, A-Game). */
export const TECH_NAMES: string[] = Array.from(
  new Set(
    ALL_TECHNIQUES.map((x) => x.name.replace(/ \(.*\)$/, '')).concat([
      'Snap Down',
      'Back Take',
      'Arm Drag',
      'Wrestle Up',
      'Dog Fight',
      'Darce',
      'Anaconda',
      'Heel Hook',
      'Straight Ankle Lock',
    ]),
  ),
).sort((a, b) => a.localeCompare(b));

export const SUBMISSION_NAMES = ['RNC', 'Guillotine', 'High Elbow Guillotine', 'Arm Triangle', 'Kimura', 'Americana', 'Darce', 'Anaconda', 'Armbar', 'Triangle', 'Straight Ankle Lock', 'Heel Hook'];
