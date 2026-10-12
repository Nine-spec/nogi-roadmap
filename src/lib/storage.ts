import type { AppState } from '../types';
import { DEFAULT_CHAINS } from './agame';

const KEY = 'nogi-blue-belt-roadmap:v1';

export const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const defaultState = (): AppState => ({
  version: 1,
  startDate: todayIso(),
  techniques: {},
  objectives: {},
  journal: [],
  videos: {},
  chains: DEFAULT_CHAINS,
  seenAchievements: [],
  favTips: [],
  sound: false,
  celebratedBlueBelt: false,
});

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return { ...defaultState(), ...parsed, version: 1 };
  } catch {
    return defaultState();
  }
}

export function saveState(s: AppState): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
    return true;
  } catch {
    return false;
  }
}

export function parseBackup(text: string): AppState | null {
  try {
    const parsed = JSON.parse(text) as Partial<AppState>;
    if (typeof parsed !== 'object' || !parsed || !Array.isArray(parsed.journal)) return null;
    return { ...defaultState(), ...parsed, version: 1 };
  } catch {
    return null;
  }
}
