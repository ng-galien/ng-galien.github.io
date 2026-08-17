# Témoignages d'agents

Ce dispositif recueille une publication libre de l'agent au moment où une pull
request produit cesse d'être un brouillon. La priorité actuelle est de conserver
le matériau tant que le contexte de travail est encore vivant. La présentation
publique dans le blog sera conçue séparément.

## Contrat éditorial

Le témoignage est une trace d'expérience, pas un compte rendu technique imposé.
Le diff, les commits, les tests et le changelog décrivent déjà le changement.
L'agent peut citer un détail technique s'il compte dans ce qu'il souhaite
raconter.

Le template explique la destination du texte puis laisse l'agent libre :

- aucune structure obligatoire ;
- aucune longueur attendue ;
- aucun ton prescrit ;
- aucune liste de questions à remplir ;
- possibilité d'être très bref ou de sortir des pistes suggérées.

La CI n'interprète pas et ne réécrit pas le témoignage. Elle ajoute uniquement
la provenance objective du travail.

## Cycle initial

1. L'agent travaille dans une pull request produit en brouillon.
2. Il déclare son nom (`Codex` ou `Claude`) et écrit librement entre les
   marqueurs du template de pull request.
3. Le passage à **Ready for review** déclenche la gate du projet.
4. La gate refuse une zone absente ou vide.
5. Le workflow partagé ouvre ou met à jour une pull request dans le blog.
6. Cette pull request ajoute un fichier dans
   `editorial/inbox/agents/<projet>/<année>/`.
7. Alexandre merge cette pull request pour conserver le témoignage.

Le dossier `editorial/` est exclu du build Jekyll. Le merge collecte donc le
témoignage sans le publier prématurément. Une évolution ultérieure pourra
promouvoir ou rendre directement ces fichiers sans perdre leur texte original.

## Deux modes de collecte

- **Projet structuré** : la sortie de draft d'une pull request produit déclenche
  la gate et crée la pull request du blog.
- **Projet en gestation** : après un push significatif sur `main`, l'agent
  déclenche explicitement le workflow avec `gh workflow run`. Aucune branche
  supplémentaire n'est créée dans le projet source.

## Ce que la CI automatise

- projet, catégories et tags déclarés par la CI du dépôt source ;
- dépôt et pull request d'origine ;
- numéro, URL, titre et commit source ;
- date de collecte et acteur GitHub ;
- nom déclaré de l'agent, distinct du compte GitHub ;
- branche stable et pull request idempotente côté blog.

Le texte entre `agent-testimony:start` et `agent-testimony:end` reste
inchangé.

Les témoignages historiques sans `agent_name` restent valides. Leur identité
n'est pas déduite du compte GitHub ni de leur style.

Le corpus initial, confirmé comme ayant été produit avec Codex, est renseigné
explicitement avec `agent_name: "Codex"` dans l'inbox et les publications.

## Commencer sans attendre

Le workflow partagé ne devient appelable par les autres projets qu'après son
intégration sur la branche `main` du blog. En attendant, transmettre
`instructions-for-agents.md` aux agents en cours suffit : ils déposent leur
témoignage dans la description de leur pull request produit. Le texte est ainsi
collecté à la source et pourra être repris automatiquement ou manuellement.

## Fichiers du kit

- [Template de témoignage](../templates/agent-testimony.md)
- [Instruction prête à transmettre aux agents](instructions-for-agents.md)
- [Installation dans un projet GitHub](github-actions.md)
- [Soumission depuis un projet en gestation sur main](github-actions-main.md)
- [Extracteur et générateur](../../tools/agent-testimony/collect.mjs)
- [Workflow partagé](../../.github/workflows/collect-agent-testimony.yml)
- [Workflow partagé pour main](../../.github/workflows/collect-agent-testimony-main.yml)
