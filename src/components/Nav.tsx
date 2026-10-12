import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Award, Gamepad2, Home, Lightbulb, Map, MoreHorizontal, Settings, Video } from 'lucide-react';
import { useState } from 'react';
import { useStore } from '../store/AppStore';
import { MAX_LEVEL } from '../lib/xp';

export type Page = 'home' | 'roadmap' | 'agame' | 'journal' | 'tips' | 'videos' | 'achievements' | 'settings';

export const NAV: { id: Page; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'Accueil', icon: Home },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'journal', label: 'Journal', icon: BookOpen },
  { id: 'agame', label: 'A-Game', icon: Gamepad2 },
  { id: 'tips', label: 'Tips', icon: Lightbulb },
  { id: 'videos', label: 'Vidéos', icon: Video },
  { id: 'achievements', label: 'Succès', icon: Award },
  { id: 'settings', label: 'Réglages', icon: Settings },
];

export function Sidebar({ page, go }: { page: Page; go: (p: Page) => void }) {
  const { level, progress } = useStore();
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r border-white/[0.06] bg-card/40 px-4 py-6 backdrop-blur-xl lg:flex">
      <button onClick={() => go('home')} className="flex items-center gap-3 px-2 text-left">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-xl shadow-glow">🥋</div>
        <div>
          <p className="font-display text-lg font-extrabold uppercase leading-none tracking-wide text-white">No-Gi</p>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-secondary">Blue Belt</p>
        </div>
      </button>

      <nav className="flex flex-col gap-1">
        {NAV.map((n) => {
          const active = page === n.id;
          const Icon = n.icon;
          return (
            <button
              key={n.id}
              onClick={() => go(n.id)}
              className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? 'text-white' : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'}`}
              aria-current={active ? 'page' : undefined}
            >
              {active && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl border border-secondary/25 bg-primary/15 shadow-glow" />}
              <Icon size={18} className="relative" />
              <span className="relative">{n.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-2xl border border-white/[0.07] bg-ink/60 p-4">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-sm font-bold uppercase tracking-wider text-white">Niv. {level.level}</p>
          <p className="num text-[11px] text-slate-500">/ {MAX_LEVEL}</p>
        </div>
        <div className="mt-2 h-1.5 rounded-full bg-white/[0.06]">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" initial={false} animate={{ width: `${level.pct * 100}%` }} />
        </div>
        <p className="mt-3 text-xs text-slate-400">
          <span className="num text-secondary">{Math.round(progress * 100)} %</span> vers la Blue Belt
        </p>
      </div>
    </aside>
  );
}

const MOBILE_MAIN: Page[] = ['home', 'roadmap', 'journal', 'agame'];

export function BottomBar({ page, go }: { page: Page; go: (p: Page) => void }) {
  const [more, setMore] = useState(false);
  const extra = NAV.filter((n) => !MOBILE_MAIN.includes(n.id));
  const moreActive = !MOBILE_MAIN.includes(page);
  return (
    <>
      <AnimatePresence>
        {more && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-ink/60 backdrop-blur-sm lg:hidden" onClick={() => setMore(false)} />
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="glass fixed inset-x-4 z-50 grid grid-cols-2 gap-2 p-3 lg:hidden"
              style={{ bottom: 'calc(84px + env(safe-area-inset-bottom, 0px))' }}
            >
              {extra.map((n) => {
                const Icon = n.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => {
                      go(n.id);
                      setMore(false);
                    }}
                    className={`flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium ${page === n.id ? 'bg-primary/20 text-white' : 'text-slate-300 hover:bg-white/5'}`}
                  >
                    <Icon size={18} /> {n.label}
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <nav
        className="fixed inset-x-0 bottom-0 z-50 border-t border-white/[0.08] bg-card/85 backdrop-blur-xl lg:hidden"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {MOBILE_MAIN.map((id) => {
            const n = NAV.find((x) => x.id === id)!;
            const Icon = n.icon;
            const active = page === id;
            return (
              <button key={id} onClick={() => go(id)} className={`relative flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${active ? 'text-secondary' : 'text-slate-500'}`} aria-current={active ? 'page' : undefined}>
                {active && <motion.span layoutId="tab-active" className="absolute top-0 h-0.5 w-8 rounded-full bg-secondary shadow-[0_0_12px_#38BDF8]" />}
                <Icon size={20} />
                {n.label}
              </button>
            );
          })}
          <button onClick={() => setMore((m) => !m)} className={`flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${moreActive || more ? 'text-secondary' : 'text-slate-500'}`} aria-expanded={more}>
            <MoreHorizontal size={20} />
            Plus
          </button>
        </div>
      </nav>
    </>
  );
}
