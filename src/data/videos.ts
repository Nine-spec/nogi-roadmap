export type VideoLevel = 'Débutant' | 'Intermédiaire' | 'Avancé';

export interface VideoRec {
  id: string;
  creator: string;
  topic: string;
  why: string;
  level: VideoLevel;
  query: string;
}

const v = (id: string, creator: string, level: VideoLevel, topic: string, why: string, query: string): VideoRec => ({
  id,
  creator,
  level,
  topic,
  why,
  query,
});

export const VIDEOS: VideoRec[] = [
  v('jt-fundamentals', 'Jordan Teaches Jiu-Jitsu', 'Débutant', 'Fondamentaux et concepts de base', 'Explications simples, idéal pour comprendre la hiérarchie des positions.', 'Jordan Teaches Jiujitsu fundamentals beginners'),
  v('jt-mount-escape', 'Jordan Teaches Jiu-Jitsu', 'Débutant', 'Sorties de mount et side control', 'Couvre précisément les objectifs de la Phase 1.', 'Jordan Teaches Jiujitsu mount escape'),
  v('chew-white-belt', 'Chewjitsu', 'Débutant', 'Conseils pour ceintures blanches', 'Mindset, erreurs fréquentes et survie en rolling.', 'Chewjitsu white belt tips'),
  v('chew-guillotine-def', 'Chewjitsu', 'Débutant', 'Défense contre la guillotine', 'Indispensable quand tu shootes beaucoup en double leg.', 'Chewjitsu guillotine defense'),
  v('lg-half-guard', 'Lachlan Giles', 'Intermédiaire', 'Half guard et dog fight', 'Le système de demi-garde le plus clair pour le No-Gi.', 'Lachlan Giles half guard'),
  v('lg-leglock-def', 'Lachlan Giles', 'Intermédiaire', 'Défense des leg locks', 'Couvre le Leg Lock Awareness de la Phase 3.', 'Lachlan Giles leg lock defense'),
  v('lg-body-lock', 'Lachlan Giles', 'Intermédiaire', 'Body lock pass', 'Passe de pression parfaite pour ton gabarit.', 'Lachlan Giles body lock pass'),
  v('bteam-wrestling', 'B-Team', 'Intermédiaire', 'Lutte pour le grappling', 'Takedowns adaptés au No-Gi, sans gi ni ceinture.', 'B-Team jiu jitsu wrestling takedowns'),
  v('bteam-front-headlock', 'B-Team', 'Intermédiaire', 'Front headlock et guillotine', 'Ta chaîne secondaire en version compétition.', 'B-Team front headlock guillotine'),
  v('gordon-passing', 'Gordon Ryan', 'Avancé', 'Passing et pression', 'Logique de passage de garde de haut niveau.', 'Gordon Ryan guard passing'),
  v('gordon-back', 'Gordon Ryan', 'Avancé', 'Back takes et contrôle du dos', 'Ta chaîne tertiaire au plus haut niveau.', 'Gordon Ryan back take'),
  v('danaher-principles', 'John Danaher', 'Avancé', 'Principes du back attack system', 'Pensée systématique : contrôle avant soumission.', 'John Danaher back attack principles'),
  v('danaher-front', 'John Danaher', 'Avancé', 'Front headlock system', 'Approfondit snap down, guillotine et transitions.', 'John Danaher front headlock'),
  v('nicky-guard', 'Nicky Rodriguez', 'Avancé', 'Wrestling et guard retention', 'Combine lutte explosive et grappling moderne.', 'Nicky Rodriguez wrestling no gi'),
];

export const ytSearch = (q: string) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
