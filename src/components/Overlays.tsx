import { AnimatePresence, motion } from 'framer-motion';
import type { Achievement } from '../data/achievements';

export function LevelUpModal({ level, onClose }: { level: number | null; onClose: () => void }) {
  return (
    <AnimatePresence>
      {level !== null && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 p-6 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.6, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="glass-hi relative w-full max-w-sm overflow-hidden p-8 text-center"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Niveau supérieur"
          >
            <motion.div
              className="pointer-events-none absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(56,189,248,.25),transparent_30%)]"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            />
            <p className="label relative text-accent">Level up</p>
            <motion.p
              initial={{ scale: 0.3 }}
              animate={{ scale: [0.3, 1.25, 1] }}
              transition={{ duration: 0.6 }}
              className="num relative mt-2 bg-gradient-to-b from-white to-secondary bg-clip-text text-8xl font-bold text-transparent"
            >
              {level}
            </motion.p>
            <p className="relative mt-2 text-slate-300">Continue comme ça. Chaque niveau te rapproche de la bleue.</p>
            <button className="btn-primary relative mt-6 w-full" onClick={onClose}>
              Retour au tapis
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function BlueBeltModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/75 p-6 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="glass-hi w-full max-w-md p-8 text-center"
            role="dialog"
            aria-label="Blue Belt"
          >
            <p className="text-6xl">💙</p>
            <p className="mt-3 font-display text-5xl font-extrabold uppercase tracking-tight text-white">Blue Belt</p>
            <p className="mt-3 text-slate-300">Roadmap terminée à 100 %. Tu as construit un vrai jeu : lutte, pression, front headlock et finitions.</p>
            <button className="btn-primary mt-6 w-full" onClick={onClose}>
              Fermer
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AchievementToasts({ items, onDone }: { items: Achievement[]; onDone: (id: string) => void }) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-[min(360px,calc(100vw-32px))] flex-col gap-2" style={{ top: 'calc(16px + env(safe-area-inset-top, 0px))' }}>
      <AnimatePresence>
        {items.map((a) => (
          <motion.button
            key={a.id}
            layout
            initial={{ x: 80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 80, opacity: 0 }}
            onClick={() => onDone(a.id)}
            className="glass-hi pointer-events-auto flex items-center gap-3 p-3 text-left"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/25 text-2xl">{a.icon}</span>
            <span className="min-w-0">
              <span className="label block text-accent">Succès débloqué</span>
              <span className="block font-display text-lg font-bold uppercase tracking-wide text-white">{a.title}</span>
            </span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
}
