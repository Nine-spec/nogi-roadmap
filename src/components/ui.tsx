import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function SectionHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="label mb-1 text-secondary">{eyebrow}</p>
        <h2 className="h-section">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export function ProgressBar({
  value,
  className = 'h-2.5',
  color = 'from-primary via-secondary to-accent',
  delay = 0,
}: {
  value: number;
  className?: string;
  color?: string;
  delay?: number;
}) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  return (
    <div className={`relative w-full overflow-hidden rounded-full bg-white/[0.06] ${className}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <motion.div
        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${color}`}
        initial={false}
        animate={{ width: `${pct}%` }}
        transition={{ type: 'spring', stiffness: 80, damping: 20, delay }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.18),transparent)] bg-[length:200%_100%] opacity-40" />
    </div>
  );
}

export function StatTile({
  icon,
  label,
  value,
  sub,
  tone = 'text-secondary',
  i = 0,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: string;
  i?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0.4, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.05 }}
      whileHover={{ y: -3 }}
      className="glass group relative overflow-hidden p-4"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/25" />
      <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] ${tone}`}>{icon}</div>
      <p className="label">{label}</p>
      <p className="num mt-1 text-2xl font-bold text-white">{value}</p>
      {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
    </motion.div>
  );
}

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="glass flex flex-col items-center gap-3 px-6 py-10 text-center">
      <div className="text-3xl">{icon}</div>
      <p className="font-display text-xl font-bold uppercase tracking-wide text-white">{title}</p>
      <div className="max-w-md text-sm text-slate-400">{children}</div>
    </div>
  );
}
