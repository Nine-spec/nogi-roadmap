import type { AppState } from '../types';
import type { JournalStats } from '../lib/stats';
import type { LevelInfo } from '../lib/xp';

export interface AchCtx {
  s: AppState;
  js: JournalStats;
  level: LevelInfo;
  progress: number;
}

export interface Achievement {
  id: string;
  icon: string;
  title: string;
  desc: string;
  check: (c: AchCtx) => boolean;
  progress?: (c: AchCtx) => [number, number];
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-rnc',
    icon: '🥇',
    title: 'Premier RNC',
    desc: 'Note un RNC réussi dans le journal ou maîtrise le RNC.',
    check: ({ s, js }) => js.rncInJournal || s.techniques['p1-rnc'] === 'mastered',
  },
  {
    id: 'ten-doubles',
    icon: '🥈',
    title: '10 Double Legs validés',
    desc: 'Cumule 10 double legs réussis en sparring.',
    check: ({ js }) => js.doubleLegs >= 10,
    progress: ({ js }) => [js.doubleLegs, 10],
  },
  {
    id: 'fifty-sessions',
    icon: '🥉',
    title: '50 séances',
    desc: 'Enregistre 50 séances dans ton journal.',
    check: ({ js }) => js.sessions >= 50,
    progress: ({ js }) => [js.sessions, 50],
  },
  {
    id: 'hundred-hours',
    icon: '⚡',
    title: '100 heures de tapis',
    desc: 'Accumule 100 heures d\'entraînement.',
    check: ({ js }) => js.hours >= 100,
    progress: ({ js }) => [Math.floor(js.hours), 100],
  },
  {
    id: 'shark',
    icon: '🦈',
    title: 'Soumettre une Blue Belt',
    desc: 'Coche « Soumis une ceinture bleue » dans une séance.',
    check: ({ s, js }) => js.beatBlueBelt || !!s.objectives['o4-blue-sub'],
  },
  {
    id: 'wolf',
    icon: '🐺',
    title: 'Série de 30 jours',
    desc: '30 jours consécutifs avec une séance enregistrée.',
    check: ({ js }) => js.longestStreak >= 30,
    progress: ({ js }) => [js.longestStreak, 30],
  },
  {
    id: 'first-session',
    icon: '🥋',
    title: 'Premier pas',
    desc: 'Enregistre ta première séance.',
    check: ({ js }) => js.sessions >= 1,
  },
  {
    id: 'phase1',
    icon: '🗺',
    title: 'Phase 1 bouclée',
    desc: 'Valide les 4 objectifs de la Phase 1.',
    check: ({ s }) => ['o1-positions', 'o1-mount-escape', 'o1-double-leg', 'o1-rnc'].every((id) => s.objectives[id]),
  },
  {
    id: 'level10',
    icon: '🔷',
    title: 'Niveau 10',
    desc: 'Atteins le niveau 10.',
    check: ({ level }) => level.level >= 10,
    progress: ({ level }) => [Math.min(level.level, 10), 10],
  },
  {
    id: 'blue-belt',
    icon: '💙',
    title: 'Blue Belt',
    desc: 'Atteins 100 % de la roadmap.',
    check: ({ progress }) => progress >= 1,
    progress: ({ progress }) => [Math.round(progress * 100), 100],
  },
];
