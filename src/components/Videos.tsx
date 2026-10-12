import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';
import { VIDEOS, ytSearch, type VideoLevel } from '../data/videos';
import { useStore } from '../store/AppStore';
import type { VideoFlag } from '../types';
import { SectionHeader } from './ui';

const FLAGS: { id: VideoFlag; icon: string; label: string; on: string }[] = [
  { id: 'seen', icon: '✅', label: 'Vu', on: 'border-success/50 bg-success/15 text-success' },
  { id: 'fav', icon: '⭐', label: 'Favori', on: 'border-warning/50 bg-warning/15 text-warning' },
  { id: 'study', icon: '📚', label: 'À étudier', on: 'border-secondary/50 bg-secondary/15 text-secondary' },
];

const LEVELS: VideoLevel[] = ['Débutant', 'Intermédiaire', 'Avancé'];
const LEVEL_TONE: Record<VideoLevel, string> = {
  Débutant: 'text-success',
  Intermédiaire: 'text-secondary',
  Avancé: 'text-accent',
};

export function Videos() {
  const { s, toggleVideo } = useStore();
  const [flag, setFlag] = useState<VideoFlag | 'all'>('all');
  const seen = VIDEOS.filter((v) => s.videos[v.id]?.includes('seen')).length;

  return (
    <div>
      <SectionHeader eyebrow={`${seen} / ${VIDEOS.length} vues`} title="Vidéothèque">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
          <button onClick={() => setFlag('all')} className={`chip shrink-0 ${flag === 'all' ? 'border-secondary/60 bg-primary/20 text-white' : 'border-white/10 text-slate-400'}`}>
            Toutes
          </button>
          {FLAGS.map((f) => (
            <button key={f.id} onClick={() => setFlag(f.id)} className={`chip shrink-0 ${flag === f.id ? f.on : 'border-white/10 text-slate-400'}`}>
              {f.icon} {f.label}
            </button>
          ))}
        </div>
      </SectionHeader>

      <div className="flex flex-col gap-8">
        {LEVELS.map((lvl) => {
          const items = VIDEOS.filter((v) => v.level === lvl && (flag === 'all' || s.videos[v.id]?.includes(flag)));
          if (!items.length) return null;
          return (
            <section key={lvl}>
              <p className={`label mb-3 ${LEVEL_TONE[lvl]}`}>{lvl}</p>
              <ul className="grid gap-3 md:grid-cols-2">
                {items.map((v) => {
                  const flags = s.videos[v.id] ?? [];
                  return (
                    <motion.li key={v.id} layout whileHover={{ y: -2 }} className={`glass flex flex-col p-4 ${flags.includes('seen') ? 'opacity-80' : ''}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-display text-sm font-semibold uppercase tracking-wider text-slate-400">{v.creator}</p>
                          <p className="mt-0.5 font-semibold text-white">{v.topic}</p>
                          <p className="mt-1 text-sm text-slate-400">{v.why}</p>
                        </div>
                        <a
                          href={ytSearch(v.query)}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 rounded-lg border border-white/10 p-2 text-slate-300 hover:border-secondary/50 hover:text-secondary"
                          aria-label={`Chercher sur YouTube : ${v.topic}`}
                        >
                          <ExternalLink size={15} />
                        </a>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {FLAGS.map((f) => {
                          const on = flags.includes(f.id);
                          return (
                            <button key={f.id} aria-pressed={on} onClick={() => toggleVideo(v.id, f.id)} className={`chip ${on ? f.on : 'border-white/10 text-slate-500 hover:text-slate-300'}`}>
                              {f.icon} {f.label}
                            </button>
                          );
                        })}
                      </div>
                    </motion.li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-slate-500">Les liens ouvrent une recherche YouTube sur le sujet, dans un nouvel onglet.</p>
    </div>
  );
}
