# Project Context

## Purpose
Ce projet est un blog personnel sur le developpement logiciel. Le but est de publier des articles et des series d'articles, principalement en francais, pour partager des notes, de la veille et des reflexions techniques.
OpenSpec est utilise pour structurer la redaction des articles (objectifs, plan, points clefs et contraintes editoriales).

## Tech Stack
- Jekyll (site statique) avec le theme Chirpy
- GitHub Pages pour l'hebergement
- Markdown + front matter YAML pour le contenu
- Ruby/Bundler pour la construction Jekyll
- Node.js + Prettier pour le formatage Markdown

## Project Conventions

### Code Style
- Posts sous `_posts/` avec un nom `YYYY-MM-DD-slug.md`
- Front matter YAML obligatoire (ex: `layout`, `lang: fr`, `title`, `description`, `date`, `last_modified_at`, `categories`, `tags`, `permalink`, `page_id`, `toc`)
- Utiliser `npm run format` / `npm run format-check` pour les fichiers Markdown
- Preferer des titres et descriptions concis et orienter le contenu vers un lectorat francophone

### Architecture Patterns
- Site statique, sans backend applicatif
- Contenu = Markdown dans `_posts/` et pages dans `_tabs/`
- Donnees et metadonnees partagees dans `_data/`
- Assets statiques dans `assets/`, plugins dans `_plugins/`
- Rendu via Liquid et conventions du theme Chirpy

### Testing Strategy
- Pas de tests applicatifs classiques
- Valider le rendu avec `bundle exec jekyll build` ou `bundle exec jekyll serve`
- Verifier le formatage Markdown via `npm run format-check`

### Git Workflow
- Flux simple sur `main`
- Commits petits et descriptifs (pas de convention imposee)
- Eviter les changements de permalink pour ne pas casser les liens publics

## Domain Context
- Blog personnel oriente developpement logiciel, architecture, data modeling et pratiques d'ingenierie
- Le contenu est en priorite en francais; les citations et termes techniques peuvent rester en anglais
- OpenSpec sert a definir la structure d'un article (objectif, plan, points clefs, audience, pre-requis)

## Important Constraints
- Langue principale: francais
- Compatibilite GitHub Pages / Jekyll (pas de dependances serveur)
- Respecter les conventions du theme Chirpy et le front matter attendu
- Ne pas casser les URL publiques (permalinks stables)

## External Dependencies
- GitHub Pages (pipeline de build et hebergement)
- Theme Chirpy (jekyll-theme-chirpy)
- RubyGems via Bundler pour Jekyll
- Prettier pour le formatage Markdown
