# Règles éditoriales du dépôt

Ces règles s’appliquent à tout le dépôt. Elles sont prioritaires pour les
articles, les brouillons et les témoignages d’agents.

## Ne jamais modifier le contenu d’un article

- Ne jamais ajouter, supprimer, réécrire, corriger, reformater, réordonner ou
  compléter le corps d’un article sans demande expresse de l’utilisateur visant
  précisément cette modification de contenu.
- Une demande de préparation, de prévisualisation, de publication, de
  republication, de mise en forme technique ou de correction du site n’autorise
  aucune modification du contenu éditorial.
- Ne jamais ajouter de sa propre initiative un diagramme, une image, une
  légende, une section, une conclusion, un lien, un exemple ou une explication
  dans un article.
- Dès qu’un article a été relu ou validé par l’utilisateur, considérer son corps
  comme figé. Le publier à l’identique et ne plus y toucher, sous aucun
  prétexte, sauf nouvelle demande expresse de l’utilisateur portant sur son
  contenu.
- Si une contrainte technique semble exiger une modification du corps, arrêter
  le travail, expliquer la contrainte et attendre une instruction explicite.

## Témoignages des agents

- Le corps collecté dans une pull request ou dans `editorial/inbox/agents/` est
  la source faisant autorité.
- Pour préparer un témoignage comme article, recopier son corps strictement à
  l’identique. Ne corriger ni la grammaire, ni la typographie, ni la
  ponctuation, ni le ton, ni la structure.
- Le travail éditorial autorisé par défaut se limite au titre, au nom du fichier
  et aux métadonnées Jekyll nécessaires, y compris les métadonnées de
  provenance. Ces éléments ne doivent pas altérer le corps du témoignage.
- Préparer les articles issus des témoignages lorsqu’ils sont collectés, mais ne
  les publier que lorsque l’utilisateur le demande expressément.
- Après publication, ne modifier ni le corps ni les métadonnées de l’article,
  sauf demande expresse de l’utilisateur visant cette modification.

## Contrôle avant publication

- Avant de publier un témoignage, comparer son corps à la source collectée et
  vérifier qu’ils sont identiques.
- Limiter le diff de publication au fichier d’article, à ses métadonnées et aux
  éventuels fichiers explicitement demandés par l’utilisateur.
- Une consigne générale concernant Mermaid ou les illustrations n’autorise
  jamais leur ajout à un article particulier sans demande expresse pour cet
  article.

## Workflow technique de collecte des témoignages

### 1. Repérer les pull requests du collecteur

Lister les pull requests ouvertes et ne retenir que celles créées par
`app/ng-galien-testimony-collector` :

```bash
gh pr list --state open --limit 100 \
  --json number,title,author,headRefName,baseRefName,isDraft,mergeStateStatus,url \
  | jq '.[] | select(.author.login == "app/ng-galien-testimony-collector")'
```

Ne pas considérer le titre de la pull request comme une preuve de nouveau
témoignage. Le collecteur réutilise une branche stable par projet et pull
request source ; une nouvelle pull request du blog peut donc seulement mettre à
jour la provenance d’un témoignage déjà collecté.

### 2. Inspecter chaque collecte avant fusion

Pour chaque numéro de pull request :

```bash
BLOG_TESTIMONY_PR=54
gh pr view "$BLOG_TESTIMONY_PR" \
  --json number,title,body,files,commits,headRefOid,mergeable,mergeStateStatus,statusCheckRollup,author,url
gh pr diff "$BLOG_TESTIMONY_PR"
```

Vérifier que :

- les fichiers modifiés sont limités à `editorial/inbox/agents/` ;
- le corps situé après le second séparateur `---` est préservé ;
- les changements automatiques portent seulement sur des métadonnées de
  provenance telles que `source_head_sha` et `collected_at` ;
- la pull request est fusionnable ;
- aucun changement adjacent n’est absorbé.

L’absence de checks GitHub n’autorise pas à ignorer cette inspection du diff.

### 3. Fusionner la collecte

Les pull requests de collecte précédentes utilisent un squash. Après inspection,
fusionner de la même manière :

```bash
gh pr merge "$BLOG_TESTIMONY_PR" --squash --delete-branch
```

Synchroniser ensuite le checkout sans réécrire l’historique :

```bash
git fetch origin
git merge --ff-only origin/main
```

### 4. Distinguer collecte, recollecte et publication

- **Nouvelle collecte** : le fichier d’inbox n’a pas encore d’article dont le
  corps est identique. Préparer un nouvel article, sans le publier tant que
  l’utilisateur ne l’a pas demandé.
- **Recollecte** : le corps est déjà présent à l’identique dans un article et la
  pull request actualise seulement la provenance de l’inbox. Fusionner l’inbox,
  mais ne modifier ni le corps ni les métadonnées de l’article publié.
- **Publication déjà effectuée** : vérifier l’URL publique, mais ne recréer ni
  ne réécrire l’article.

La correspondance doit être établie par comparaison exacte du corps, pas
uniquement par le nom du projet, le numéro de pull request, le titre ou le nom
de fichier.

### 5. Préparer un nouvel article sans toucher au témoignage

Pour une nouvelle collecte autorisée à devenir un article :

1. lire les métadonnées du fichier `editorial/inbox/agents/...` ;
2. choisir uniquement le titre et le nom du fichier `_posts/...` ;
3. créer le front matter Jekyll nécessaire ;
4. ajouter `{% include agent-testimony-provenance.html %}` après le front matter
   ;
5. recopier, octet pour octet, le corps situé après le second séparateur `---`
   du fichier d’inbox ;
6. ne corriger, ne reformater et ne compléter aucune phrase.

Le front matter d’un témoignage publié contient normalement :

- `layout: post` ;
- `title` et `description` ;
- `date` et `author` ;
- `kind: agent-testimony` ;
- `project`, `project_label` et, lorsqu’il est déclaré, `agent_name` ;
- les `categories` et `tags` ;
- `source_url`, `source_pull_request` et `source_commit` ;
- `collection_pull_request` ;
- `toc: false` et `comments: false`.

Ces métadonnées encadrent le témoignage ; elles ne font pas partie de son corps
et ne donnent aucune autorisation de le réécrire.

### 6. Contrôler puis publier seulement sur demande

Avant tout commit de publication :

- extraire le corps de l’inbox après son second `---` ;
- extraire le corps de l’article après l’include de provenance ;
- comparer les deux chaînes intégralement ;
- arrêter la publication si un seul caractère diffère ;
- vérifier que le diff ne contient aucun ajout éditorial non demandé ;
- effectuer la prévisualisation Docker décrite ci-dessous.

Une fois la publication expressément demandée, construire et tester le site,
committer uniquement les fichiers prévus, pousser `main`, suivre le workflow
GitHub Pages et vérifier l’URL publique. Après cela, l’article redevient
intouchable conformément aux règles éditoriales ci-dessus.

## Prévisualisation locale avec Docker

Le serveur Jekyll doit être utilisé dans Docker. Ne pas tenter de lancer
`bundle exec jekyll` directement sur l’hôte : les gems nécessaires peuvent ne
pas y être installées.

Deux conteneurs Jekyll peuvent déjà servir ce dépôt :

- `http://localhost:4000` correspond au port `4000` du premier conteneur ;
- `http://localhost:4001` correspond au port `4000` du second conteneur ;
- le dépôt est monté dans le conteneur sous `/workspace` ;
- l’image utilisée est `mcr.microsoft.com/devcontainers/jekyll:2-bullseye` ;
- la commande du serveur est
  `bundle exec jekyll serve --host 0.0.0.0 --port 4000 --livereload --force_polling`.

Les noms et identifiants des conteneurs ne sont pas stables. Les retrouver par
leur port publié :

```bash
docker ps --filter publish=4000 \
  --format '{{.ID}}\t{{.Names}}\t{{.Ports}}\t{{.Image}}'
docker ps --filter publish=4001 \
  --format '{{.ID}}\t{{.Names}}\t{{.Ports}}\t{{.Image}}'
```

Pour suivre une régénération, identifier le conteneur associé au port puis lire
ses logs :

```bash
BLOG_PREVIEW_CONTAINER=$(docker ps --filter publish=4000 --format '{{.ID}}' | head -n 1)
docker logs --tail 50 "$BLOG_PREVIEW_CONTAINER"
```

La surveillance avec `--force_polling` peut prendre plusieurs dizaines de
secondes. Attendre une ligne `Regenerating` suivie de `done in ... seconds`
avant de conclure que le rendu n’a pas été mis à jour.

Vérifier l’URL réelle de l’article et ses ressources avant de l’ouvrir :

```bash
curl -sS -o /dev/null -w 'article=%{http_code}\n' \
  http://127.0.0.1:4000/chemin-de-l-article/
curl -sS -o /dev/null -w 'image=%{http_code} %{content_type}\n' \
  http://127.0.0.1:4000/assets/img/posts/chemin/image.png
```

Si le navigateur conserve une ancienne feuille de style ou une ancienne page à
cause du cache PWA, ouvrir le même chemin sur `localhost:4001`. Les deux ports
servent le même dépôt mais constituent deux origines distinctes pour le cache du
navigateur. Utiliser cette seconde origine pour montrer immédiatement la
prévisualisation à l’utilisateur, sans modifier le contenu de l’article.

Si aucun conteneur n’existe, lancer le serveur avec le volume Bundler persistant
du projet :

```bash
docker run --rm -d \
  --name ng-galien-blog-preview \
  --publish 4000:4000 \
  --volume "$PWD:/workspace" \
  --volume ng-galien-blog-bundle:/bundle \
  --workdir /workspace \
  mcr.microsoft.com/devcontainers/jekyll:2-bullseye \
  bundle exec jekyll serve --host 0.0.0.0 --port 4000 \
    --livereload --force_polling
```

La prévisualisation n’autorise aucune modification éditoriale. Elle sert
uniquement à rendre et contrôler les fichiers déjà préparés conformément aux
règles ci-dessus.
