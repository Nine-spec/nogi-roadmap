# 🥋 No-Gi Blue Belt Roadmap

Application React + TypeScript + Tailwind + Framer Motion + Recharts pour suivre ta progression de White Belt à Blue Belt en No-Gi.

## Lancer

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # build de production dans dist/
npm run build:single  # un seul fichier HTML autonome dans dist-single/
```

Node 18+ requis. Les données sont sauvegardées dans le localStorage du navigateur (Réglages → copier/importer une sauvegarde).

## Structure

```
src/
  data/        roadmap (4 phases, 40 techniques, 12 objectifs), 102 tips, vidéothèque, succès
  lib/         xp.ts (niveaux 1→100), stats.ts (progression, estimation, radar), agame.ts (score de cohérence), storage.ts, fx.ts (sons + confettis)
  store/       AppStore.tsx (état global + persistance), demo.ts (données d'exemple)
  components/  Home, Roadmap, AGame, Journal, Tips, Videos, Achievements, Settings, Nav, Overlays
```

## Règles de calcul

- XP : technique maîtrisée +25, soumission maîtrisée +50, séance +10, objectif validé +100. L'XP est recalculée depuis l'état : décocher retire l'XP.
- Niveau : il faut `20 + niveau × 0,6` XP pour passer au suivant (≈ 5 000 XP pour le niveau 100).
- Progression Blue Belt : techniques (en cours = ½) + objectifs comptés double.
- Temps restant : plan de 15 mois au départ, puis mélange 60/40 entre ton rythme réel et le plan après 3 semaines.
- Radar : part de techniques maîtrisées par compétence ; Conditioning = heures de tapis (cible 100 h) + régularité sur 30 jours.
