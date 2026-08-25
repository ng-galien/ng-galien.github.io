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
