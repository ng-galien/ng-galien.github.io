# TRUST — dossier éditorial

- Dépôt local : `/Users/alexandreboyer/dev/projects/trust`
- Dépôt distant : `https://github.com/ng-galien/trust.git`
- Source produit canonique : `README.md` et `docs/` hors `legacy/`
- Dernière collecte : 2026-08-11
- État de la collecte : initialisée à partir de `main`, reconstruction greenfield en cours

## Problème adressé

Un agent peut déclencher une action dans un système externe, mais ni son
intention ni son compte rendu ne prouvent que le résultat attendu existe.
TRUST cherche à encadrer cette délégation : vérifier une release de Skill,
admettre une action dans un contexte autorisé, accepter des faits authentiques
et calculer un verdict sur un Check sans prétendre garantir ce qui n'a pas été
observé.

## Histoire

- Plusieurs générations ont exploré Skills, procédures, preuves, plans,
  sessions et intégrations d'un laboratoire complet.
- Le 10 août 2026, les générations rejetées ont été figées sous `legacy/` et un
  squelette greenfield séparé a été établi.
- Le produit actif est volontairement ramené à deux livrables : le runtime privé
  `apps/trust-runtime` et le SDK distribué `packages/trust-skill-sdk`.
- Le scope V1 normatif fixe une boucle minimale : conformité de release,
  engagement d'un Plan, invocation d'un Check, action externe, faits acceptés
  et verdict `VALIDATED` ou `NOT_VALIDATED`.
- Le compilateur de procédures vers des URI sémantiques de Checks est en cours ;
  les commits les plus récents restent explicitement marqués WIP.

## Intentions actuelles

- Prouver le plus petit parcours complet avant de réintroduire des modèles
  d'opérabilité plus riches.
- Garder la suite de conformité canonique sous contrôle du produit, sans laisser
  le Skill choisir ou attester lui-même son test.
- Séparer validation de la délégation, exécution de l'action et qualification
  des faits.
- Refuser atomiquement un lot d'observations incomplet plutôt que produire un
  verdict ou une preuve partielle.
- Partager un même contrat de release et de faits entre CLI, MCP STDIO et MCP
  HTTP ; le transport ne doit pas changer la sémantique du Skill.
- Assumer et documenter le risque « at least once » lorsqu'une action rejouable
  n'a produit aucun fait accepté, avec intervention humaine pour les issues
  inconnues non rejouables.

## Apprentissages

- Valider le droit d'agir ne prouve ni l'exécution ni le résultat.
- L'absence de faits acceptés doit laisser le Check ouvert ; fabriquer un
  `NOT_VALIDATED` donnerait une fausse impression de connaissance.
- La conformité porte sur un tuple exact de release, action, contrat et suite ;
  elle ne garantit pas tous les environnements futurs.
- Une reconstruction peut être plus honnête qu'une compatibilité artificielle :
  l'archive `legacy/` conserve l'histoire sans la laisser définir le produit
  actif.
- Une surface publique minimale aide l'agent : un Check adressable et un résultat
  sémantique, sans exposition des schémas, prédicats ou identités internes.

## Jalons

| Date | Jalon | Statut | Preuve | Portée réelle |
| --- | --- | --- | --- | --- |
| 2026-07-20 | Architecture centrée Skill | historique | commit `bff56d0` | Génération antérieure, aujourd'hui non normative |
| 2026-08-08 | Procédure de correction exécutable | historique | commits `3b45f92`, `2b9ab6f` | Conservée comme apprentissage, pas contrat greenfield courant |
| 2026-08-10 | Archivage des générations rejetées | confirmé | commit `bc14b3b`, `legacy/README.md` | Séparation documentaire et de build |
| 2026-08-10 | Squelette greenfield | confirmé | commit `efe84e8`, README courant | Structure active, pas preuve de boucle V1 complète |
| 2026-08-10 | Compilation des URI de Checks | en cours | commits `a1d696c`, `a5e4c93` | Travail explicitement WIP |

## Registre de preuves

| ID | Type | Source | Date/révision | Statut | Démontre | Ne démontre pas |
| --- | --- | --- | --- | --- | --- | --- |
| TR-P1 | source normative | `docs/product/v1-minimal-scope.md` | collecte 2026-08-11 | confirmé | Contrat et limites acceptés pour V1 | Implémentation ou exécution complète |
| TR-P2 | frontière actuelle | `README.md`, `docs/README.md` | collecte 2026-08-11 | confirmé | Deux livrables actifs et caractère non normatif de `legacy/` | Maturité du runtime |
| TR-P3 | architecture | `docs/architecture/0001..0004` | collecte 2026-08-11 | confirmé | Décisions exécutables visées | Passage de tous les tests |
| TR-P4 | historique Git | commits du 10 août | jusqu'à `a5e4c93` | historique | Reconstruction et WIP récent | Boucle V1 opérationnelle |
| TR-P5 | exécution V1 | à constituer | — | à vérifier | Devra prouver engage → invoke → facts → verdict | Rien avant scénario reproductible |

## Évolutions à suivre

| Évolution | État | Signal attendu | Risque de confusion |
| --- | --- | --- | --- |
| Premier slice V1 | en cours | Scénario complet et reproductible | Confondre contrat normatif et produit exécuté |
| Compilateur de procédure | WIP | Fixtures stables et URI déterministes | Présenter un commit WIP comme langage stabilisé |
| Conformité de release | prévue par V1 | Vérificateur approuvé et attestation exacte | Confondre conformité contrôlée et vérité universelle |
| Enveloppes CLI/MCP | contractuelles | Même handler/faits sur trois transports | Confondre transport opérationnel et sémantique métier |

## Sujets à raconter

| Forme | Angle | Lecteur | Preuves requises | Maturité |
| --- | --- | --- | --- | --- |
| Réflexion | Autoriser, agir et prouver sont trois opérations différentes | Architecte agentique | Scénario V1 minimal et contre-exemple | qualifié conceptuellement |
| Actualité | Repartir en greenfield sans effacer les générations précédentes | Développeur produit | Motifs de décision et premier slice exécuté | à vérifier |
| Portfolio | Une boucle de Check fondée sur des faits acceptés | Architecte/runtime | Trace complète, idempotence et refus atomique | prématuré |
| Réflexion | Pourquoi l'absence de preuve ne doit pas devenir un verdict négatif | Ingénieur qualité | Cas rejouable et cas non rejouable | candidat |

## Questions ouvertes

- Quel premier Skill et quelle action porteront la preuve V1 publique ?
- Quelles décisions des générations `legacy/` méritent un récit rétrospectif,
  sans brouiller le contrat actuel ?
- Quelle démonstration montre l'intervention humaine sur une issue inconnue non
  rejouable sans surcharger le récit ?

## Journal de collecte

### 2026-08-11

- Sources consultées : README, index des docs, scope V1, lifecycle du Skill et
  vingt derniers commits de `main`.
- Frontière retenue : seuls le root courant et `docs/` sont normatifs ; les
  architectures antérieures sont historiques.
- Prochaine vérification : exécution du premier slice V1 et stabilisation du
  compilateur avant toute annonce publique.
