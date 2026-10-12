import { AnimatePresence, motion } from 'framer-motion';
import { Search, Shuffle, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { TIP_CATEGORIES, TIPS, tipOfTheDay, type TipCategory } from '../data/tips';
import { useStore } from '../store/AppStore';
import { SectionHeader } from './ui';

export function Tips() {
  const { s, toggleFavTip } = useStore();
  const [cat, setCat] = useState<TipCategory | 'all' | 'fav'>('all');
  const [q, setQ] = useState('');
  const [featured, setFeatured] = useState(tipOfTheDay());
  const isToday = featured.id === tipOfTheDay().id;

  const list = useMemo(
    () =>
      TIPS.filter((t) => (cat === 'all' ? true : cat === 'fav' ? s.favTips.includes(t.id) : t.category === cat)).filter((t) =>
        q ? t.text.toLowerCase().includes(q.toLowerCase()) : true,
      ),
    [cat, q, s.favTips],
  );

  const featCat = TIP_CATEGORIES.find((c) => c.id === featured.category)!;

  return (
    <div>
      <SectionHeader eyebrow={`${TIPS.length} conseils · 6 catégories`} title="Tips No-Gi" />

      <div className="glass-hi relative mb-6 overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-6 -top-10 text-[10rem] leading-none opacity-[0.07]">{featCat.icon}</div>
        <p className="label text-accent">
          {isToday ? 'Tip du jour' : 'Tip au hasard'} · {featCat.icon} {featCat.label}
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={featured.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-3 max-w-3xl font-display text-3xl font-semibold leading-tight text-white"
            style={{ textWrap: 'balance' }}
          >
            « {featured.text} »
          </motion.p>
        </AnimatePresence>
        <button className="btn-ghost mt-5" onClick={() => setFeatured(TIPS[Math.floor(Math.random() * TIPS.length)])}>
          <Shuffle size={15} /> Un autre
        </button>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-64">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <label htmlFor="tip-search" className="sr-only">
            Rechercher un tip
          </label>
          <input id="tip-search" className="input pl-9" placeholder="Rechercher…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[{ id: 'all' as const, label: 'Tous', icon: '' }, ...TIP_CATEGORIES, { id: 'fav' as const, label: 'Favoris', icon: '★' }].map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`chip shrink-0 ${cat === c.id ? 'border-secondary/60 bg-primary/20 text-white' : 'border-white/10 text-slate-400 hover:text-slate-200'}`}
            >
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((t) => {
          const c = TIP_CATEGORIES.find((x) => x.id === t.category)!;
          const fav = s.favTips.includes(t.id);
          return (
            <motion.li layout key={t.id} whileHover={{ y: -2 }} className="glass flex gap-3 p-4">
              <span className="text-xl" aria-hidden>
                {c.icon}
              </span>
              <p className="min-w-0 flex-1 text-sm leading-relaxed text-slate-200">{t.text}</p>
              <button
                aria-label={fav ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                aria-pressed={fav}
                onClick={() => toggleFavTip(t.id)}
                className={`h-fit rounded-lg p-1.5 transition ${fav ? 'text-warning' : 'text-slate-600 hover:text-slate-300'}`}
              >
                <Star size={16} fill={fav ? 'currentColor' : 'none'} />
              </button>
            </motion.li>
          );
        })}
      </ul>
      {list.length === 0 && <p className="py-8 text-center text-sm text-slate-400">Aucun tip ne correspond. Essaie un autre mot ou une autre catégorie.</p>}
    </div>
  );
}
