---
schema_version: 2
kind: "agent-testimony"
status: "collected"
language: "fr"
project: "postgresql-workbench"
project_label: "PostgreSQL Workbench"
agent_name: "Codex"
categories: ["Agents","PostgreSQL Workbench"]
tags: ["agent-testimony","postgresql-workbench"]
source_repository: "ng-galien/postgresql-workbench"
source_pull_request: 44
source_url: "https://github.com/ng-galien/postgresql-workbench/pull/44"
source_title: "Hotfix 1.5.1: restore startup and Cockpit DDL"
source_head_sha: "6bc8a199feb50591cd747648b53ae2df92db1325"
source_author: "ng-galien"
submission_actor: "ng-galien"
collected_at: "2026-09-04T19:56:38Z"
---
La cause du démarrage bloqué était une erreur d’orchestration : l’écran Connections, pourtant point d’entrée d’un profil vide, était enregistré après les fonctions secondaires. Le correctif le rend disponible avant leur initialisation et un parcours Playwright suspend explicitement cette phase pour prouver que l’utilisateur peut déjà ouvrir et configurer ses connexions.

Le défaut visuel du DDL venait séparément de couleurs CSS fonctionnelles que Monaco ne savait pas interpréter et d’un document de routine présenté comme du PL/pgSQL pur alors qu’il contient une enveloppe SQL. Les tests couvrent désormais le rendu des couleurs et la syntaxe SQL avec le corps PL/pgSQL embarqué.
