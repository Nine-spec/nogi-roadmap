import { ALL_OBJECTIVES, ALL_TECHNIQUES, PHASES } from '../data/roadmap';
import type { AppState, Skill, Status } from '../types';

export const statusValue = (s: Status | undefined) => (s === 'mastered' ? 1 : s === 'progress' ? 0.5 : 0);

export interface JournalStats {
  sessions: number;
  minutes: number;
  hours: number;
  submissions: number;
  takedowns: number;
  doubleLegs: number;
  longestStreak: number;
  currentStreak: number;
  sessionsLast30: number;
  beatBlueBelt: boolean;
  rncInJournal: boolean;
}

const dayNum = (iso: string) => Math.floor(new Date(iso + 'T12:00:00').getTime() / 86400000);

export function journalStats(s: AppState): JournalStats {
  const j = s.journal;
  const minutes = j.reduce((a, e) => a + (e.duration || 0), 0);
  const days = Array.from(new Set(j.map((e) => dayNum(e.date)))).sort((a, b) => a - b);
  let longest = 0;
  let run = 0;
  for (let i = 0; i < days.length; i++) {
    run = i > 0 && days[i] === days[i - 1] + 1 ? run + 1 : 1;
    longest = Math.max(longest, run);
  }
  const today = Math.floor(Date.now() / 86400000);
  let current = 0;
  if (days.length && today - days[days.length - 1] <= 1) {
    current = 1;
    for (let i = days.length - 1; i > 0 && days[i] === days[i - 1] + 1; i--) current++;
  }
  return {
    sessions: j.length,
    minutes,
    hours: minutes / 60,
    submissions: j.reduce((a, e) => a + (e.submissions || 0), 0),
    takedowns: j.reduce((a, e) => a + (e.takedowns || 0), 0),
    doubleLegs: j.reduce((a, e) => a + (e.doubleLegs || 0), 0),
    longestStreak: longest,
    currentStreak: current,
    sessionsLast30: days.filter((d) => today - d < 30).length,
    beatBlueBelt: j.some((e) => e.beatBlueBelt),
    rncInJournal: j.some((e) => e.submissionTypes.includes('RNC')),
  };
}

/** 0..1 progress toward blue belt: techniques (in progress = half) + objectives counted double. */
export function blueBeltProgress(s: AppState): number {
  const techScore = ALL_TECHNIQUES.reduce((a, t) => a + statusValue(s.techniques[t.id]), 0);
  const objScore = ALL_OBJECTIVES.filter((o) => s.objectives[o.id]).length * 2;
  return (techScore + objScore) / (ALL_TECHNIQUES.length + ALL_OBJECTIVES.length * 2);
}

export function phaseProgress(s: AppState, phaseId: string): number {
  const p = PHASES.find((x) => x.id === phaseId)!;
  const items = p.groups.flatMap((g) => g.items);
  const tech = items.reduce((a, t) => a + statusValue(s.techniques[t.id]), 0);
  const obj = p.objectives.filter((o) => s.objectives[o.id]).length * 2;
  return (tech + obj) / (items.length + p.objectives.length * 2);
}

export function rankLabel(p: number): string {
  if (p >= 1) return 'Blue Belt';
  if (p >= 0.75) return 'Blue Belt imminente';
  if (p >= 0.5) return 'White Belt Avancé';
  if (p >= 0.25) return 'White Belt Intermédiaire';
  return 'White Belt Débutant';
}

/** Stripes on the white belt: one per completed quarter. */
export const stripes = (p: number) => Math.min(4, Math.floor(p * 4 + 1e-9));

export interface Estimate {
  months: number;
  basis: 'plan' | 'rythme' | 'atteint';
}

const MONTH = 30.44;

export function estimateRemaining(s: AppState, progress: number): Estimate {
  if (progress >= 1) return { months: 0, basis: 'atteint' };
  const elapsedDays = Math.max(0, (Date.now() - new Date(s.startDate + 'T00:00:00').getTime()) / 86400000);
  const planned = Math.max(0, 15 * MONTH - elapsedDays); // milieu de la cible 12–18 mois
  if (progress >= 0.05 && elapsedDays >= 21) {
    const pace = (elapsedDays * (1 - progress)) / progress;
    const blended = 0.6 * pace + 0.4 * planned;
    return { months: Math.min(24, Math.max(0.5, blended / MONTH)), basis: 'rythme' };
  }
  return { months: Math.max(0.5, planned / MONTH), basis: 'plan' };
}

export const SKILL_LABELS: Record<Skill | 'conditioning', string> = {
  wrestling: 'Wrestling',
  passing: 'Passing',
  guard: 'Guard',
  escapes: 'Escapes',
  submissions: 'Submissions',
  conditioning: 'Conditioning',
};

export function skillScores(s: AppState, js: JournalStats) {
  const skills: Skill[] = ['wrestling', 'passing', 'guard', 'escapes', 'submissions'];
  const res = skills.map((sk) => {
    const items = ALL_TECHNIQUES.filter((t) => t.skills.includes(sk));
    const v = items.reduce((a, t) => a + statusValue(s.techniques[t.id]), 0);
    return { key: sk, skill: SKILL_LABELS[sk], score: Math.round((v / items.length) * 100) };
  });
  const cond = Math.round(100 * (0.6 * Math.min(1, js.hours / 100) + 0.4 * Math.min(1, js.sessionsLast30 / 12)));
  res.push({ key: 'conditioning' as Skill, skill: SKILL_LABELS.conditioning, score: cond });
  return res;
}

export function formatMonths(m: number): string {
  if (m <= 0) return 'Atteint';
  if (m < 1) return `${Math.round(m * 4.35)} sem.`;
  return `${m < 10 ? m.toFixed(1).replace('.', ',') : Math.round(m)} mois`;
}

export function formatHours(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h ? `${h} h ${m.toString().padStart(2, '0')}` : `${m} min`;
}
