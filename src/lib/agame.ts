import { ALL_TECHNIQUES, SUBMISSION_NAMES } from '../data/roadmap';
import type { AppState, Chain } from '../types';
import { statusValue } from './stats';

export const DEFAULT_CHAINS: Chain[] = [
  {
    id: 'main',
    name: 'Chaîne principale',
    weight: 0.5,
    steps: ['Double Leg', 'Knee Cut', 'Side Control', 'Mount', 'Arm Triangle'].map((n, i) => ({ id: `m${i}`, techName: n })),
  },
  {
    id: 'second',
    name: 'Chaîne secondaire',
    weight: 0.3,
    steps: ['Snap Down', 'Front Headlock', 'Guillotine'].map((n, i) => ({ id: `s${i}`, techName: n })),
  },
  {
    id: 'third',
    name: 'Chaîne tertiaire',
    weight: 0.2,
    steps: ['Back Take', 'RNC'].map((n, i) => ({ id: `t${i}`, techName: n })),
  },
];

const ALIASES: Record<string, string[]> = {
  'Snap Down': ['p3-front-headlock', 'p4-sprawl'],
  'Back Take': ['p1-back-control', 'p4-half-guard'],
  'Bridge & Roll': ['p1-bridge-roll'],
  'Body Lock': ['p1-body-lock', 'p4-body-lock-pass'],
};

const baseName = (n: string) => n.replace(/ \(.*\)$/, '');

/** Returns 0..1 mastery of a step, or null when no checklist item tracks it. */
export function stepMastery(s: AppState, name: string): number | null {
  const ids = ALL_TECHNIQUES.filter((t) => baseName(t.name) === name || t.name === name).map((t) => t.id);
  (ALIASES[name] ?? []).forEach((id) => ids.push(id));
  if (!ids.length) return null;
  return Math.max(...ids.map((id) => statusValue(s.techniques[id])));
}

const STYLE_KEYWORDS = ['Double Leg', 'Single Leg', 'Body Lock', 'Sprawl', 'Snap Down', 'Front Headlock', 'Guillotine', 'High Elbow Guillotine', 'Knee Cut', 'Pressure Passing', 'Body Lock Pass', 'Side Control', 'Mount', 'Back Take', 'Back Control', 'RNC', 'Arm Triangle', 'Kimura', 'Chain Wrestling', 'Darce'];

export interface Coherence {
  score: number;
  mastery: number;
  alignment: number;
  structure: number;
  advice: string[];
}

export function coherence(s: AppState, chains: Chain[]): Coherence {
  const totalW = chains.reduce((a, c) => a + c.weight, 0) || 1;
  let mastery = 0;
  let alignedSteps = 0;
  let totalSteps = 0;
  let structOk = 0;
  const advice: string[] = [];

  for (const c of chains) {
    const vals = c.steps.map((st) => stepMastery(s, st.techName) ?? 0);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    mastery += (avg * c.weight) / totalW;
    totalSteps += c.steps.length;
    alignedSteps += c.steps.filter((st) => STYLE_KEYWORDS.includes(st.techName)).length;

    const last = c.steps[c.steps.length - 1]?.techName;
    const endsWithSub = !!last && SUBMISSION_NAMES.includes(last);
    const longEnough = c.steps.length >= 2;
    if (endsWithSub && longEnough) structOk++;
    if (!endsWithSub) advice.push(`${c.name} : termine-la par une soumission.`);
    if (!longEnough) advice.push(`${c.name} : ajoute au moins une étape.`);

    const weakest = c.steps
      .map((st) => ({ name: st.techName, v: stepMastery(s, st.techName) }))
      .filter((x) => x.v !== null && x.v < 1)
      .sort((a, b) => (a.v as number) - (b.v as number))[0];
    if (weakest) advice.push(`${c.name} : maillon faible, ${weakest.name}.`);
  }

  const alignment = totalSteps ? alignedSteps / totalSteps : 0;
  const structure = chains.length ? structOk / chains.length : 0;
  const score = Math.round(100 * (0.6 * mastery + 0.25 * alignment + 0.15 * structure));
  return { score, mastery, alignment, structure, advice: advice.slice(0, 4) };
}
