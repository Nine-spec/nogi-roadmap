import { motion } from 'framer-motion';
import { ArrowRight, Pencil, Plus, RotateCcw, X } from 'lucide-react';
import { useState } from 'react';
import { TECH_NAMES } from '../data/roadmap';
import { coherence, DEFAULT_CHAINS, stepMastery } from '../lib/agame';
import { useStore } from '../store/AppStore';
import type { Chain } from '../types';
import { SectionHeader } from './ui';

export function AGame() {
  const { s, setChains } = useStore();
  const [edit, setEdit] = useState(false);
  const chains = s.chains;
  const c = coherence(s, chains);

  const updateChain = (id: string, fn: (c: Chain) => Chain) => setChains(chains.map((x) => (x.id === id ? fn(x) : x)));

  return (
    <div>
      <SectionHeader eyebrow="Ton jeu principal" title="A-Game">
        <div className="flex gap-2">
          <button className="btn-ghost" onClick={() => setChains(DEFAULT_CHAINS)} title="Revenir au gameplan recommandé">
            <RotateCcw size={15} /> Recommandé
          </button>
          <button className={edit ? 'btn-primary' : 'btn-ghost'} onClick={() => setEdit((e) => !e)}>
            <Pencil size={15} /> {edit ? 'Terminer' : 'Modifier'}
          </button>
        </div>
      </SectionHeader>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="glass-hi flex flex-col items-center p-6 text-center">
          <p className="label">Cohérence du gameplan</p>
          <ScoreRing score={c.score} />
          <div className="mt-4 w-full space-y-2 text-left text-xs">
            <Metric label="Maîtrise des maillons" v={c.mastery} weight="60 %" />
            <Metric label="Alignement avec ton style" v={c.alignment} weight="25 %" />
            <Metric label="Chaînes qui finissent" v={c.structure} weight="15 %" />
          </div>
          {c.advice.length > 0 && (
            <ul className="mt-4 w-full space-y-1.5 rounded-xl bg-ink/50 p-3 text-left text-xs text-slate-300">
              {c.advice.map((a) => (
                <li key={a}>→ {a}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {chains.map((ch) => (
            <div key={ch.id} className="glass p-4 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="font-display text-lg font-bold uppercase tracking-wide text-white">{ch.name}</p>
                <span className="num text-xs text-slate-400">poids {Math.round(ch.weight * 100)} %</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {ch.steps.map((st, i) => {
                  const m = stepMastery(s, st.techName);
                  const tone =
                    m === null ? 'border-white/15 text-slate-300' : m >= 1 ? 'border-success/50 bg-success/10 text-success' : m > 0 ? 'border-warning/40 bg-warning/10 text-warning' : 'border-white/10 bg-white/[0.03] text-slate-300';
                  return (
                    <div key={st.id} className="flex items-center gap-2">
                      {i > 0 && <ArrowRight size={16} className="shrink-0 text-secondary/70" />}
                      {edit ? (
                        <div className="flex items-center gap-1">
                          <label className="sr-only" htmlFor={`step-${ch.id}-${st.id}`}>
                            Étape {i + 1}
                          </label>
                          <select
                            id={`step-${ch.id}-${st.id}`}
                            className="input w-auto py-1.5 pr-8"
                            value={st.techName}
                            onChange={(e) =>
                              updateChain(ch.id, (x) => ({ ...x, steps: x.steps.map((y) => (y.id === st.id ? { ...y, techName: e.target.value } : y)) }))
                            }
                          >
                            {TECH_NAMES.map((n) => (
                              <option key={n}>{n}</option>
                            ))}
                          </select>
                          <button
                            aria-label="Retirer l'étape"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-danger/20 hover:text-danger"
                            onClick={() => updateChain(ch.id, (x) => ({ ...x, steps: x.steps.filter((y) => y.id !== st.id) }))}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <motion.span whileHover={{ y: -2 }} className={`chip px-3 py-1.5 text-sm ${tone}`}>
                          {m !== null && m >= 1 ? '✅' : m !== null && m > 0 ? '◐' : '□'} {st.techName}
                        </motion.span>
                      )}
                    </div>
                  );
                })}
                {edit && (
                  <button
                    className="btn-ghost px-3 py-1.5"
                    onClick={() => updateChain(ch.id, (x) => ({ ...x, steps: [...x.steps, { id: `${Date.now()}`, techName: 'RNC' }] }))}
                  >
                    <Plus size={14} /> Étape
                  </button>
                )}
              </div>
            </div>
          ))}
          <p className="text-xs text-slate-500">
            Les maillons prennent la couleur de leur statut dans la roadmap : ✅ maîtrisé, ◐ en cours, □ à travailler.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({ label, v, weight }: { label: string; v: number; weight: string }) {
  return (
    <div>
      <div className="flex justify-between text-slate-400">
        <span>{label}</span>
        <span className="num text-slate-200">
          {Math.round(v * 100)} % <span className="text-slate-500">· {weight}</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-white/[0.06]">
        <motion.div className="h-full rounded-full bg-secondary" initial={false} animate={{ width: `${v * 100}%` }} />
      </div>
    </div>
  );
}

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const circ = 2 * Math.PI * r;
  const color = score >= 75 ? '#22C55E' : score >= 45 ? '#38BDF8' : '#F59E0B';
  return (
    <div className="relative my-4 h-36 w-36">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        <circle cx="64" cy="64" r={r} fill="none" stroke="rgba(148,163,184,.15)" strokeWidth="10" />
        <motion.circle
          cx="64"
          cy="64"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={false}
          animate={{ strokeDashoffset: circ * (1 - score / 100) }}
          transition={{ type: 'spring', stiffness: 60, damping: 18 }}
          style={{ filter: `drop-shadow(0 0 8px ${color}88)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="num text-4xl font-bold text-white">{score}</span>
        <span className="text-[11px] text-slate-400">/ 100</span>
      </div>
    </div>
  );
}
