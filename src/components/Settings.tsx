import { Copy, Database, RotateCcw, Upload, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
import { parseBackup } from '../lib/storage';
import { useStore } from '../store/AppStore';
import { SectionHeader } from './ui';

export function Settings() {
  const { s, saved, setSound, setStartDate, reset, loadDemo, replaceState } = useStore();
  const [confirm, setConfirm] = useState<'reset' | 'demo' | null>(null);
  const [backup, setBackup] = useState('');
  const [msg, setMsg] = useState('');

  const copy = async () => {
    const text = JSON.stringify(s);
    try {
      await navigator.clipboard.writeText(text);
      setMsg('Sauvegarde copiée dans le presse-papiers.');
    } catch {
      setBackup(text);
      setMsg('Copie automatique refusée : sélectionne le texte ci-dessous et copie-le.');
    }
  };

  const importBackup = () => {
    const parsed = parseBackup(backup);
    if (!parsed) {
      setMsg('Ce texte n\'est pas une sauvegarde valide. Colle le contenu complet copié depuis l\'app.');
      return;
    }
    replaceState(parsed);
    setBackup('');
    setMsg('Sauvegarde importée.');
  };

  return (
    <div className="max-w-2xl">
      <SectionHeader eyebrow="Préférences et données" title="Réglages" />
      <div className="flex flex-col gap-4">
        <div className="glass flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-semibold text-white">Sons</p>
            <p className="text-sm text-slate-400">Effets sonores lors des validations, niveaux et succès.</p>
          </div>
          <button className={s.sound ? 'btn-primary' : 'btn-ghost'} onClick={() => setSound(!s.sound)} aria-pressed={s.sound}>
            {s.sound ? <Volume2 size={16} /> : <VolumeX size={16} />} {s.sound ? 'Activés' : 'Coupés'}
          </button>
        </div>

        <div className="glass flex flex-wrap items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <label htmlFor="start-date" className="font-semibold text-white">
              Début de la roadmap
            </label>
            <p className="text-sm text-slate-400">Sert à estimer le temps restant avant la Blue Belt.</p>
          </div>
          <input id="start-date" type="date" className="input w-auto" value={s.startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>

        <div className="glass p-5">
          <p className="font-semibold text-white">Sauvegarde</p>
          <p className="text-sm text-slate-400">
            Tes données restent dans ce navigateur {saved ? '(enregistrées)' : '(stockage local indisponible, rien n\'est conservé)'}. Copie une sauvegarde pour les transférer ailleurs.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn-ghost" onClick={copy}>
              <Copy size={15} /> Copier la sauvegarde
            </button>
            <button className="btn-ghost" onClick={importBackup} disabled={!backup.trim()}>
              <Upload size={15} /> Importer
            </button>
          </div>
          <label htmlFor="backup" className="sr-only">
            Texte de sauvegarde
          </label>
          <textarea id="backup" rows={3} className="input mt-3 font-mono text-xs" placeholder="Colle ici une sauvegarde pour l'importer" value={backup} onChange={(e) => setBackup(e.target.value)} />
          {msg && <p className="mt-2 text-sm text-secondary">{msg}</p>}
        </div>

        <div className="glass p-5">
          <p className="font-semibold text-white">Données</p>
          <p className="text-sm text-slate-400">Charge 4 mois d'exemple pour explorer l'app, ou repars de zéro.</p>
          {confirm ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 p-3">
              <p className="text-sm text-slate-200">Tes données actuelles seront remplacées. Continuer ?</p>
              <button
                className="btn px-3 py-1.5 bg-danger text-white hover:bg-red-500"
                onClick={() => {
                  if (confirm === 'reset') reset();
                  else loadDemo();
                  setConfirm(null);
                }}
              >
                {confirm === 'reset' ? 'Tout effacer' : 'Charger l\'exemple'}
              </button>
              <button className="btn-ghost px-3 py-1.5" onClick={() => setConfirm(null)}>
                Annuler
              </button>
            </div>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="btn-ghost" onClick={() => setConfirm('demo')}>
                <Database size={15} /> Charger l'exemple
              </button>
              <button className="btn-ghost hover:border-danger/50 hover:text-danger" onClick={() => setConfirm('reset')}>
                <RotateCcw size={15} /> Réinitialiser
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
