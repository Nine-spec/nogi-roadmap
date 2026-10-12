import type { AppState, JournalEntry, Status } from '../types';
import { ACHIEVEMENTS } from '../data/achievements';
import { defaultState } from '../lib/storage';
import { blueBeltProgress, journalStats } from '../lib/stats';
import { computeXp, levelFromXp } from '../lib/xp';

const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Example data: ~4 months of training. Clearly labelled as demo in the UI. */
export function buildDemoState(): AppState {
  const base = defaultState();
  const start = new Date();
  start.setDate(start.getDate() - 120);

  const techniques: Record<string, Status> = {
    'p1-closed-guard': 'mastered',
    'p1-half-guard': 'mastered',
    'p1-side-control': 'mastered',
    'p1-mount': 'mastered',
    'p1-back-control': 'mastered',
    'p1-turtle': 'progress',
    'p1-bridge-roll': 'mastered',
    'p1-elbow-escape': 'mastered',
    'p1-side-escape': 'progress',
    'p1-back-escape': 'progress',
    'p1-rnc': 'mastered',
    'p1-guillotine': 'mastered',
    'p1-americana': 'mastered',
    'p1-kimura': 'progress',
    'p1-double-leg': 'mastered',
    'p1-single-leg': 'progress',
    'p1-body-lock': 'mastered',
    'p2-knee-cut': 'progress',
    'p2-hq': 'progress',
    'p2-heg': 'progress',
  };

  const partners = ['Karim', 'Thomas', 'Yassine', 'Lucas', 'Mehdi', 'Antoine'];
  const topics = ['Double leg + passe knee cut', 'Sorties de mount', 'Guillotine depuis sprawl', 'Back takes depuis turtle', 'Half guard top', 'Body lock takedown'];
  const lessons = [
    'Changer de niveau avant de shooter, sinon il sprawl facilement.',
    'Garder les coudes collés sous la mount.',
    'Crossface avant de passer, sinon il récupère la demi-garde.',
    'Respirer et frame au lieu de pousser.',
    'Seatbelt d\'abord, crochets ensuite.',
  ];
  const difficulties = ['Cardio en fin de séance', 'Garde fermée des plus légers', 'Finir le RNC quand il défend les mains', 'Single leg bloqué par le whizzer'];

  const journal: JournalEntry[] = [];
  let k = 0;
  for (let d = 0; d <= 118; d++) {
    const day = new Date(start);
    day.setDate(start.getDate() + d);
    const wd = day.getDay();
    if (![1, 3, 5].includes(wd) && !(wd === 6 && d % 14 === 0)) continue;
    k++;
    const subs = k % 3 === 0 ? 2 : k % 2;
    journal.unshift({
      id: `demo-${k}`,
      date: iso(day),
      duration: wd === 6 ? 120 : 90,
      partners: `${partners[k % partners.length]}, ${partners[(k + 2) % partners.length]}`,
      techniques: topics[k % topics.length],
      submissions: subs,
      submissionTypes: subs ? (k % 4 === 0 ? ['RNC', 'Guillotine'] : ['Americana']) : [],
      takedowns: (k % 3) + (k > 25 ? 2 : 0),
      doubleLegs: k % 3 === 0 ? 1 : 0,
      beatBlueBelt: false,
      difficulties: difficulties[k % difficulties.length],
      lessons: lessons[k % lessons.length],
    });
  }

  const state: AppState = {
    ...base,
    startDate: iso(start),
    techniques,
    objectives: { 'o1-positions': true, 'o1-mount-escape': true, 'o1-double-leg': true },
    journal,
    videos: { 'jt-mount-escape': ['seen'], 'chew-white-belt': ['seen', 'fav'], 'lg-half-guard': ['study'], 'bteam-front-headlock': ['study', 'fav'] },
    favTips: [0, 101, 300],
  };
  // Les succès de la démo ne déclenchent pas de notifications en cascade.
  const js = journalStats(state);
  const level = levelFromXp(computeXp(state).total);
  const progress = blueBeltProgress(state);
  state.seenAchievements = ACHIEVEMENTS.filter((a) => a.check({ s: state, js, level, progress })).map((a) => a.id);
  return state;
}
