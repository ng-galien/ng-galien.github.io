# PostgreSQL Workbench — dossier éditorial

- Dépôt local : `/Users/alexandreboyer/dev/projects/plpgsql-dap`
- Dépôt distant : `https://github.com/ng-galien/plpgsql-dap.git`
- Identité actuelle : dépôt et extension encore nommés PL/pgSQL Debugger ;
  PostgreSQL Workbench désigne l'évolution produit plus large
- Source produit canonique : `README.md`, `vscode-extension/README.md`, code et tests ; `docs/DESIGN.md` doit être réconcilié avec les capacités récentes
- Dernière collecte : 2026-08-11
- État de la collecte : initialisée à partir de `main`

## Problème adressé

Le code PL/pgSQL s'exécute dans PostgreSQL mais reste difficile à développer
avec les boucles habituelles d'un IDE. Le projet a commencé par rendre le
débogage disponible via DAP, hors d'un IDE propriétaire, puis s'étend vers un
Workbench réunissant exploration du schéma, SQL persistant, tests pgTAP,
couverture, comparaison et synchronisation des routines.

## Histoire

- Le serveur DAP a été porté depuis le plugin IntelliJ `idea-plpgdebugger` pour
  devenir utilisable depuis VS Code, Neovim, Emacs et d'autres clients DAP.
- Le client VS Code a ajouté gestion des connexions, CodeLens, sources
  virtuelles, variables complexes, résultats SQL, pgTAP et couverture.
- Fin juillet 2026, l'analyse SQL et l'exploration du catalogue ont convergé
  vers les identités de Code Moniker et un cockpit de graphe.
- Début août 2026, le dépôt a ajouté notebooks SQL persistants, contexte de base
  unifié, projection incrémentale du DDL et synchronisation graphe/index.
- L'identité « PostgreSQL Workbench » est donc une transition produit en cours,
  pas encore un renommage complet et homogène du dépôt ou de la documentation.

## Intentions actuelles

- Conserver un serveur DAP autonome et interopérable.
- Offrir dans VS Code une boucle quotidienne pour explorer, exécuter, tester,
  couvrir et déboguer du code PostgreSQL.
- Utiliser les URI Code Moniker comme identité canonique des symboles sur les
  différentes surfaces.
- Garder les bases locales, Docker ou self-hosted comme cibles de développement
  et expliciter les limites des services managés sans `pldebugger`.
- À terme, traiter le fichier versionné comme autorité et la base comme cible
  de validation/déploiement explicite.

## Apprentissages

- Le débogage PL/pgSQL exige deux connexions aux rôles distincts : listener et
  target ; leur cycle de vie doit être explicite pour éviter blocages et fuites.
- Les OID PostgreSQL sont des données de déploiement, pas une identité durable ;
  les surcharges exigent une identité canonique incluant la signature.
- Une vue SQL utile doit borner les résultats et exports sans prétendre borner
  ce que PostgreSQL reçoit sur le protocole.
- La couverture de routines doit être transactionnelle, limitée et réservée à
  une base de développement ou de test.
- La synchronisation du schéma doit distinguer DDL et données, demander un
  provisioning explicite et savoir déclarer l'index désynchronisé.
- Quand le produit avance vite, roadmap et documentation peuvent devenir
  contradictoires : cette dérive est elle-même un signal à traiter avant de
  raconter une direction stabilisée.

## Jalons

| Date | Jalon | Statut | Preuve | Portée réelle |
| --- | --- | --- | --- | --- |
| origine | Portage DAP depuis IntelliJ | historique | `README.md` | Origine déclarée, date à documenter |
| 2026-07-31 | Exploration SQL centrée Code Moniker | historique | série de commits `b86c721` à `6028c78` | Évolution interne du Workbench |
| 2026-08-08 | Notebooks et contexte de base | confirmé | commits `f8e9620`, `eaa5b0b` | Capacités présentes dans l'historique courant |
| 2026-08-08 | Synchronisation DDL incrémentale | confirmé | commit `92bf8b7`, README extension | Ne synchronise pas les données |
| 2026-08-10 | Relations d'arbre alignées sur Code Moniker | confirmé | commit `9db826d` | Correctif ciblé, pas validation globale de l'UX |

## Registre de preuves

| ID | Type | Source | Date/révision | Statut | Démontre | Ne démontre pas |
| --- | --- | --- | --- | --- | --- | --- |
| PW-P1 | source produit | `vscode-extension/README.md` | collecte 2026-08-11 | confirmé | Capacités utilisateur et limites annoncées | Parcours complet réellement exécuté aujourd'hui |
| PW-P2 | contrat historique | `docs/DESIGN.md` | collecte 2026-08-11 | à vérifier | Invariants DAP et ancien roadmap +1/+2 | État actuel du Workbench : le document exclut encore des fonctions désormais présentes |
| PW-P3 | historique Git | vingt derniers commits de `main` | jusqu'à `9db826d` | historique | Ordre des évolutions Workbench récentes | Qualité visuelle ou disponibilité Marketplace actuelle |
| PW-P4 | validation réelle | tests E2E documentés | révision courante | à vérifier | Le dépôt prévoit une preuve sur PostgreSQL réel | Résultat actuel tant que la suite n'est pas relancée |

## Évolutions à suivre

| Évolution | État | Signal attendu | Risque de confusion |
| --- | --- | --- | --- |
| Identité PostgreSQL Workbench | transition | README, package et Marketplace cohérents | Employer le nouveau nom comme si la migration était terminée |
| Cockpit SQL et graphe | en évolution | Parcours visuel validé sur un schéma réel | Confondre modèle de graphe et UX validée |
| Autorité fichier → base | prévu/partiel | Diff, preview et déploiement explicitement prouvés | Laisser croire à une synchronisation bidirectionnelle générale |
| Composition SQL guidée | intention | Prototype éditable, jamais auto-exécuté | Le présenter comme un constructeur graphique fermé |

## Sujets à raconter

| Forme | Angle | Lecteur | Preuves requises | Maturité |
| --- | --- | --- | --- | --- |
| Portfolio | Porter un débogueur PL/pgSQL vers un DAP autonome | Développeur outils | Démo multi-client ou contrat DAP ciblé | candidat |
| Actualité | Comment le débogueur devient un Workbench | Utilisateur PostgreSQL | Roadmap réconciliée et capture du produit actuel | à vérifier |
| Réflexion | Une identité durable pour des routines surchargées | Architecte/outilleur | Exemple OID contre URI canonique | qualifié |
| Portfolio | Un cycle test–couverture–debug dans la base | Développeur PL/pgSQL | Scénario pgTAP réel avec couverture et debug | candidat |

## Questions ouvertes

- Quelle source devient le roadmap canonique après les livraisons récentes ?
- Quand le nom PostgreSQL Workbench remplacera-t-il l'identité PL/pgSQL
  Debugger dans le dépôt et la distribution ?
- Quel scénario réel illustre le mieux la continuité entre fichier, catalogue,
  test, couverture et debug ?

## Journal de collecte

### 2026-08-11

- Sources consultées : README racine, README extension, `docs/DESIGN.md` et
  vingt derniers commits de `main`.
- Écart relevé : `docs/DESIGN.md` place encore notebooks et client SQL hors
  roadmap alors que le README et l'historique décrivent des capacités livrées.
- Prochaine vérification : source de roadmap actuelle et parcours E2E réellement
  validé avant toute actualité publique.
