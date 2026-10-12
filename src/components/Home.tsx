import { motion } from 'framer-motion';
import { Clock, Dumbbell, Flame, Hourglass, Swords, Target, Trophy, Zap } from 'lucide-react';
import { useStore } from '../store/AppStore';
import { estimateRemaining, formatHours, formatMonths, phaseProgress, rankLabel } from '../lib/stats';
import { MAX_LEVEL, XP } from '../lib/xp';
import { PHASES } from '../data/roadmap';
import { TIP_CATEGORIES, tipOfTheDay } from '../data/tips';
import { Belt } from './Belt';
import { SkillRadar } from './SkillRadar';
import { ProgressBar, StatTile } from './ui';
import type { Page } from './Nav';

export function Home({ go }: { go: (p: Page) => void }) {
  const { s, xp, level, js, progress, unlocked } = useStore();
  const est = estimateRemaining(s, progress);
  const pct = Math.round(progress * 100);
  const tip = tipOfTheDay();
  const tipCat = TIP_CATEGORIES.find((c) => c.id === tip.category)!;
  const currentPhase = PHASES.find((p) => phaseProgress(s, p.id) < 1) ?? PHASES[PHASES.length - 1];

  return (
    <div className="flex flex-col gap-6">
      {/* HERO */}
      <section className="glass-hi relative overflow-hidden p-5 sm:p-8">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full bg-gradient-to-r from-transparent via-secondary/60 to-transparent" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div className="min-w-0">
            <p className="label mb-3 text-accent">Roadmap No-Gi · 93 kg · 180 cm</p>
            <motion.h1
              initial={{ opacity: 0.3, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-[2.6rem] font-extrabold uppercase leading-[0.92] tracking-tight text-white sm:text-6xl"
              style={{ textWrap: 'balance' }}
            >
              <span className="mr-2">🥋</span>No-Gi <span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">Blue Belt</span> Roadmap
            </motion.h1>
            <p className="mt-4 max-w-xl text-base text-slate-300">
              Transforme-toi de White Belt débutant en Blue Belt dangereuse grâce à une méthode structurée.
            </p>
            <div className="mt-6">
              <Belt progress={progress} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HeroFact icon={<Target size={16} />} label="Objectif final" value="Blue Belt" sub="Wrestling + pressure" />
            <HeroFact icon={<Hourglass size={16} />} label="Temps restant" value={formatMonths(est.months)} sub={est.basis === 'rythme' ? 'selon ton rythme' : est.basis === 'plan' ? 'selon le plan 12–18 mois' : 'objectif atteint'} />
            <HeroFact icon={<Zap size={16} />} label="XP total" value={xp.total.toLocaleString('fr-BE')} sub={`Niveau ${level.level}`} />
            <HeroFact icon={<Flame size={16} />} label="Séances" value={js.sessions} sub={js.currentStreak > 1 ? `série de ${js.currentStreak} j` : 'réalisées'} />
          </div>
        </div>
      </section>

      {/* LEVEL + GLOBAL PROGRESS */}
      <section className="grid gap-4 lg:grid-cols-2 lg:items-start">
        <div className="glass p-5">
          <div className="flex items-center gap-4">
            <motion.div
              key={level.level}
              initial={{ scale: 0.7, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-glow"
            >
              <span className="num text-2xl font-bold text-white">{level.level}</span>
            </motion.div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-xl font-bold uppercase tracking-wide text-white">Niveau {level.level}</p>
                <p className="num text-xs text-slate-400">
                  {level.level < MAX_LEVEL ? `${level.into} / ${level.need} XP` : 'MAX'}
                </p>
              </div>
              <ProgressBar value={level.pct} className="mt-2 h-3" />
              <p className="mt-2 text-xs text-slate-400">
                <span className="num text-slate-200">{xp.total}</span> XP au total · niveau max {MAX_LEVEL}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
            {[
              ['Technique', `+${XP.technique}`],
              ['Soumission', `+${XP.submission}`],
              ['Séance', `+${XP.session}`],
              ['Objectif', `+${XP.objective}`],
            ].map(([k, v]) => (
              <div key={k} className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-2">
                <p className="text-slate-400">{k}</p>
                <p className="num font-bold text-secondary">{v} XP</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-5">
          <div className="flex items-center justify-between">
            <p className="label">Progression globale</p>
            <span className="rounded-full bg-primary/15 px-2.5 py-1 text-xs font-semibold text-secondary">{rankLabel(progress)}</span>
          </div>
          <p className="num mt-2 text-5xl font-bold text-white">
            {pct}
            <span className="text-2xl text-slate-400"> %</span>
          </p>
          <ProgressBar value={progress} className="mt-3 h-4" />
          <div className="mt-5 grid grid-cols-4 gap-2">
            {PHASES.map((p) => {
              const pp = phaseProgress(s, p.id);
              return (
                <button key={p.id} onClick={() => go('roadmap')} className="group text-left">
                  <ProgressBar value={pp} className="h-1.5" color={pp >= 1 ? 'from-success to-success' : undefined} />
                  <p className="mt-1.5 font-display text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-secondary">Phase {p.num}</p>
                  <p className="num text-[11px] text-slate-500">{Math.round(pp * 100)} %</p>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-slate-300">
            En cours : <b className="text-white">Phase {currentPhase.num}</b> · {currentPhase.tagline}
          </p>
        </div>
      </section>

      {/* WIDGETS */}
      <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <StatTile i={0} icon={<Clock size={18} />} label="Temps sur les tapis" value={formatHours(js.minutes)} sub={`${Math.round(js.hours)} / 100 h pour ⚡`} />
        <StatTile i={1} icon={<Dumbbell size={18} />} label="Séances" value={js.sessions} sub={`${js.sessionsLast30} ces 30 derniers jours`} />
        <StatTile i={2} icon={<Swords size={18} />} label="Soumissions" value={js.submissions} sub="réussies en rolling" tone="text-accent" />
        <StatTile i={3} icon={<Trophy size={18} />} label="Takedowns" value={js.takedowns} sub={`dont ${js.doubleLegs} double legs`} tone="text-warning" />
        <StatTile i={4} icon={<Hourglass size={18} />} label="Avant Blue Belt" value={formatMonths(est.months)} sub={est.basis === 'rythme' ? 'estimé sur ton rythme' : 'estimé sur le plan'} tone="text-success" />
      </section>

      {/* RADAR + TIP */}
      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <SkillRadar />
        <div className="flex flex-col gap-4">
          <div className="glass relative overflow-hidden p-5">
            <div className="pointer-events-none absolute -bottom-10 -right-10 text-[9rem] leading-none opacity-[0.06]">{tipCat.icon}</div>
            <p className="label text-accent">Tip du jour · {tipCat.icon} {tipCat.label}</p>
            <p className="mt-3 font-display text-2xl font-semibold leading-tight text-white" style={{ textWrap: 'balance' }}>
              « {tip.text} »
            </p>
            <button className="btn-ghost mt-4" onClick={() => go('tips')}>
              Voir les {`100+`} tips
            </button>
          </div>
          <div className="glass p-5">
            <div className="flex items-center justify-between">
              <p className="label">Succès</p>
              <button className="text-xs text-secondary hover:underline" onClick={() => go('achievements')}>
                Tout voir
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {unlocked.length ? (
                unlocked.map((a) => (
                  <span key={a.id} title={a.title} className="chip border-secondary/30 bg-primary/10 text-slate-100">
                    {a.icon} {a.title}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">Enregistre ta première séance pour débloquer 🥋 Premier pas.</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroFact({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: React.ReactNode; sub: string }) {
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-white/10 bg-ink/50 p-4 backdrop-blur">
      <div className="flex items-center gap-1.5 text-secondary">
        {icon}
        <span className="label text-[0.7rem]">{label}</span>
      </div>
      <p className="num mt-2 text-xl font-bold text-white sm:text-2xl">{value}</p>
      <p className="mt-0.5 text-[11px] text-slate-400">{sub}</p>
    </motion.div>
  );
}
