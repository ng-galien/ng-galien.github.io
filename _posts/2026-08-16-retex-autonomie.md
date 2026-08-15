---
layout: post
title: "Retex autonomie"
description: "Retour sur une délégation multi-agent devenue trop autonome, et sur la nécessité de reprendre le travail en pair programming."
date: 2026-08-16 00:47:22 +0200
author: ab
categories: [Réflexion]
tags: [agents, ingénierie, autonomie, trust]
permalink: /posts/retex-autonomie/
nav_section: articles
toc: true
comments: false
image:
  path: /assets/img/posts/retex-autonomie-multi-agent-engineering.png
  alt: "Multi-agent engineering : l'équipe attendue et le résultat devenu illisible."
---

J'ai essayé la voie facile dans TRUST : déléguer à Codex en mode ultra, donner mandat à une cohorte d'agents pour le design, l'architecture, le métier, etc. Résultat : un échec et une certaine frustration.

En y réfléchissant, le principal défaut de cette approche est que les agents finissent en roue libre. J'ai pourtant pris le temps de faire des spécifications, des diagrammes, enfin tout ce que l'on estime nécessaire pour que l'on puisse déléguer. Le résultat n'était certes pas mauvais : il y avait même des choses essentielles qui n'avaient pas échappé à la cohorte et auxquelles je n'avais pas du tout pensé. Mais l'idée initiale de pouvoir faire tourner des procédures vérifiables qu'un humain puisse rédiger ou vérifier a fini par se diluer sous une masse de détails techniques overkill ; la prose du code était inconsistante et romanesque. Le langage ubiquitaire et la vision produit avaient disparu.

Repartir de zéro n'était plus envisageable : c'était la troisième fois que je refaisais le projet. J'ai donc dû ouvrir VS Code, refaire le métier d'avant, pinailler, pester, demander un grand nettoyage et reprendre le refinement avec l'agent en mode high. Très vite, j'ai remarqué que l'agent était cramé : il ne pouvait plus sortir du projet tel qu'il était.

Nouvelle session, agent plus frais et nettoyage au bulldozer : l'agent semblait dans de meilleures dispositions, un peu comme si cette expérience inhabituelle pour un agent — supprimer des masses de code, invalider le code existant — avait aidé à le conditionner pour la refonte.

Bien entendu, les agents ne sont pas en cause dans les dérives : s'ils ne font pas ce que l'on attend d'eux, c'est que l'on n'a pas su leur donner les moyens de le faire ; c'est ce qu'on dit habituellement. Mais quand on part sur un POC et qu'on l'affine, on est par définition dans ce mode. Rien n'est figé, on ajuste au fil de l'eau. Et là, il faut être en mode pair programming avec l'agent. On ne pilote pas, on ne délègue pas, on discute beaucoup pour avoir les idées claires. Et la propension des agents à se perdre dans les détails, à inventer des concepts, à surcharger le vocabulaire et à diluer le langage ubiquitaire est à la fois un problème et un excellent exercice dans ce cas-là. Cet exercice nous sert à rester aiguisés, à préciser les choses, à rester lean, à ne pas tomber dans le pattern ou dans l'abstraction prématurée, ni dans l'illusion que l'agent a tout compris sans qu'on ait pris la peine de lui donner les instructions.

Je trouve que les agents sont formidables pour coder et exécuter, et arrivent assez bien à se fondre dans le cadre d'un projet bien établi ou à implémenter un truc en mode YOLO : pas de souci pour déléguer. Mais dès qu'il faut construire une architecture, faire des choix de design et construire un produit précis from scratch, la délégation aveugle à une squad d'agents me semble hasardeuse. Surtout si on n'a pas de feedback autre que le code.
