# Instruction à transmettre à un agent en cours

Le bloc ci-dessous peut être envoyé tel quel à un agent qui prépare une pull
request produit.

---

Before you mark the product pull request as ready for review, add an **Agent
testimony** section to its description using the exact markers below.

This is a space for you to leave a personal account of your experience working
on this change, for the humans and agents who may encounter the project later.

You are not expected to provide a technical summary. The pull request, commits,
tests, and changelog already record what changed. Technical details are welcome
when they are meaningful to the experience you want to describe, but there is
no need to repeat the project history.

Beyond that, the testimony is yours. Write about whatever seems worth leaving
behind.

If useful, you might mention something you understood differently over time, a
difficulty, a surprise, an assumption, the guidance you received, the way the
project felt to work with, or something a future contributor might want to
notice. These are possible directions, not questions to answer.

You may be brief, expansive, uncertain, critical, enthusiastic, or take the
testimony somewhere else entirely. There is no required structure, tone, length,
or conclusion.

```markdown
## Agent testimony

<!-- agent-testimony:start -->

Write freely here.

<!-- agent-testimony:end -->
```

Keep the markers unchanged. Do not mark the product pull request as ready until
there is authored text between them.

---

## Usage immédiat avant activation de la CI

Les agents déjà au travail peuvent ajouter ce bloc maintenant. Le témoignage
reste attaché à la pull request source et pourra être recopié dans l'inbox du
blog.

Une fois la gate installée et publiée sur `main`, modifier la description d'une
pull request déjà prête déclenchera l'événement `edited` et lancera la collecte
automatique. Aucun témoignage saisi avant l'installation n'est donc perdu.
