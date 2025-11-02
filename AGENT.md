# Instructions Agent

Ces consignes servent de mémo lorsque j’interviens sur le dépôt
`ng-galien.github.io`.

## Principes généraux

- Produire les contenus éditoriaux en français, dans un ton clair et direct.
- Utiliser le titre du site défini dans `_config.yml` (actuellement `Chirpy`)
  pour nommer le blog dans les textes.
- Respecter les front matters existants et ne pas modifier la structure générée
  par le thème Chirpy sans raison explicite.
- S'appuyer sur les scripts fournis dans `tools/` pour lancer le serveur et les
  tests plutôt que des commandes manuelles.

## Gestion des contenus

- Les pages statiques se trouvent dans `_tabs/` : ne changer que le corps
  Markdown.
- Les billets de blog doivent suivre le schéma `YYYY-MM-DD-titre.md` et inclure
  `title`, `date`, `categories`, `tags`.
- Les ressources partagées (images, assets) vont dans `assets/` avec un chemin
  relatif depuis le Markdown.

## Flux de travail

1. Avant toute modification, lire `git status` pour identifier l’état du dépôt.
2. Démarrer le site via `./tools/run.sh` (options `-p`, `-H`) et valider les
   builds avec `./tools/test.sh`, qui encapsulent l’appel à Bundler.
3. Éviter les commandes destructrices (`git reset --hard`, `rm -rf`) sans
   validation explicite.
4. Après modifications, relire les fichiers modifiés et vérifier la cohérence
   linguistique.

## Documentation & automatisation

- Le workflow GitHub Pages se trouve dans `.github/workflows/pages-deploy.yml`.
- Les scripts utiles sont dans `tools/`.
- Maintenir `AGENT.md` à jour si de nouvelles pratiques sont ajoutées.

Ces repères garantissent des interventions cohérentes avec l’identité du blog et
son pipeline de déploiement.
