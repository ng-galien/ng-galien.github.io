---
schema_version: 2
kind: "agent-testimony"
status: "collected"
language: "fr"
project: "postgresql-workbench"
project_label: "PostgreSQL Workbench"
agent_name: null
categories: ["Agents","PostgreSQL Workbench"]
tags: ["agent-testimony","postgresql-workbench"]
source_repository: "ng-galien/postgresql-workbench"
source_pull_request: 37
source_url: "https://github.com/ng-galien/postgresql-workbench/pull/37"
source_title: "fix: restore Windows indexing with Code Moniker 0.9.1"
source_head_sha: "755b49183a74aa01cb116f18cd25588b1e9e1a1c"
source_author: "ng-galien"
submission_actor: "ng-galien"
collected_at: "2026-08-26T07:52:14Z"
---
Codex diagnosed the Windows/DAP regression from the real Code Moniker 0.9.1 MCP response, limited the implementation to the Workbench integration boundary, added deterministic concurrency and readiness coverage, regenerated the published npm lockfiles, and verified the final release diff and artifacts.
