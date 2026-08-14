# Collecte éditoriale interne

Ce dossier est l'amont privé du blog. Il rassemble des faits, des preuves, des
questions et des angles éditoriaux avant toute rédaction publique. Il est exclu
du build Jekyll par `_config.yml`.

Les quatre projets suivis sont :

| Projet | Dépôt local confirmé | Dépôt distant |
| --- | --- | --- |
| [Code Moniker](projects/code-moniker.md) | `/Users/alexandreboyer/dev/projects/code-moniker` | `ng-galien/code-moniker` |
| [MCP Maket](projects/mcp-maket.md) | `/Users/alexandreboyer/dev/projects/mcp-maket` | `ng-galien/maket` |
| [PostgreSQL Workbench](projects/postgresql-workbench.md) | `/Users/alexandreboyer/dev/projects/plpgsql-dap` | `ng-galien/plpgsql-dap` |
| [TRUST](projects/trust.md) | `/Users/alexandreboyer/dev/projects/trust` | `ng-galien/trust` |

## Organisation

- `projects/` : dossiers éditoriaux durables, un par projet.
- `inbox/` : signaux bruts à qualifier avant de les rattacher à un projet.
- `inbox/agents/` : témoignages libres déposés par les CI des projets.
- `agent-testimonies/` : contrat éditorial et kit d'intégration GitHub.
- `pipeline.md` : sujets candidats et prochaine action éditoriale.
- `method.md` : méthode de collecte, niveaux de preuve et passage vers un contenu.
- `templates/` : formats à copier pour un nouveau projet ou une nouvelle capture.

## Règle de fond

Une fiche n'est ni une documentation produit bis, ni un journal exhaustif des
commits. Elle conserve ce qui peut nourrir un récit : le problème, les choix,
les inflexions, ce qui a été appris, les résultats vérifiables et les limites
encore ouvertes.

Les affirmations doivent être étiquetées implicitement ou explicitement comme
faits actuels, faits historiques, intentions, observations d'exécution ou
interprétations. Une intention ou un commit ne vaut pas preuve de résultat.
