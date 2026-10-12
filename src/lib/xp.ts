import { ALL_OBJECTIVES, ALL_TECHNIQUES } from '../data/roadmap';
import type { AppState } from '../types';

export const XP = {
  technique: 25,
  submission: 50,
  session: 10,
  objective: 100,
} as const;

export const MAX_LEVEL = 100;

/** XP needed to go from `level` to `level + 1`. Gentle curve: 20 XP at L1 → ~79 XP at L99. */
export const xpToNext = (level: number) => 20 + Math.floor(level * 0.6);

export interface LevelInfo {
  level: number;
  into: number;
  need: number;
  pct: number;
}

export function levelFromXp(xp: number): LevelInfo {
  let level = 1;
  let rem = xp;
  while (level < MAX_LEVEL && rem >= xpToNext(level)) {
    rem -= xpToNext(level);
    level++;
  }
  const need = level < MAX_LEVEL ? xpToNext(level) : 0;
  return { level, into: rem, need, pct: need ? rem / need : 1 };
}

export interface XpBreakdown {
  techniques: number;
  submissions: number;
  sessions: number;
  objectives: number;
  total: number;
}

/** XP is always derived from state, so toggling a checkbox back removes its XP. */
export function computeXp(s: AppState): XpBreakdown {
  let techniques = 0;
  let submissions = 0;
  for (const tech of ALL_TECHNIQUES) {
    if (s.techniques[tech.id] === 'mastered') {
      if (tech.kind === 'submission') submissions += XP.submission;
      else techniques += XP.technique;
    }
  }
  const sessions = s.journal.length * XP.session;
  const objectives = ALL_OBJECTIVES.filter((o) => s.objectives[o.id]).length * XP.objective;
  return { techniques, submissions, sessions, objectives, total: techniques + submissions + sessions + objectives };
}
