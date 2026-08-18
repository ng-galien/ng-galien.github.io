---
layout: post
title: "L'IA va-t-elle tuer l'open source ?"
description: ""
author: ab
categories: [Réflexion]
tags: [IA, open source]
toc: true
comments: false
---

La majorité des discussions sur le coût de l'IA se concentrent sur les infrastructures sur lesquelles tournent les modèles, mais on parle peu de l'impact sur celles sur lesquelles reposent les projets open source, celles qui permettent de partager le code, ces immenses bases de données qui ont permis de lui apprendre à coder.
Ce n'est pas tant le volume de code qui compte, mais tout ce qu'il y a derrière le code : les tests et la validation.

Pour laisser l'IA générer du code, il vaut mieux mettre en place une bonne batterie de tests, pas seulement des tests unitaires rapides, mais des tests lourds qui prennent plusieurs minutes au lieu de quelques secondes.
Je ne veux pas tester mes extensions VS Code à la main tout le temps, je réserve ça aux nouvelles features pour ne pas me transformer en validateur click click. Je suis donc incliné à mettre en place ces tests automatisés, et vu que je n'ai qu'un Mac, je ne peux pas tester mes extensions sur Windows ou Linux, donc je suis obligé de mettre en place des tests automatisés sur ces plateformes.

Ce qui était autrefois réservé aux gros projets open source, ou aux entreprises, devient accessible à tous ceux qui connaissent un minimum le métier.
C'est le coût du build : quand les testeurs restaient humains, la rapidité avec laquelle on pouvait mettre en place ces tests lourds était limitée. Maintenant les agents sont capables de couvrir toutes les interactions possibles, et de les faire tourner sur toutes les plateformes.
Tout ceci n'est objectivement pas tenable pour l'écosystème open source, qui repose sur la gratuité de mise à disposition de code mais surtout celle des outils de build.

On a déjà les premiers signes, c'est documenté.

N. B. : Il faudra que je pense à garder cette discipline : ne pas laisser l'agent empiler les tests lourds sans que le retour sur investissement soit vraiment positif. Il faudra également avoir des processus de delivery plus courts.

---

Mise à jour : **18 août 2026**.

### GitHub Actions : volumes de CI

- En **2023**, GitHub indiquait que l’usage de GitHub Actions sur les projets publics avait augmenté de **169 % sur un an**, avec plus de **20 millions de minutes par jour en moyenne**.
  Source : [GitHub Octoverse 2023](https://github.blog/news-insights/research/the-state-of-open-source-and-ai/)

- En **2024**, GitHub comptabilisait **10,54 milliards de minutes CPU GitHub Actions**, contre **7,3 milliards en 2023**, soit une hausse annoncée de **près de 30 %**. Ce périmètre incluait alors les projets publics et l'usage self-hosted.
  Source : [GitHub Octoverse 2024](https://github.blog/news-insights/octoverse/octoverse-2024/)

- En **2025**, les seuls projets publics ont consommé gratuitement **11,5 milliards de minutes CPU GitHub Actions**, contre **8,5 milliards sur le même périmètre en 2024**, soit **+35 %**.

- En reprenant le même périmètre que le rapport 2024 — incluant notamment le self-hosted — GitHub donne **13,5 milliards de minutes en 2025**, soit **+30 % en un an**.
  Source : [GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)

### Activité logicielle sur GitHub

- En 2025, GitHub rapporte **plus de 986 millions de commits**, en hausse de **25 % sur un an**.

- Le nombre moyen mensuel de pull requests fusionnées est passé d'environ **35 millions en 2024** à **43,2 millions en 2025**.

- Le nombre de *code pushes* est passé d'environ **65 millions à 82,19 millions par mois** entre 2024 et 2025.

- GitHub précise que ces données sont des **observations et non une démonstration d'un lien causal avec l'IA**.

### Conteneurs et environnements

- GitHub comptait environ **875 000 repositories contenant un Dockerfile en 2024**, contre **1,9 million en 2025**, soit **+120 %**. GitHub associe notamment cette croissance au besoin de disposer d'environnements reproductibles et de sandboxer les agents et LLM.
  Source : [GitHub Octoverse 2025](https://github.blog/news-insights/octoverse/octoverse-a-new-developer-joins-github-every-second-as-ai-leads-typescript-to-1/)

### Gratuité et coût de GitHub Actions

- Les **runners GitHub-hosted standards sont gratuits et illimités pour les repositories publics**.
  Source : [GitHub Docs — GitHub-hosted runners](https://docs.github.com/en/actions/reference/runners/github-hosted-runners)

- Les runners self-hosted ne donnent actuellement pas lieu à une facturation GitHub Actions à la minute.
  Source : [GitHub Actions billing](https://docs.github.com/billing/managing-billing-for-github-actions/about-billing-for-github-actions)

- Les *larger runners* ne sont en revanche **pas gratuits pour les repositories publics**.

- Tarifs GitHub Actions actuellement publiés pour certains runners : **Linux 2-core : 0,006 $/min**, **Windows 2-core : 0,010 $/min**, **macOS 3/4-core : 0,062 $/min**.
  Source : [GitHub Actions runner pricing](https://docs.github.com/en/billing/reference/actions-runner-pricing)

### GitHub et le coût de son infrastructure CI

- Lors de la modification annoncée de la tarification GitHub Actions fin 2025, GitHub a déclaré explicitement avoir des **« real costs in running the Actions control plane »**.

- GitHub a ensuite **reporté la modification de facturation concernant les runners self-hosted**, tout en maintenant pour janvier 2026 une réduction pouvant aller jusqu'à **39 %** du prix de certains runners hébergés.
  Source : [GitHub Community — Updates to GitHub Actions pricing](https://github.com/orgs/community/discussions/182186)

### Les agents GitHub consomment eux-mêmes de la CI

- Le **GitHub Copilot coding agent fonctionne dans un environnement de développement basé sur GitHub Actions** où il peut compiler le projet, exécuter des tests et lancer des linters.

- Les sessions du Copilot coding agent consomment des **GitHub Actions minutes**, en plus de la consommation liée au modèle.

- GitHub indique également que les **agents tiers intégrés à GitHub**, dont les agents Codex et Claude lorsqu'ils sont utilisés via cette infrastructure, consomment des **GitHub Actions minutes et des AI credits**.
  Source : [GitHub Docs — third-party coding agents](https://docs.github.com/en/copilot/concepts/agents/about-third-party-coding-agents)

- Depuis le **1er juin 2026**, **Copilot code review consomme lui aussi des GitHub Actions minutes**, en plus des crédits associés au modèle.
  Source : [GitHub Docs — Copilot models and pricing](https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing)

- Chaque exécution d'une **Copilot automation** démarre une session d'agent cloud qui consomme des GitHub Actions minutes et des AI Credits.

### Tests produits par les coding agents

- Une étude publiée en **janvier 2026** a analysé **plus de 1,2 million de commits réalisés en 2025**, dans **2 168 repositories JavaScript, TypeScript et Python**. L'échantillon contient **48 563 commits attribués à des coding agents**.

- Dans cette étude, **23 % des commits produits par des agents ajoutaient ou modifiaient des fichiers de tests**, contre **13 % pour les commits non produits par des agents**.

- **60 % des repositories comportant une activité d'agent comportaient également une activité de test attribuée à un agent**.
  Source : [Are Coding Agents Generating Over-Mocked Tests?](https://arxiv.org/abs/2602.00409)

- Une seconde étude de mars 2026 a extrait **2 232 commits comportant des modifications liées aux tests**. Les agents représentaient **16,4 % des commits ajoutant des tests** dans le corpus étudié.

- Cette étude constate que les méthodes de test générées par IA sont en moyenne **plus longues** et présentent une **densité d'assertions supérieure** aux tests humains du corpus.

- Dans ces projets, les gains de couverture obtenus par les tests générés par agents étaient globalement **comparables à ceux des tests écrits par des humains**.
  Source : [Testing with AI Agents: An Empirical Study of Test Generation Frequency, Quality, and Coverage](https://arxiv.org/abs/2603.13724)

## Développement agentique et boucles de CI

- Le benchmark **SWE-CI**, publié en mars 2026, a été conçu spécifiquement autour de boucles de Continuous Integration plutôt que de corrections ponctuelles.

- SWE-CI contient **100 tâches** issues de repositories réels. Chaque tâche représente en moyenne **233 jours d'évolution du logiciel et 71 commits consécutifs**.

- Le protocole nécessite pour les agents **des dizaines de cycles successifs d'analyse et de modification du code**.
  Source : [SWE-CI: Evaluating Agent Capabilities in Maintaining Codebases via Continuous Integration](https://arxiv.org/abs/2603.03823)

- Le benchmark **SWE-Cycle**, publié en 2026, évalue séparément la reconstruction de l'environnement, l'implémentation du code et la **génération de tests de vérification**, ainsi qu'un scénario complet combinant les trois. Son corpus comprend **489 instances**.
  Source : [SWE-Cycle](https://arxiv.org/abs/2605.13139)

## GitLab : modèle différent de GitHub

- Le plan gratuit GitLab.com fournit actuellement **400 compute minutes par mois**.
  Source : [GitLab Pricing](https://about.gitlab.com/pricing/)

- GitLab avait réduit dès **octobre 2020** son quota gratuit à 400 minutes par mois ; GitLab indiquait alors que **98,5 % des utilisateurs gratuits utilisaient 400 minutes ou moins**.

- GitLab indique également avoir introduit des restrictions sur le compute gratuit pour limiter certains abus, notamment le **minage de cryptomonnaies**, qui avait provoqué des problèmes de performances sur GitLab.com.

- Pour les projets éligibles au programme **GitLab for Open Source**, GitLab fournit **50 000 compute minutes par mois**.

- Ces projets open source bénéficient en outre d'un facteur de coût de **0,5**, soit **1 compute minute comptabilisée pour 2 minutes réelles de job** sur les runners concernés.
  Source : [GitLab Docs — Compute minutes](https://docs.gitlab.com/ci/pipelines/compute_minutes/)

## Consommation électrique des datacenters — monde

- L'Agence internationale de l'énergie estime la consommation électrique mondiale liée aux datacenters à environ **415 TWh en 2024**. Son scénario central atteint environ **945 TWh en 2030**.

- Sur la période 2024-2030, l'IEA prévoit une croissance d'environ **15 % par an** de la consommation électrique des datacenters, soit plus de **quatre fois** la croissance de la consommation électrique des autres secteurs.

- Dans le scénario central de l'IEA, les **serveurs accélérés**, principalement associés à l'adoption de l'IA, représentent **presque la moitié de l'augmentation nette** de la consommation électrique des datacenters jusqu'en 2030.

- L'IEA projette pour ces serveurs accélérés une croissance de consommation d'environ **30 % par an**, contre environ **9 % par an** pour les serveurs conventionnels.
  Source : [IEA — Energy and AI](https://www.iea.org/reports/energy-and-ai/energy-demand-from-ai)

## Consommation électrique des datacenters — États-Unis

- Le **Lawrence Berkeley National Laboratory**, dans son rapport publié en juin 2026, retient un scénario de référence de **649 TWh de consommation des datacenters américains en 2030**.

- Sa fourchette complète d'incertitude va de **521 à 843 TWh en 2030**.

- Cela correspondrait à environ **9,5 % à 15,3 % de toute la consommation électrique des États-Unis**, avec une estimation centrale de **11,8 %**.

- Parmi les scénarios étudiés, une augmentation du nombre de processeurs graphiques spécialisés conduit à **664 TWh**, tandis qu'une hausse des taux d'utilisation et de la consommation au repos des serveurs IA conduit à **782 TWh en 2030**.
  Source : [Lawrence Berkeley National Laboratory — United States Data Center Energy Usage Report: 2025 Update](https://eta.lbl.gov/publications/united-states-data-center-energy-2025)
