import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Clock, Pencil, Plus, Trash2, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { SUBMISSION_NAMES } from '../data/roadmap';
import { formatHours } from '../lib/stats';
import { todayIso } from '../lib/storage';
import { XP } from '../lib/xp';
import { useStore } from '../store/AppStore';
import type { JournalEntry } from '../types';
import { EmptyState, SectionHeader } from './ui';

type Draft = Omit<JournalEntry, 'id'> & { id?: string };

const blank = (): Draft => ({
  date: todayIso(),
  duration: 90,
  partners: '',
  techniques: '',
  submissions: 0,
  submissionTypes: [],
  takedowns: 0,
  doubleLegs: 0,
  beatBlueBelt: false,
  difficulties: '',
  lessons: '',
});

export function Journal() {
  const { s, js, addEntry, updateEntry, deleteEntry } = useStore();
  const [draft, setDraft] = useState<Draft | null>(null);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const weekly = useMemo(() => {
    const weeks: { label: string; min: number }[] = [];
    const now = new Date();
    const monday = new Date(now);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    for (let w = 11; w >= 0; w--) {
      const start = new Date(monday);
      start.setDate(monday.getDate() - w * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);
      const min = s.journal
        .filter((e) => {
          const d = new Date(e.date + 'T12:00:00');
          return d >= start && d < end;
        })
        .reduce((a, e) => a + e.duration, 0);
      weeks.push({ label: `${start.getDate()}/${start.getMonth() + 1}`, min });
    }
    return weeks;
  }, [s.journal]);

  const save = () => {
    if (!draft) return;
    const clean = { ...draft, duration: Math.max(0, Number(draft.duration) || 0) };
    if (clean.id) updateEntry(clean as JournalEntry);
    else addEntry(clean);
    setDraft(null);
  };

  const isDemo = s.journal.some((e) => e.id.startsWith('demo-'));

  return (
    <div>
      <SectionHeader eyebrow={`+${XP.session} XP par séance`} title="Journal">
        {!draft && (
          <button className="btn-primary" onClick={() => setDraft(blank())}>
            <Plus size={16} /> Nouvelle séance
          </button>
        )}
      </SectionHeader>

      {isDemo && (
        <p className="mb-4 rounded-xl border border-warning/30 bg-warning/10 px-4 py-2.5 text-sm text-warning">
          Données d'exemple affichées. Réinitialise-les dans Réglages pour démarrer ton propre suivi.
        </p>
      )}

      <AnimatePresence>
        {draft && (
          <motion.form
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
            className="glass-hi mb-6 grid gap-4 p-5 sm:grid-cols-2"
          >
            <p className="font-display text-xl font-bold uppercase tracking-wide text-white sm:col-span-2">{draft.id ? 'Modifier la séance' : 'Nouvelle séance'}</p>
            <Field id="j-date" label="Date">
              <input id="j-date" type="date" className="input" required value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} />
            </Field>
            <Field id="j-duration" label="Durée (minutes)">
              <input id="j-duration" type="number" min={0} step={5} className="input" value={draft.duration} onChange={(e) => setDraft({ ...draft, duration: Number(e.target.value) })} />
            </Field>
            <Field id="j-partners" label="Partenaires">
              <input id="j-partners" className="input" placeholder="Karim, Thomas…" value={draft.partners} onChange={(e) => setDraft({ ...draft, partners: e.target.value })} />
            </Field>
            <Field id="j-tech" label="Techniques travaillées">
              <input id="j-tech" className="input" placeholder="Double leg → knee cut" value={draft.techniques} onChange={(e) => setDraft({ ...draft, techniques: e.target.value })} />
            </Field>
            <div className="grid grid-cols-3 gap-3 sm:col-span-2">
              <Field id="j-subs" label="Soumissions">
                <input id="j-subs" type="number" min={0} className="input" value={draft.submissions} onChange={(e) => setDraft({ ...draft, submissions: Number(e.target.value) })} />
              </Field>
              <Field id="j-td" label="Takedowns">
                <input id="j-td" type="number" min={0} className="input" value={draft.takedowns} onChange={(e) => setDraft({ ...draft, takedowns: Number(e.target.value) })} />
              </Field>
              <Field id="j-dl" label="Dont double legs">
                <input id="j-dl" type="number" min={0} className="input" value={draft.doubleLegs} onChange={(e) => setDraft({ ...draft, doubleLegs: Number(e.target.value) })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <p className="label mb-2">Soumissions placées</p>
              <div className="flex flex-wrap gap-1.5">
                {SUBMISSION_NAMES.map((n) => {
                  const on = draft.submissionTypes.includes(n);
                  return (
                    <button
                      type="button"
                      key={n}
                      onClick={() =>
                        setDraft({ ...draft, submissionTypes: on ? draft.submissionTypes.filter((x) => x !== n) : [...draft.submissionTypes, n] })
                      }
                      className={`chip ${on ? 'border-accent/60 bg-accent/15 text-accent' : 'border-white/10 text-slate-400 hover:text-slate-200'}`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
            <Field id="j-diff" label="Difficultés rencontrées">
              <textarea id="j-diff" rows={3} className="input" value={draft.difficulties} onChange={(e) => setDraft({ ...draft, difficulties: e.target.value })} />
            </Field>
            <Field id="j-lessons" label="Leçons apprises">
              <textarea id="j-lessons" rows={3} className="input" value={draft.lessons} onChange={(e) => setDraft({ ...draft, lessons: e.target.value })} />
            </Field>
            <label htmlFor="j-blue" className="flex items-center gap-2 text-sm text-slate-300 sm:col-span-2">
              <input id="j-blue" type="checkbox" className="h-4 w-4 accent-[#2563EB]" checked={draft.beatBlueBelt} onChange={(e) => setDraft({ ...draft, beatBlueBelt: e.target.checked })} />
              🦈 J'ai soumis une ceinture bleue
            </label>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button type="submit" className="btn-primary">
                Enregistrer {!draft.id && `(+${XP.session} XP)`}
              </button>
              <button type="button" className="btn-ghost" onClick={() => setDraft(null)}>
                Annuler
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_1.3fr]">
        <div className="glass grid grid-cols-2 gap-4 p-5">
          <Mini label="Temps total" value={formatHours(js.minutes)} />
          <Mini label="Séances" value={js.sessions} />
          <Mini label="Durée moyenne" value={js.sessions ? `${Math.round(js.minutes / js.sessions)} min` : '—'} />
          <Mini label="Soumissions / séance" value={js.sessions ? (js.submissions / js.sessions).toFixed(1).replace('.', ',') : '—'} />
          <Mini label="Série actuelle" value={`${js.currentStreak} j`} />
          <Mini label="Meilleure série" value={`${js.longestStreak} j`} />
        </div>
        <div className="glass p-5">
          <p className="label mb-2">Minutes par semaine · 12 dernières semaines</p>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekly} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#2563EB" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} interval={1} />
                <YAxis tick={{ fill: '#64748B', fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(56,189,248,.08)' }}
                  contentStyle={{ background: '#0F172A', border: '1px solid rgba(56,189,248,.3)', borderRadius: 12, color: '#E2E8F0' }}
                  formatter={(v: number) => [`${v} min`, 'Tapis']}
                  labelFormatter={(l) => `Semaine du ${l}`}
                />
                <Bar dataKey="min" fill="url(#barFill)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {s.journal.length === 0 ? (
        <EmptyState icon="📓" title="Aucune séance enregistrée">
          Après chaque entraînement, note ta durée, tes partenaires, ce que tu as travaillé et ce que tu as appris. Les statistiques se calculent toutes seules.
        </EmptyState>
      ) : (
        <ul className="flex flex-col gap-3">
          {[...s.journal]
            .sort((a, b) => b.date.localeCompare(a.date))
            .map((e) => (
              <motion.li layout key={e.id} className="glass p-4 sm:p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-white">
                      <CalendarDays size={16} className="text-secondary" />
                      {new Date(e.date + 'T12:00:00').toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                    <p className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {e.duration} min
                      </span>
                      {e.partners && (
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {e.partners}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    {confirmDel === e.id ? (
                      <>
                        <button className="btn px-3 py-1.5 bg-danger/20 text-danger hover:bg-danger/30" onClick={() => { deleteEntry(e.id); setConfirmDel(null); }}>
                          Supprimer
                        </button>
                        <button className="btn-ghost px-3 py-1.5" onClick={() => setConfirmDel(null)}>
                          Garder
                        </button>
                      </>
                    ) : (
                      <>
                        <button aria-label="Modifier" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white" onClick={() => setDraft({ ...e })}>
                          <Pencil size={15} />
                        </button>
                        <button aria-label="Supprimer" className="rounded-lg p-2 text-slate-400 hover:bg-danger/15 hover:text-danger" onClick={() => setConfirmDel(e.id)}>
                          <Trash2 size={15} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {e.techniques && <span className="chip border-white/10 text-slate-300">{e.techniques}</span>}
                  {e.submissions > 0 && <span className="chip border-accent/30 bg-accent/10 text-accent">⚔ {e.submissions} soum.</span>}
                  {e.takedowns > 0 && <span className="chip border-warning/30 bg-warning/10 text-warning">{e.takedowns} takedowns</span>}
                  {e.submissionTypes.map((t) => (
                    <span key={t} className="chip border-white/10 text-slate-400">
                      {t}
                    </span>
                  ))}
                  {e.beatBlueBelt && <span className="chip border-primary/50 bg-primary/20 text-secondary">🦈 Blue belt soumise</span>}
                </div>
                {(e.difficulties || e.lessons) && (
                  <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                    {e.difficulties && (
                      <div className="rounded-xl bg-danger/[0.06] p-3">
                        <p className="label mb-1 text-danger/80">Difficultés</p>
                        <p className="text-slate-300">{e.difficulties}</p>
                      </div>
                    )}
                    {e.lessons && (
                      <div className="rounded-xl bg-success/[0.06] p-3">
                        <p className="label mb-1 text-success/80">Leçons</p>
                        <p className="text-slate-300">{e.lessons}</p>
                      </div>
                    )}
                  </div>
                )}
              </motion.li>
            ))}
        </ul>
      )}
    </div>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="label mb-1.5 block">
        {label}
      </label>
      {children}
    </div>
  );
}

function Mini({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="num text-xl font-bold text-white">{value}</p>
    </div>
  );
}
