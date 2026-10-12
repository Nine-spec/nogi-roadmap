import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { AppState, Chain, JournalEntry, Status, VideoFlag } from '../types';
import { defaultState, loadState, saveState, todayIso } from '../lib/storage';
import { computeXp, levelFromXp, type LevelInfo, type XpBreakdown } from '../lib/xp';
import { blueBeltProgress, journalStats, type JournalStats } from '../lib/stats';
import { ACHIEVEMENTS, type Achievement } from '../data/achievements';
import { playSfx } from '../lib/fx';
import { buildDemoState } from './demo';

interface Derived {
  xp: XpBreakdown;
  level: LevelInfo;
  js: JournalStats;
  progress: number;
  unlocked: Achievement[];
}

interface Store extends Derived {
  s: AppState;
  saved: boolean;
  setTechnique: (id: string, st: Status) => void;
  cycleTechnique: (id: string) => void;
  toggleObjective: (id: string) => void;
  addEntry: (e: Omit<JournalEntry, 'id'>) => void;
  updateEntry: (e: JournalEntry) => void;
  deleteEntry: (id: string) => void;
  toggleVideo: (id: string, f: VideoFlag) => void;
  setChains: (c: Chain[]) => void;
  toggleFavTip: (id: number) => void;
  setSound: (on: boolean) => void;
  setStartDate: (d: string) => void;
  markAchievementsSeen: (ids: string[]) => void;
  markBeltCelebrated: () => void;
  replaceState: (s: AppState) => void;
  reset: () => void;
  loadDemo: () => void;
}

const Ctx = createContext<Store | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<AppState>(loadState);
  const [saved, setSaved] = useState(true);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    setSaved(saveState(s));
  }, [s]);

  const derived = useMemo<Derived>(() => {
    const xp = computeXp(s);
    const level = levelFromXp(xp.total);
    const js = journalStats(s);
    const progress = blueBeltProgress(s);
    const unlocked = ACHIEVEMENTS.filter((a) => a.check({ s, js, level, progress }));
    return { xp, level, js, progress, unlocked };
  }, [s]);

  const patch = useCallback((fn: (p: AppState) => AppState) => setS((p) => fn(p)), []);

  const setTechnique = useCallback(
    (id: string, st: Status) => {
      patch((p) => ({ ...p, techniques: { ...p.techniques, [id]: st } }));
      playSfx(st === 'mastered' ? 'master' : 'tick', s.sound);
    },
    [patch, s.sound],
  );

  const cycleTechnique = useCallback(
    (id: string) => {
      const cur = s.techniques[id] ?? 'none';
      const next: Status = cur === 'none' ? 'progress' : cur === 'progress' ? 'mastered' : 'none';
      setTechnique(id, next);
    },
    [s.techniques, setTechnique],
  );

  const store: Store = {
    s,
    saved,
    ...derived,
    setTechnique,
    cycleTechnique,
    toggleObjective: (id) => {
      const on = !s.objectives[id];
      patch((p) => ({ ...p, objectives: { ...p.objectives, [id]: on } }));
      playSfx(on ? 'master' : 'tick', s.sound);
    },
    addEntry: (e) => {
      patch((p) => ({ ...p, journal: [{ ...e, id: crypto.randomUUID?.() ?? String(Date.now()) }, ...p.journal] }));
      playSfx('master', s.sound);
    },
    updateEntry: (e) => patch((p) => ({ ...p, journal: p.journal.map((x) => (x.id === e.id ? e : x)) })),
    deleteEntry: (id) => patch((p) => ({ ...p, journal: p.journal.filter((x) => x.id !== id) })),
    toggleVideo: (id, f) =>
      patch((p) => {
        const cur = p.videos[id] ?? [];
        const next = cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f];
        return { ...p, videos: { ...p.videos, [id]: next } };
      }),
    setChains: (chains) => patch((p) => ({ ...p, chains })),
    toggleFavTip: (id) =>
      patch((p) => ({ ...p, favTips: p.favTips.includes(id) ? p.favTips.filter((x) => x !== id) : [...p.favTips, id] })),
    setSound: (on) => {
      patch((p) => ({ ...p, sound: on }));
      playSfx('tick', on);
    },
    setStartDate: (d) => patch((p) => ({ ...p, startDate: d || todayIso() })),
    markAchievementsSeen: (ids) =>
      patch((p) => ({ ...p, seenAchievements: Array.from(new Set([...p.seenAchievements, ...ids])) })),
    markBeltCelebrated: () => patch((p) => ({ ...p, celebratedBlueBelt: true })),
    replaceState: (n) => setS(n),
    reset: () => setS(defaultState()),
    loadDemo: () => setS(buildDemoState()),
  };

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>;
}

export function useStore(): Store {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore doit être utilisé dans AppStoreProvider');
  return c;
}
