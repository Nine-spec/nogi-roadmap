import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { useStore } from '../store/AppStore';
import { SectionHeader } from './ui';

export function Achievements() {
  const { s, js, level, progress, unlocked } = useStore();
  const ctx = { s, js, level, progress };
  return (
    <div>
      <SectionHeader eyebrow={`${unlocked.length} / ${ACHIEVEMENTS.length} débloqués`} title="Succès" />
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {ACHIEVEMENTS.map((a, i) => {
          const on = unlocked.some((u) => u.id === a.id);
          const pr = a.progress?.(ctx);
          return (
            <motion.li
              key={a.id}
              initial={{ opacity: 0.4, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ y: -3 }}
              className={`relative overflow-hidden p-5 ${on ? 'glass-hi' : 'glass'}`}
            >
              {on && <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/25 blur-2xl" />}
              <div className="relative flex items-start gap-4">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-3xl ${on ? 'bg-primary/25' : 'bg-white/[0.04] grayscale'}`}>
                  {on ? a.icon : <Lock size={20} className="text-slate-500" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`font-display text-lg font-bold uppercase tracking-wide ${on ? 'text-white' : 'text-slate-300'}`}>
                    {!on && <span className="mr-1 opacity-50">{a.icon}</span>}
                    {a.title}
                  </p>
                  <p className="text-sm text-slate-400">{a.desc}</p>
                  {pr && !on && (
                    <div className="mt-3">
                      <div className="h-1.5 rounded-full bg-white/[0.06]">
                        <div className="h-full rounded-full bg-secondary" style={{ width: `${Math.min(100, (pr[0] / pr[1]) * 100)}%` }} />
                      </div>
                      <p className="num mt-1 text-[11px] text-slate-500">
                        {pr[0]} / {pr[1]}
                      </p>
                    </div>
                  )}
                  {on && <p className="mt-2 text-xs font-semibold text-success">Débloqué</p>}
                </div>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
