# Code Moniker — dossier éditorial

- Dépôt local : `/Users/alexandreboyer/dev/projects/code-moniker`
- Dépôt distant : `https://github.com/ng-galien/code-moniker.git`
- Source produit canonique : `README.md`, `CHANGELOG.md`, code et tests du dépôt
- Dernière collecte : 2026-08-11
- État de la collecte : initialisée à partir de `main`

## Problème adressé

La recherche textuelle décrit mal les identités et les relations du code.
Code Moniker extrait un graphe de symboles stable afin d'inspecter un système et
d'appliquer des règles d'architecture dans les hooks ou la CI. Le projet vise
aussi à rendre les contraintes d'un dépôt exécutables pour les humains et les
agents, plutôt que de les laisser uniquement dans des consignes en prose.

## Histoire

- Mai 2026 : premières versions publiques du moteur d'extraction et de ses
  surfaces CLI.
- Juillet 2026 : cœur d'indexation incrémentale remanié en 0.4, puis diff
  sémantique au niveau symbole en 0.5.
- 7 août 2026 : la 0.6 réunit CLI, daemon autonome, MCP, intégrations d'agents
  et client Node portable dans une distribution multiplateforme.
- 8 août 2026 : la 0.6.1 durcit le démarrage MCP et la publication atomique des
  déclarations du daemon.

## Intentions actuelles

- Donner une identité commune aux symboles sur les surfaces CLI, daemon, MCP,
  Node et VS Code.
- Faire respecter des règles structurelles sur les symboles, références,
  chemins, propriétaires et commentaires.
- Rester honnête sur la résolution : l'extracteur ne remplace ni les
  compilateurs ni les analyseurs sémantiques complets de chaque langage.
- Rendre la distribution utilisable sans toolchain Rust locale, y compris sous
  Windows.

## Apprentissages

- Une identité sémantique utile doit exprimer la nature des segments, pas
  seulement leur position textuelle.
- Un graphe incomplet doit rendre sa couverture et ses ambiguïtés visibles ; un
  résultat vide silencieux est plus trompeur qu'une limite explicite.
- L'incrémentalité et un snapshot immuable sont nécessaires pour servir des
  requêtes interactives pendant que le workspace évolue.
- Une règle connue et répétable gagne à être exécutable dans le dépôt plutôt
  que rappelée à chaque agent dans un prompt.
- Distribuer un client réutilisable impose de traiter le cycle de vie du daemon,
  la compatibilité de protocole et les binaires natifs comme un seul contrat.

## Jalons

| Date | Jalon | Statut | Preuve | Portée réelle |
| --- | --- | --- | --- | --- |
| 2026-05-13 | Version 0.1 publique | historique | `CHANGELOG.md` | Point de départ public, pas l'état actuel |
| 2026-07-14 | Indexation incrémentale 0.4 | confirmé | changelog 0.4 et benchmarks consignés | Mesures du dépôt, à ne pas généraliser sans nouveau benchmark |
| 2026-07-25 | Diff sémantique 0.5 | confirmé | changelog 0.5 | Faits au niveau symbole avec résidus explicités |
| 2026-08-07 | Distribution multiplateforme 0.6 | confirmé | changelog 0.6, commit `2801577` | Release déclarée ; refaire un smoke public avant un article détaillé |
| 2026-08-08 | Correctifs daemon/MCP 0.6.1 | confirmé | changelog 0.6.1, commits `d2e26c3`, `e195662` | Deux corrections ciblées |

## Registre de preuves

| ID | Type | Source | Date/révision | Statut | Démontre | Ne démontre pas |
| --- | --- | --- | --- | --- | --- | --- |
| CM-P1 | source canonique | `README.md` | collecte 2026-08-11 | confirmé | Problème, usages, langages et limites annoncées | Adoption réelle |
| CM-P2 | release | `CHANGELOG.md` 0.4–0.6.1 | 2026-07-14 à 2026-08-08 | confirmé | Évolution déclarée et versions | Expérience d'un utilisateur externe |
| CM-P3 | historique Git | commits récents de `main` | jusqu'à `22a895e` | historique | Séquence des correctifs et de la release | État des registres publics à cette date |

## Évolutions à suivre

| Évolution | État | Signal attendu | Risque de confusion |
| --- | --- | --- | --- |
| Maturité par langage | continu | Tests et limites mises à jour | Confondre extraction rapide et compilation complète |
| Règles sur changements sémantiques | prévu | Contrat stable et exemples exécutables | Confondre diff disponible et décision de revue automatique |
| Adoption du client Node | à observer | Usages hors VS Code et installation propre | Confondre téléchargements et usage durable |
| Expérience du cockpit VS Code | en évolution | Flux utilisateur validé visuellement | Présenter une maquette comme produit stabilisé |

## Sujets à raconter

| Forme | Angle | Lecteur | Preuves requises | Maturité |
| --- | --- | --- | --- | --- |
| Portfolio | Construire un contrat architectural exécutable | Développeur/outilleur | Démo courte, règle, violation et correction | candidat |
| Réflexion | Les limites honnêtes d'un graphe de symboles multi-langage | Architecte | Deux cas de couverture incomplète et leur traitement | qualifié |
| Actualité | Ce que la 0.6 a changé dans la distribution | Utilisateur CLI/Node | Smoke macOS/Linux/Windows et installation propre | candidat |
| Réflexion | Remplacer des rappels de prompt par des invariants du dépôt | Équipe utilisant des agents | Avant/après mesurable sur un vrai changement | à documenter |

## Questions ouvertes

- Quels usages externes dépassent aujourd'hui les dépôts de l'auteur ?
- Quelle mesure simple montre le gain d'une règle exécutable sans gonfler la
  promesse ?
- Quel exemple multi-langage est assez compact pour expliquer couverture et
  ambiguïté ?

## Journal de collecte

### 2026-08-11

- Sources consultées : README, changelog et vingt derniers commits de `main`.
- État observé : dépôt trouvé sur `main`, remote `ng-galien/code-moniker`.
- Prochaine vérification : releases publiques et démonstration utilisateur
  reproductible avant cadrage d'un article.
