# Directives GitHub Copilot pour ng-galien.github.io

Ce dépôt héberge **Chirpy**, un blog Jekyll propulsé par le thème
[jekyll-theme-chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) et
publié via GitHub Pages. L’ensemble du contenu est rédigé en français
(`lang: fr`, `timezone: Europe/Paris`).

## Structure du projet

- Le thème est chargé depuis la gem `jekyll-theme-chirpy`; seules les surcharges
  présentes dans ce dépôt doivent être modifiées.
- `_posts/` accueille les billets du blog (`YYYY-MM-DD-titre.md`).
- `_tabs/` contient les pages statiques affichées dans la barre latérale (À
  propos, Catégories, Tags, Archives). Chaque fichier conserve son front matter
  existant (`layout`, `icon`, `order`).
- `_data/` centralise les données réutilisables (contact, partage).
- `_plugins/posts-lastmod-hook.rb` calcule `last_modified_at` à partir de
  l’historique Git.
- `tools/run.sh` et `tools/test.sh` fournissent respectivement le serveur de dev
  et la validation HTML.

## Rédaction & ton éditorial

- Employer un français clair, accessible, avec un ton professionnel mais
  chaleureux.
- Utiliser le titre du site défini dans `_config.yml` (`title: Chirpy`)
  lorsqu’il faut nommer le blog.
- Préférer des sections courtes avec des listes pour faciliter la lecture.
- Les extraits de code sont formatés en Markdown avec blocs `lang`.

### Pages statiques (\_tabs)

- `_tabs/about.md` présente l’auteur (Alexandre Boyer), le positionnement
  éditorial et les axes principaux du blog. Mettre à jour via des paragraphes et
  sous-titres, sans toucher aux métadonnées en tête de fichier.
- `_tabs/categories.md`, `_tabs/tags.md`, `_tabs/archives.md` offrent chacune un
  court texte d’introduction en français avant le contenu généré par Chirpy.
- Conserver les icônes FontAwesome existantes ; ajuster uniquement le corps
  Markdown.

### Articles de blog

- Front matter minimal recommandé :
  ```yaml
  ---
  title: "Titre de l’article"
  date: 2024-01-01 09:00:00 +0100
  categories: [categorie-principale]
  tags: [mot-cle-1, mot-cle-2]
  ---
  ```
- Les billets doivent inclure une introduction, un développement structuré et
  une courte conclusion.
- Ajouter des images locales dans `assets/img/` et les référencer via des
  chemins relatifs.

## Développement & déploiement

- **Local** : lancer le serveur avec `./tools/run.sh` (option `-p` pour simuler
  la prod, `-H 0.0.0.0` pour exposer sur le réseau). Le script se charge
  d’invoquer Bundler et Jekyll.
- **Tests** : `./tools/test.sh` réalise un build production et lance
  `html-proofer` via Bundler.
- **CI/CD** : Le workflow `.github/workflows/pages-deploy.yml` build le site,
  l’analyse avec `html-proofer`, puis déploie sur GitHub Pages à chaque push sur
  `main` ou `master`.

## Bonnes pratiques

- Ne jamais retirer la ligne `theme: jekyll-theme-chirpy` de `_config.yml`.
- Respecter les exclusions déjà définies dans `_config.yml` (`exclude`).
- Lorsque de nouvelles pages ou posts sont ajoutés, vérifier que les URL
  générées suivent la convention `/posts/:title/`.
- Pour les intégrations sociales, utiliser les clés déjà présentes (`github`,
  `twitter`, `social`).

Ces instructions guident Copilot afin qu’il génère du contenu cohérent avec
l’identité francophone du blog et la structure Chirpy.
