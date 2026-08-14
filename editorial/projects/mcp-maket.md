# MCP Maket — dossier éditorial

- Dépôt local : `/Users/alexandreboyer/dev/projects/mcp-maket`
- Dépôt distant : `https://github.com/ng-galien/maket.git`
- Source produit canonique : `README.md`, `CHANGELOG.md`, code, tests et site du dépôt
- Dernière collecte : 2026-08-11
- État de la collecte : initialisée ; branche locale observée `feat/62-e2e-coverage-baseline`

## Problème adressé

Les assistants savent produire du texte, mais une composition visuelle demande
de travailler l'espace, la hiérarchie et le rythme. Maket leur fournit un
canvas HTML/CSS local avec aperçu vivant, ressources réutilisables, données
typées, validation de mise en page et export.

## Histoire

- 19 avril 2026 : version 1.0 publique.
- Printemps–été 2026 : enrichissement du canvas, des chartes, collections,
  exports, intégrations MCP et surfaces de lecture.
- 7 août 2026 : la 1.5 introduit l'état propre au document et ses révisions,
  distinct des collections de publipostage.
- 9 août 2026 : la 1.6 ajoute une lecture continue et consolide l'export des
  bundles entre HTTP et MCP.
- 11 août 2026 : la 1.7 rend les annotations persistantes et simplifie la
  navigation du lecteur.

## Intentions actuelles

- Garder les documents en HTML/CSS, portables et observables, sans format
  propriétaire opaque.
- Permettre une boucle courte entre demande, composition, annotation humaine,
  correction et export.
- Séparer les collections, qui génèrent plusieurs variantes, de l'état attaché
  à un document vivant.
- Faire de la validation et des preuves visuelles une partie du travail de
  composition, pas une vérification tardive.
- Rester local-first tout en proposant des passerelles explicites, par exemple
  PDF et brouillon Gmail.

## Apprentissages

- Un agent de design a besoin d'un espace de rendu et d'un retour localisé, pas
  seulement d'un langage de description.
- HTML/CSS donne des primitives de mise en page plus robustes que la gestion
  directe d'une multitude de coordonnées SVG ou de formes bureautiques.
- Une collection et un état de document ont des identités, temporalités et
  règles de persistance différentes ; les fusionner crée un modèle confus.
- Les mutations visibles doivent attendre l'accusé de réception du serveur :
  une interface optimiste ne doit pas faire disparaître une demande non sauvée.
- Une archive portable transporte l'état courant nécessaire, sans prétendre
  transférer toute l'histoire locale des révisions.

## Jalons

| Date | Jalon | Statut | Preuve | Portée réelle |
| --- | --- | --- | --- | --- |
| 2026-04-19 | Maket 1.0 | historique | `CHANGELOG.md` | Début public de la lignée actuelle |
| 2026-08-07 | État vivant 1.5 | confirmé | changelog 1.5 | Modèle document-owned livré selon la release |
| 2026-08-09 | Lecture continue 1.6 | confirmé | changelog 1.6, commit `f62d715` | Expérience de lecture ciblée |
| 2026-08-09 | Export `.maket` partagé | confirmé | commit `e09e612` | Parité HTTP/MCP de l'export courant |
| 2026-08-11 | Annotations persistantes 1.7 | confirmé | changelog 1.7, commit `16848e6` | Persistance et portabilité déclarées |

## Registre de preuves

| ID | Type | Source | Date/révision | Statut | Démontre | Ne démontre pas |
| --- | --- | --- | --- | --- | --- | --- |
| MK-P1 | source canonique | `README.md` | collecte 2026-08-11 | confirmé | Proposition, modèles et outils exposés | Qualité de chaque document produit |
| MK-P2 | releases | `CHANGELOG.md` 1.5–1.7 | 2026-08-07 à 2026-08-11 | confirmé | Capacités déclarées dans les packages publiés | Adoption ou satisfaction utilisateur |
| MK-P3 | historique Git | commits récents | jusqu'à `eaea4f5` | historique | Séquence reader, annotations, CI et release | État final de la branche non principale |
| MK-P4 | runtime visuel | à constituer | — | à vérifier | Devra montrer composition, feedback et export | Rien tant que la capture n'est pas reproduite |

## Évolutions à suivre

| Évolution | État | Signal attendu | Risque de confusion |
| --- | --- | --- | --- |
| Qualité E2E réelle du canvas | en cours | Suite navigateur stable et scénarios lisibles | Confondre couverture et qualité visuelle |
| Annotations comme boucle de travail | livré, à observer | Usage répété entre humain et agent | Confondre présence de la fonction et utilité |
| Distribution MCP | en évolution | Installation et doctor sur clients supportés | Confondre inscription à un registre et adoption |
| Documents vivants portables | livré, à éprouver | Import/export sur cas réel | Confondre snapshot portable et historique partagé |

## Sujets à raconter

| Forme | Angle | Lecteur | Preuves requises | Maturité |
| --- | --- | --- | --- | --- |
| Portfolio | Donner un vrai canvas HTML/CSS à un assistant | Designer-développeur | Brief, itérations, annotations et export final | candidat |
| Réflexion | Pourquoi collections et état vivant sont deux modèles | Architecte produit | Même document décliné dans les deux cas | qualifié |
| Actualité | Les annotations persistantes de la 1.7 | Utilisateur Maket | Parcours sauvegarde, reprise et bundle | candidat |
| Réflexion | Ce que « local-first » change pour un outil créatif à agents | Développeur outil | Données, export, panne et récupération | à documenter |

## Questions ouvertes

- Quel document public peut servir de référence visuelle durable ?
- Quels signaux témoignent d'un usage hors du cercle de développement ?
- Où placer la limite entre aide à la composition et automatisation du goût ?

## Journal de collecte

### 2026-08-11

- Sources consultées : README, changelog et vingt derniers commits.
- État observé : dépôt trouvé sur une branche de travail, remote `ng-galien/maket`.
- Prochaine vérification : distinguer les faits de la release 1.7 des travaux
  encore propres à la branche courante.
