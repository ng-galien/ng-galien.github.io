# Méthode de collecte et de transformation

## 1. Collecter un signal

Ajouter une capture dans `inbox/` dès qu'un événement mérite d'être conservé :
release, décision de conception, échec instructif, validation réelle, retour
utilisateur, changement de cap ou mesure significative. Utiliser le modèle
`templates/capture.md`.

Une capture doit répondre à quatre questions :

1. Qu'est-ce qui a changé ou été appris ?
2. Pourquoi est-ce important pour le produit ou la pratique ?
3. Quelle source permet de le vérifier ?
4. Que manque-t-il avant de pouvoir le raconter publiquement ?

## 2. Qualifier les preuves

Employer les statuts suivants dans les fiches et le pipeline :

| Statut | Signification |
| --- | --- |
| `confirmé` | Présent dans la source canonique ou vérifié par une preuve reproductible. |
| `historique` | Vrai à une date ou une révision donnée, sans présumer de l'état actuel. |
| `observé` | Vu dans une exécution ou une interface identifiée. |
| `prévu` | Intention, roadmap ou chantier ; ne pas le présenter comme livré. |
| `inférence` | Lecture éditoriale explicitement déduite de plusieurs faits. |
| `à vérifier` | Signal utile mais preuve insuffisante, contradictoire ou périmée. |

Une preuve utile indique au minimum sa source, sa date ou révision, ce qu'elle
démontre exactement et ce qu'elle ne démontre pas. Les sources sont, par ordre
de préférence : comportement reproductible, tests/CI ciblés, release publiée,
source canonique, changelog, commit, issue ou note de travail.

## 3. Consolider dans la fiche projet

Lors de chaque jalon significatif :

1. déplacer ou résumer les captures qualifiées dans la fiche du projet ;
2. mettre à jour l'histoire et les jalons sans transformer la fiche en log ;
3. enregistrer les preuves nouvelles ou devenues obsolètes ;
4. distinguer la direction actuelle des générations historiques ;
5. ajouter ou fermer les questions éditoriales ;
6. créer une ligne dans `pipeline.md` si un récit devient autonome.

## 4. Choisir la forme éditoriale

### Actualité

À utiliser pour un changement daté et concret : release, nouvelle capacité,
validation ou changement de cap. Le sujet doit tenir dans la structure
« avant → changement → effet → limite actuelle » et reposer sur au moins une
preuve datée.

### Réflexion

À utiliser lorsqu'un apprentissage dépasse le projet : architecture exécutable,
travail avec un agent, données locales, débogage, preuve ou conception
visuelle. Séparer les faits des conclusions personnelles et chercher au moins
deux situations concrètes, éventuellement dans deux projets.

### Portfolio

À utiliser pour présenter une réalisation durable. Structure minimale :
problème, contraintes, responsabilité personnelle, décisions, résultat,
preuves, limites et prochaine étape. Une liste de fonctionnalités seule ne
constitue pas un contenu de portfolio.

## 5. Pipeline de publication

Les états sont :

`inbox → qualifié → candidat → cadré → rédaction → vérification → publié`

`en attente` et `abandonné` sont des sorties explicites. Le passage à
`rédaction` exige : un angle en une phrase, un lecteur visé, les preuves
nécessaires et une liste des affirmations à ne pas faire.

Ce dossier s'arrête à la préparation. Un article public n'est créé dans
`_posts/` qu'après une décision éditoriale explicite.

## 6. Cadence légère

- À chaque release ou décision structurante : une capture de cinq minutes.
- Une fois par semaine : qualification de l'inbox et mise à jour des preuves.
- Une fois par mois : revue croisée des quatre projets et sélection de un à
  trois sujets candidats.
- Avant toute rédaction : rafraîchir les sources susceptibles d'avoir changé.

## 7. Contrôle avant promotion

- Le sujet raconte un problème et une évolution, pas seulement une livraison.
- Chaque résultat important possède une preuve proportionnée.
- Les limites et inconnues sont visibles.
- Le rôle de l'auteur n'est ni gonflé ni effacé.
- Le ton reste personnel, technique, clair, modeste et factuel.
- Aucun secret, chemin privé inutile, donnée client ou détail d'environnement
  sensible ne passe dans le contenu public.
