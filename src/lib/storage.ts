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
  } catch (err) {
    // Unreadable data would be overwritten by the next save: keep a copy so it can be recovered.
    console.error('Sauvegarde illisible, copie conservée sous', `${KEY}:corrupt`, err);
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) localStorage.setItem(`${KEY}:corrupt`, raw);
    } catch (copyErr) {
      console.error('Copie de la sauvegarde illisible impossible', copyErr);
    }
    return defaultState();
  }
}

/** Ask the browser not to evict our data under storage pressure (best effort, no-op if unsupported). */
export function requestPersistentStorage(): void {
  navigator.storage?.persist?.().catch((err) => console.warn('storage.persist() refusé', err));
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
