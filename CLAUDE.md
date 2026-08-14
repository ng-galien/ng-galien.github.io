# CLAUDE.md — Blog ng-galien.github.io

Blog Jekyll personnel d'Alexandre Boyer (thème **Chirpy**), publié sur GitHub Pages : https://ng-galien.github.io.
Langue par défaut : `fr` · Fuseau : `Europe/Paris`.

## Lancer le site en local

```bash
bash tools/run.sh                 # serveur Jekyll sur 127.0.0.1:4000
bash tools/run.sh -i              # incrémental (rebuilds rapides)
bash tools/run.sh -C              # désactive le cache PWA (utile en dev)
bash tools/run.sh -p              # mode production
```

Première fois ou après changement de `Gemfile` : `bundle install`.

## Builder + tester avant publication

```bash
bash tools/test.sh                # build prod + html-proofer (liens internes)
npm run format-check              # vérifie le formatage Markdown
npm run format                    # applique prettier sur tous les .md
```

`test.sh` reconstruit `_site/` et lance `htmlproofer` en ignorant les URL externes et localhost. À faire passer avant tout push.

## Publication

Le déploiement est automatique via GitHub Actions (`.github/workflows/pages-deploy.yml`) à chaque push sur `main`. Pas de build manuel à pousser — `_site/` est régénéré côté CI.

## Workflow d'écriture

1. **Brouillon** → déposer le `.md` dans `to-refine/`. C'est l'étape de pré-publication : prose libre, sans front matter Jekyll obligatoire, sans contrainte de nommage. Sert de file d'attente pour les textes à retravailler (relecture, structuration, ajout de métadonnées, choix du slug et de la date).
2. **Promotion** → quand l'article est prêt, le déplacer dans `_posts/` au format `YYYY-MM-DD-slug.md` et compléter le front matter ci-dessous. Le fichier disparaît alors de `to-refine/`.

Les fichiers dans `to-refine/` ne sont **pas** publiés (Jekyll n'indexe que `_posts/`).

## Collecte éditoriale

- `editorial/` contient l'amont documentaire durable du blog : fiches projets,
  preuves, captures et pipeline de sujets. Le dossier est explicitement exclu
  du build Jekyll.
- Commencer par `editorial/README.md`, puis suivre `editorial/method.md` pour
  qualifier un signal et le rattacher à une fiche projet.
- La collecte ne vaut pas décision de publication. Ne créer ou promouvoir un
  article dans `_posts/` qu'après une décision éditoriale explicite.

## Écrire un article

- Fichier dans `_posts/` nommé `YYYY-MM-DD-slug.md`.
- Front matter minimal (cf. articles existants) :

```yaml
---
layout: post
title: "Titre de l'article"
description: "Résumé SEO court."
date: 2026-04-26 09:00:00 +0100
author: ab
categories: [Architecture]
tags: [tag1, tag2]
permalink: /2026/04/26/slug/
nav_section: articles
mermaid: true   # uniquement si l'article contient des diagrammes
---
```

- `layout`, `toc`, `comments` viennent des `defaults` — ne pas les répéter sauf override.
- `last_modified_at` est rempli automatiquement par le hook `_plugins/posts-lastmod-hook.rb` à partir de `git log` dès le 2ᵉ commit du fichier. Inutile de le maintenir à la main.
- Images : `assets/img/posts/<slug>/...` puis référencer en chemin absolu `/assets/img/posts/<slug>/foo.png`.
- Drafts : déposer dans `_drafts/` (non publié) ou pré-dater.

## Stack Jekyll / Chirpy

- **Jekyll** — générateur statique Ruby. Toute la mécanique (front matter, layouts, includes, collections, hooks) est documentée sur https://jekyllrb.com/docs/.
- **Thème [Chirpy](https://chirpy.cotes.page/)** (`jekyll-theme-chirpy ~> 7.4`, gem) — fournit layouts, includes, assets, JS PWA et la base i18n. Doc principale : https://chirpy.cotes.page/posts/getting-started/.
- Le thème est consommé en gem (`Gemfile`) — **ne jamais éditer les fichiers du gem**. Pour customiser, copier le fichier ciblé (`_layouts/`, `_includes/`, `_sass/`, `assets/`) dans le repo : Jekyll prend la version locale en priorité.
- `_plugins/posts-lastmod-hook.rb` — hook custom : remplit `last_modified_at` automatiquement à partir de `git log` (s'active dès que le post a > 1 commit). Inutile de mettre à jour `last_modified_at` à la main si le fichier est commité.
- `_data/` — `authors.yaml` (signatures), `contact.yml` (réseaux sidebar), `share.yml` (boutons partage). La locale française est fournie par le gem dans `_data/locales/fr-FR.yml` — la surcharger en créant un fichier de même nom dans le repo.
- `_tabs/` — pages de navigation (about, archives, categories, tags…), front matter `tab` Chirpy.
- `_config.yml` / `_config.nocache.yml` — config principale + overlay dev pour désactiver le cache PWA.

## Dépannage rapide

- **`bundle exec jekyll` échoue** → `bundle install` puis vérifier la version Ruby vs `Gemfile.lock`.
- **Liens cassés détectés par html-proofer** → corriger les `permalink` et chemins d'images ; les URL externes sont ignorées par défaut.
- **Cache PWA bloque le rendu en dev** → relancer avec `bash tools/run.sh -C`.
- **Le site ne se met pas à jour en prod** → vérifier l'onglet Actions sur GitHub (workflow `pages-deploy`).

## Conventions

- Tout commit/PR sur `main` déclenche un déploiement : ne pousser que du contenu publiable.
- Markdown formaté via Prettier (`npm run format`).
- Ne pas committer `_site/` (généré).
