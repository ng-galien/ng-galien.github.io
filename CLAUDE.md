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

## Écrire un article

- Fichier dans `_posts/` nommé `YYYY-MM-DD-slug.md` pour le français (langue par défaut).
- Pour une autre langue, déposer dans `_posts/<lang>/` (ex. `_posts/en/`) — `lang` et le préfixe d'URL sont injectés par les `defaults` du `_config.yml`.
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
page_id: article-slug
nav_section: articles
mermaid: true   # uniquement si l'article contient des diagrammes
---
```

- `layout`, `lang`, `toc`, `comments` viennent des `defaults` — ne pas les répéter sauf override.
- `last_modified_at` est rempli automatiquement par le hook `_plugins/posts-lastmod-hook.rb` à partir de `git log` dès le 2ᵉ commit du fichier. Inutile de le maintenir à la main.
- Images : `assets/img/posts/<slug>/...` puis référencer en chemin absolu `/assets/img/posts/<slug>/foo.png`.
- Drafts : déposer dans `_drafts/` (non publié) ou pré-dater.

## Stack Jekyll / Chirpy

- **Jekyll** — générateur statique Ruby. Toute la mécanique (front matter, layouts, includes, collections, hooks) est documentée sur https://jekyllrb.com/docs/.
- **Thème [Chirpy](https://chirpy.cotes.page/)** (`jekyll-theme-chirpy ~> 7.4`, gem) — fournit layouts, includes, assets, JS PWA et la base i18n. Doc principale : https://chirpy.cotes.page/posts/getting-started/.
- **[jekyll-polyglot](https://github.com/untra/polyglot)** (`~> 1.12`) — gestion multilingue (cf. section *Multilingue*).
- Le thème est consommé en gem (`Gemfile`) — **ne jamais éditer les fichiers du gem**. Pour customiser, copier le fichier ciblé (`_layouts/`, `_includes/`, `_sass/`, `assets/`) dans le repo : Jekyll prend la version locale en priorité.
- Overrides actuels :
  - `_includes/footer.html` — sélecteur de langue + footer Chirpy d'origine.
  - `_includes/metadata-hook.html` — injecte les balises hreflang dans `<head>` via le hook prévu par Chirpy.
- `_plugins/posts-lastmod-hook.rb` — hook custom : remplit `last_modified_at` automatiquement à partir de `git log` (s'active dès que le post a > 1 commit). Inutile de mettre à jour `last_modified_at` à la main si le fichier est commité.
- `_data/` — `authors.yaml` (signatures), `contact.yml` (réseaux sidebar), `share.yml` (boutons partage). Les **locales** sont fournies par le gem dans `_data/locales/<code>.yml` (en, fr-FR, etc.) — surcharger en créant un fichier de même nom dans `_data/locales/` du repo.
- `_tabs/` — pages de navigation (about, archives, categories, tags…), front matter `tab` Chirpy.
- `_config.yml` / `_config.nocache.yml` — config principale + overlay dev pour désactiver le cache PWA.

## Multilingue

Le blog tourne sous **[jekyll-polyglot](https://github.com/untra/polyglot)** — un build par langue, URLs préfixées pour les non-défauts, hreflang SEO automatique.

### Configuration en place

- `Gemfile` → `gem "jekyll-polyglot", "~> 1.12"`.
- `_config.yml` :
  - `lang: fr-FR`, `default_lang: "fr-FR"`, `languages: ["fr-FR", "en"]`.
  - `lang_vars: ["lang"]` — propage la langue active à `site.lang` pour que Chirpy charge le bon fichier de chaînes UI.
  - `exclude_from_localization` — assets, feed, sitemap, manifest PWA et SW, 404 (non dupliqués par langue).
  - `parallel_localization: true`.
  - `sass.sourcemap: never` — workaround Jekyll 4.x + polyglot.
- `defaults` injectent automatiquement `lang` et `lang-exclusive` selon le dossier (`_posts/` → `fr-FR`, `_posts/en/` → `en`). `lang-exclusive` empêche un article d'apparaître dans le tree d'une autre langue (sinon polyglot fallback en duplique le contenu).
- `_includes/metadata-hook.html` → injecte `{% I18n_Headers %}` dans `<head>` (hreflang `fr-FR` / `en` / `x-default`).
- `_includes/footer.html` (override local) → ajoute un sélecteur `FR / EN` en haut du footer, calé sur `page.permalink_lang` pour pointer vers la traduction de la page courante (ou la home de la langue si aucune traduction).

### URLs résultantes

- Français (langue par défaut) → racine : `/`, `/2025/11/08/sdd-core/`, `/about/`…
- Anglais → préfixé : `/en/`, `/en/2025/11/08/sdd-core/`, `/en/about/`…
- Hreflang automatique sur chaque page traduite, lié par `page_id`.

### Écrire un article bilingue

1. Version **française** dans `_posts/YYYY-MM-DD-slug.md` (front matter standard, voir section *Écrire un article*).
2. Version **anglaise** dans `_posts/en/YYYY-MM-DD-slug.md` :
   - Mêmes `permalink` et `page_id` que la version française → polyglot relie les deux.
   - `lang` et `lang-exclusive` sont injectés par les `defaults` (ne pas les répéter).
   - Le `permalink` reste celui du post FR (sans `/en/`) — polyglot ajoute le préfixe au build.
3. Si un article n'existe que dans **une** langue, juste l'écrire dans le dossier correspondant. Il n'apparaîtra pas dans le tree de l'autre langue (`lang-exclusive`).

### Traduire les pages `_tabs/` (about, archives, categories, tags)

Les tabs sont sensibles : URL en clair (ex. `/about/`), partagés site-wide. Pour bilinguer une tab :

1. Ajouter `lang: fr-FR`, `lang-exclusive: ["fr-FR"]`, `page_id: <slug>` au tab existant (ex. `_tabs/about.md`).
2. Créer le pendant `_tabs/about.en.md` avec le même `permalink: /about/`, le même `page_id`, `lang: en`, `lang-exclusive: ["en"]`. Polyglot servira `/about/` en FR et `/en/about/` en EN.

### Ajouter une 3ᵉ langue (ex. espagnol)

1. `_config.yml` → ajouter `"es-ES"` à `languages`.
2. Vérifier que `_data/locales/es-ES.yml` existe (Chirpy en livre une dizaine ; sinon créer un override local).
3. Ajouter un bloc `defaults` pour `_posts/es/` (`lang: es-ES`, `lang-exclusive: ["es-ES"]`).
4. Le sélecteur `FR / EN` du footer s'incrémente automatiquement (boucle sur `site.languages`).

### Détection auto de la langue (visiteur anglophone)

Implémentée dans `_includes/metadata-hook.html` (script inline en `<head>`) :

- **Déclencheur** : seulement sur la home de la langue par défaut (`/`).
- **Logique** : si `localStorage.preferred_lang` est vide, on lit `navigator.language`, on cherche le meilleur match dans `site.languages` (match exact, sinon prefix `xx-…`), et si ça diffère du `default_lang` on redirige via `location.replace('/' + match + '/')`.
- **Mémorisation** : chaque page écrit `localStorage.preferred_lang = site.lang` au chargement, donc le sélecteur de langue (footer) met à jour la préférence implicitement, et un visiteur ne se fait jamais re-rediriger une fois qu'il a choisi.
- **Robustesse** : tout est dans un `try/catch` (mode incognito où `localStorage` lève) ; `location.replace` n'ajoute pas d'entrée à l'historique (pas de "back" piégé) ; bots sans JS ne sont pas redirigés et hreflang fait son office côté SEO.
- **Limites volontaires** : aucune redirection sur les pages profondes (`/2025/...`) — un anglophone qui suit un lien direct vers un article FR voit le FR (correct : le partageur a choisi cette URL).

Pour désactiver : retirer le bloc `<script>` du redirect dans `_includes/metadata-hook.html` (garder le recorder pour cohérence du sélecteur).

### Autres limites connues

- **Pas de `feed.xml` par langue** — il est dans `exclude_from_localization`. Si besoin de feeds séparés, retirer cette exclusion et créer `feed-en.xml` côté EN.
- **`include_cached` de Chirpy** — certains includes sont mis en cache par argument. Le sélecteur de langue est dans `footer.html`, lui-même inclus via `include_cached footer.html lang=lang` : la cache est par langue, donc OK.

Réfs : [polyglot README](https://github.com/untra/polyglot) · [Chirpy](https://chirpy.cotes.page/posts/getting-started/) · [Jekyll i18n patterns](https://www.sylvaindurand.org/making-jekyll-multilingual/).

## Dépannage rapide

- **`bundle exec jekyll` échoue** → `bundle install` puis vérifier la version Ruby vs `Gemfile.lock`.
- **Liens cassés détectés par html-proofer** → corriger les `permalink` et chemins d'images ; les URL externes sont ignorées par défaut.
- **Cache PWA bloque le rendu en dev** → relancer avec `bash tools/run.sh -C`.
- **Le site ne se met pas à jour en prod** → vérifier l'onglet Actions sur GitHub (workflow `pages-deploy`).

## Conventions

- Tout commit/PR sur `main` déclenche un déploiement : ne pousser que du contenu publiable.
- Markdown formaté via Prettier (`npm run format`).
- Ne pas committer `_site/` (généré).
