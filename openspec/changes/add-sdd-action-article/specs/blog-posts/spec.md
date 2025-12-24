## ADDED Requirements
### Requirement: Article "SDD en action"
Le blog SHALL publier un nouvel article en francais dans la serie SDD, intitule "SDD en action: comment appliquer le SDD dans des cas concrets et examiner ce qu'il apporte". L'article SHALL etre stocke dans `_posts/` avec un nom `YYYY-MM-DD-sdd-action.md` et un front matter conforme aux conventions du blog.
L'article SHALL presenter l'application du SDD sur des cas concrets, incluant deux exemples principaux:
- un legacy securise par une "ceinture de securite" via la publication d'evenements metiers correspondant aux etats et transitions d'un systeme SDD;
- un workflow d'IA securise par des etats explicites, des controles et une auditabilite renforcee.
Chaque exemple SHALL inclure un schema Mermaid simple (pas trop detaille) pour illustrer les etats et transitions.
L'article SHALL referencer les billets SDD precedents.
La conclusion SHALL mentionner le repo `https://github.com/ng-galien/sdd-modeler`.

#### Scenario: Publication de l'article
- **WHEN** le nouvel article est ajoute au blog
- **THEN** il est ecrit en francais, stocke dans `_posts/` avec le front matter attendu et le titre precise
- **THEN** il contient des liens vers les billets SDD precedents

#### Scenario: Exemple legacy
- **WHEN** le lecteur parcourt l'exemple legacy
- **THEN** l'article explique comment publier des evenements metiers qui representent les etats et transitions dans une approche SDD

#### Scenario: Exemple workflow IA
- **WHEN** le lecteur parcourt l'exemple de workflow d'IA
- **THEN** l'article montre comment le SDD apporte de la securite via des etats explicites, des controles et une trace d'audit

#### Scenario: Schemas Mermaid
- **WHEN** les exemples sont presentes
- **THEN** chaque exemple contient un schema Mermaid simple illustant les etats et transitions

#### Scenario: Conclusion avec repo
- **WHEN** le lecteur arrive a la conclusion
- **THEN** la conclusion mentionne le repo `https://github.com/ng-galien/sdd-modeler`
