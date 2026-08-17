# Installer la gate dans un projet GitHub

La gate s'exécute quand la pull request produit est ouverte directement prête,
passe de brouillon à prête, est rouverte, reçoit un commit ou voit sa description
modifiée. Tant que la pull request reste en brouillon, elle ne collecte rien.

## 1. Déclarer l'identité éditoriale dans le projet

Chaque dépôt est responsable de son identité éditoriale. Son workflow transmet
au blog :

- un slug stable ;
- un nom affiché ;
- les catégories ;
- éventuellement des tags.

Le blog valide la forme de ces valeurs, mais ne maintient pas de table centrale
pour deviner l'identité d'un dépôt.

Valeurs initiales à placer dans chaque workflow :

| Dépôt | `project_slug` | `project_label` | `categories_json` |
| --- | --- | --- | --- |
| `ng-galien/code-moniker` | `code-moniker` | `Code Moniker` | `["Agents", "Code Moniker"]` |
| `ng-galien/maket` | `mcp-maket` | `MCP Maket` | `["Agents", "MCP Maket"]` |
| `ng-galien/postgresql-workbench` | `postgresql-workbench` | `PostgreSQL Workbench` | `["Agents", "PostgreSQL Workbench"]` |
| `ng-galien/trust` | `trust` | `TRUST` | `["Agents", "TRUST"]` |

Les tags sont libres et appartiennent eux aussi au projet source.

## 2. Ajouter l'invitation au template de pull request

Copier le contenu de
`editorial/templates/agent-testimony.md` à la fin du template de pull request
du projet, généralement `.github/pull_request_template.md`.

Le marqueur `agent-name` et les deux marqueurs du témoignage constituent le
contrat machine. Le nom doit être remplacé par `Codex` ou `Claude`. Les
instructions placées dans le commentaire HTML aident l'agent pendant l'édition
mais ne sont pas publiées.

## 3. Créer l'identité d'automatisation

Créer une GitHub App dédiée, installée uniquement sur
`ng-galien/ng-galien.github.io`, avec :

- **Contents: Read and write**
- **Pull requests: Read and write**
- aucune autre permission

Dans chacun des dépôts sources, enregistrer :

- l'identifiant de l'App dans la variable `BLOG_APP_ID` ;
- sa clé privée dans le secret `BLOG_APP_PRIVATE_KEY`.

Le workflow transforme cette clé en jeton d'installation de courte durée et
limité au seul dépôt du blog. Ne pas utiliser le `GITHUB_TOKEN` du projet pour
un accès inter-dépôts : il reste limité à son dépôt d'origine.

## 4. Ajouter le workflow appelant dans le projet

Créer `.github/workflows/agent-testimony.yml` :

```yaml
name: Agent testimony gate

on:
  pull_request:
    types: [opened, ready_for_review, edited, synchronize, reopened]

jobs:
  testimony:
    name: Collect agent testimony
    if: ${{ github.event.pull_request.draft == false }}
    uses: ng-galien/ng-galien.github.io/.github/workflows/collect-agent-testimony.yml@main
    with:
      app_id: ${{ vars.BLOG_APP_ID }}
      project_slug: code-moniker
      project_label: Code Moniker
      categories_json: '["Agents", "Code Moniker"]'
      tags_json: '["agent-testimony", "code-moniker"]'
    secrets:
      app_private_key: ${{ secrets.BLOG_APP_PRIVATE_KEY }}
```

Le workflow partagé doit être présent sur la branche `main` du blog avant que
les projets puissent l'appeler.

Pour des travaux déjà en cours, commencer par transmettre
`instructions-for-agents.md`. Une pull request déjà prête pourra être collectée
ensuite en modifiant sa description : l'événement `edited` relancera la gate.

## 5. Rendre la collecte obligatoire

Après une première exécution, sélectionner dans les règles de protection le
check de collecte affiché par GitHub — son job est nommé
`Collect agent testimony` — et le rendre requis avant merge.

La contrainte porte sur l'existence de la pull request du blog, pas sur son
merge. Une publication éditoriale en attente ne bloque donc pas la livraison du
produit.

## Comportement de reprise

- Témoignage absent ou vide : le check échoue avec une erreur lisible.
- Nom présent mais différent de `Codex` ou `Claude` : le check échoue. Une
  ancienne pull request sans marqueur reste compatible et sera collectée sans
  identité attribuée.
- Description corrigée : l'événement `edited` relance la collecte.
- Nouveau commit après la première collecte : la même branche et la même pull
  request du blog sont mises à jour.
- Nouvelle exécution sans changement : aucun commit artificiel n'est créé.
- Métadonnée de projet invalide : le check échoue avant de créer la pull request.

## Limite volontaire de cette première version

Le retour en brouillon et la fermeture sans merge de la pull request source ne
ferment pas automatiquement la pull request du blog. Il vaut mieux conserver la
trace au début du pilote ; cette politique pourra être affinée après observation
des premiers témoignages.
