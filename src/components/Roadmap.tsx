import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Flag } from 'lucide-react';
import { useState } from 'react';
import { PHASES } from '../data/roadmap';
import { phaseProgress } from '../lib/stats';
import { XP } from '../lib/xp';
import { useStore } from '../store/AppStore';
import type { Status, Technique } from '../types';
import { ProgressBar, SectionHeader } from './ui';

type Filter = 'all' | Status;

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'Tout' },
  { id: 'none', label: '□ Non acquises' },
  { id: 'progress', label: '◐ En cours' },
  { id: 'mastered', label: '✅ Maîtrisées' },
];

export function Roadmap() {
  const { s } = useStore();
  const firstOpen = PHASES.find((p) => phaseProgress(s, p.id) < 1)?.id ?? 'p4';
  const [open, setOpen] = useState<string[]>([firstOpen]);
  const [filter, setFilter] = useState<Filter>('all');
  const toggle = (id: string) => setOpen((o) => (o.includes(id) ? o.filter((x) => x !== id) : [...o, id]));

  return (
    <div>
      <SectionHeader eyebrow="12 à 18 mois · 4 phases" title="La Roadmap">
        <div className="flex max-w-full gap-1.5 overflow-x-auto scrollbar-none">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`chip shrink-0 ${filter === f.id ? 'border-secondary/60 bg-primary/20 text-white' : 'border-white/10 text-slate-400 hover:text-slate-200'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </SectionHeader>

      <ol className="relative flex flex-col gap-5 pl-8 sm:pl-12">
        <div className="pointer-events-none absolute bottom-4 left-[11px] top-4 w-[2px] bg-gradient-to-b from-secondary via-primary/50 to-white/5 sm:left-[19px]" />
        {PHASES.map((p) => {
          const pp = phaseProgress(s, p.id);
          const done = pp >= 1;
          const isOpen = open.includes(p.id);
          return (
            <li key={p.id} className="relative">
              <div
                className={`absolute -left-8 top-5 flex h-6 w-6 items-center justify-center rounded-full border-2 sm:-left-12 sm:h-10 sm:w-10 ${
                  done ? 'border-success bg-success/20 text-success' : pp > 0 ? 'border-secondary bg-primary/30 text-white shadow-glow' : 'border-white/20 bg-card text-slate-400'
                }`}
              >
                {done ? <Check size={14} /> : <span className="num text-[10px] font-bold sm:text-sm">{p.num}</span>}
              </div>

              <div className={`glass overflow-hidden ${isOpen ? 'border-secondary/20' : ''}`}>
                <button onClick={() => toggle(p.id)} className="flex w-full items-center gap-4 p-4 text-left sm:p-5" aria-expanded={isOpen}>
                  <div className="min-w-0 flex-1">
                    <p className="label text-secondary">
                      Phase {p.num} · {p.months}
                    </p>
                    <p className="font-display text-2xl font-bold uppercase tracking-wide text-white">{p.title}</p>
                    <p className="mt-0.5 text-sm text-slate-400">{p.tagline}</p>
                    <div className="mt-3 flex items-center gap-3">
                      <ProgressBar value={pp} className="h-2" color={done ? 'from-success to-emerald-400' : undefined} />
                      <span className="num w-10 shrink-0 text-right text-xs text-slate-300">{Math.round(pp * 100)}%</span>
                    </div>
                  </div>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="shrink-0 text-slate-400">
                    <ChevronDown />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="grid gap-5 border-t border-white/5 p-4 sm:p-5 md:grid-cols-2">
                        {p.groups.map((g) => {
                          const items = g.items.filter((it) => filter === 'all' || (s.techniques[it.id] ?? 'none') === filter);
                          if (!items.length) return null;
                          return (
                            <div key={g.label} className="min-w-0">
                              <p className="label mb-2">{g.label}</p>
                              <ul className="flex flex-col gap-2">
                                {items.map((it) => (
                                  <TechniqueRow key={it.id} tech={it} />
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                        <div className="min-w-0 md:col-span-2">
                          <p className="label mb-2 flex items-center gap-1.5 text-warning">
                            <Flag size={13} /> Validation · +{XP.objective} XP chacun
                          </p>
                          <ul className="grid gap-2 sm:grid-cols-2">
                            {p.objectives.map((o) => (
                              <ObjectiveRow key={o.id} id={o.id} label={o.label} />
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

const STATES: { id: Status; sym: string; label: string; cls: string }[] = [
  { id: 'none', sym: '□', label: 'Non acquise', cls: 'bg-white/10 text-slate-200' },
  { id: 'progress', sym: '◐', label: 'En cours', cls: 'bg-warning/20 text-warning' },
  { id: 'mastered', sym: '✓', label: 'Maîtrisée', cls: 'bg-success/20 text-success' },
];

function TechniqueRow({ tech }: { tech: Technique }) {
  const { s, setTechnique } = useStore();
  const st = s.techniques[tech.id] ?? 'none';
  const xp = tech.kind === 'submission' ? XP.submission : XP.technique;
  return (
    <motion.li
      layout
      className={`rounded-xl border p-3 transition ${
        st === 'mastered' ? 'border-success/30 bg-success/[0.06]' : st === 'progress' ? 'border-warning/25 bg-warning/[0.05]' : 'border-white/5 bg-white/[0.02] hover:border-white/15'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-slate-100">
            {tech.name}
            {tech.kind === 'submission' && <span className="ml-1.5 text-xs text-accent">⚔</span>}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-slate-400">{tech.cue}</p>
        </div>
        <span className={`num shrink-0 text-[11px] ${st === 'mastered' ? 'text-success' : 'text-slate-500'}`}>+{xp}</span>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-1 rounded-lg bg-ink/60 p-1" role="radiogroup" aria-label={`Statut ${tech.name}`}>
        {STATES.map((x) => (
          <button
            key={x.id}
            role="radio"
            aria-checked={st === x.id}
            onClick={() => setTechnique(tech.id, x.id)}
            className={`rounded-md px-1 py-1.5 text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary/60 ${
              st === x.id ? x.cls : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            {x.sym} {x.label}
          </button>
        ))}
      </div>
    </motion.li>
  );
}

function ObjectiveRow({ id, label }: { id: string; label: string }) {
  const { s, toggleObjective } = useStore();
  const on = !!s.objectives[id];
  return (
    <li>
      <button
        onClick={() => toggleObjective(id)}
        className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm transition ${
          on ? 'border-success/40 bg-success/10 text-white' : 'border-white/10 bg-white/[0.02] text-slate-300 hover:border-warning/40'
        }`}
        aria-pressed={on}
      >
        <motion.span
          animate={{ scale: on ? [1, 1.25, 1] : 1 }}
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border ${on ? 'border-success bg-success text-ink' : 'border-white/25'}`}
        >
          {on && <Check size={14} strokeWidth={3} />}
        </motion.span>
        <span className="min-w-0 flex-1">{label}</span>
      </button>
    </li>
  );
}
