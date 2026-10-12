# No-Gi Blue Belt Roadmap — instructions de déploiement

App React/Vite statique, servie par nginx dans Docker. Aucune base de données : les données sont dans le localStorage du navigateur.

## Déploiement (choisi le 12/10/2026) : GitHub Pages, comme « Objectifs »
- Dépôt public `Nine-spec/nogi-roadmap`, branche `main` → https://nine-spec.github.io/nogi-roadmap/
- Le workflow `.github/workflows/deploy.yml` build (`npm run build`) et publie `dist/` à chaque push sur `main` (~1-2 min).
  Réglage requis une fois : Settings → Pages → Source = **GitHub Actions**.
- `vite.config.ts` utilise `base: './'` et le manifeste des chemins relatifs : ne pas remettre de chemins absolus (`/icon…`), ils casseraient sous `/nogi-roadmap/`.
- **Ne jamais renommer le dépôt** : l'URL change → les données localStorage de l'iPhone sont perdues.
- Les fichiers Docker (`Dockerfile`, `docker-compose.yml`, `nginx.conf`) restent utilisables pour un hébergement sur le serveur home-it, mais ne sont pas le déploiement actif.

## Mise à jour plus tard
Modifier, `npm run build` en local pour vérifier, puis commit + push sur `main`.

## Sur l'iPhone
Ouvrir l'URL dans Safari → Partager → « Sur l'écran d'accueil ». L'app s'ouvre en plein écran avec son icône.
Les données vivent dans l'app ajoutée à l'écran d'accueil (Réglages → Copier/Importer la sauvegarde pour les transférer).
