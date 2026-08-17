#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

import {
  validateAuthoredText,
  validateAgentName,
  validateProject,
} from "./collect.mjs";

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key?.startsWith("--") || value === undefined) {
      throw new Error(`Invalid argument near ${key ?? "end of command"}`);
    }
    args[key.slice(2)] = value;
  }
  return args;
}

function required(value, label) {
  if (value === undefined || value === null || value === "") {
    throw new Error(`${label} is required`);
  }
  return value;
}

function yaml(value) {
  return JSON.stringify(value);
}

function validateSource(source) {
  const repository = required(source.repository, "source.repository");
  const commit = required(source.commit, "source.commit");
  const runId = required(source.runId, "source.runId");
  const submittedAt = required(source.submittedAt, "source.submittedAt");
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) {
    throw new Error("source.repository must be an owner/repository name");
  }
  if (!/^[0-9a-f]{7,64}$/i.test(commit)) {
    throw new Error("source.commit must be a Git commit id");
  }
  if (!/^\d+$/.test(String(runId))) {
    throw new Error("source.runId must be numeric");
  }
  if (Number.isNaN(Date.parse(submittedAt))) {
    throw new Error("source.submittedAt must be an ISO date");
  }
  return { ...source, repository, commit, runId: String(runId), submittedAt };
}

export function buildMainDocument(testimonyInput, projectInput, sourceInput) {
  const testimony = validateAuthoredText(testimonyInput);
  const project = validateProject(projectInput);
  const source = validateSource(sourceInput);
  const agentName = validateAgentName(source.agentName);
  const date = source.submittedAt.slice(0, 10);
  const year = date.slice(0, 4);
  const repositorySlug = source.repository.split("/").at(-1);
  const filename = `${date}-${repositorySlug}-main-run-${source.runId}.md`;
  const relativePath = path.posix.join(project.slug, year, filename);
  const sourceUrl =
    source.url ??
    `https://github.com/${source.repository}/commit/${source.commit}`;

  const frontMatter = [
    "---",
    "schema_version: 2",
    'kind: "agent-testimony"',
    'status: "collected"',
    'source_kind: "main"',
    'language: "fr"',
    `project: ${yaml(project.slug)}`,
    `project_label: ${yaml(project.label)}`,
    `agent_name: ${yaml(agentName)}`,
    `categories: ${yaml(project.categories)}`,
    `tags: ${yaml(project.tags)}`,
    `source_repository: ${yaml(source.repository)}`,
    `source_ref: ${yaml(source.ref ?? "main")}`,
    `source_commit: ${yaml(source.commit)}`,
    `source_url: ${yaml(sourceUrl)}`,
    `source_run_id: ${yaml(source.runId)}`,
    `source_run_url: ${yaml(source.runUrl ?? null)}`,
    `submission_actor: ${yaml(source.actor ?? null)}`,
    `collected_at: ${yaml(source.submittedAt)}`,
    "---",
    "",
  ].join("\n");

  return {
    content: `${frontMatter}${testimony}\n`,
    project,
    agentName,
    relativePath,
    source,
    sourceUrl,
  };
}

async function appendOutput(outputPath, values) {
  if (!outputPath) return;
  const lines = Object.entries(values)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  await writeFile(outputPath, `${lines}\n`, { flag: "a" });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const testimony = await readFile(
    required(args.testimony, "--testimony"),
    "utf8",
  );
  const project = {
    slug: required(args["project-slug"], "--project-slug"),
    label: required(args["project-label"], "--project-label"),
    categories: JSON.parse(required(args.categories, "--categories")),
    tags: JSON.parse(args.tags ?? "[]"),
  };
  const source = {
    repository: required(args["source-repository"], "--source-repository"),
    ref: args["source-ref"] ?? "main",
    commit: required(args["source-commit"], "--source-commit"),
    runId: required(args["source-run-id"], "--source-run-id"),
    runUrl: args["source-run-url"] ?? null,
    actor: args["submission-actor"] ?? null,
    agentName: args["agent-name"] ?? null,
    submittedAt: required(args["submitted-at"], "--submitted-at"),
  };
  const outputRoot = required(args["output-root"], "--output-root");
  const prBodyPath = required(args["pr-body"], "--pr-body");
  const document = buildMainDocument(testimony, project, source);
  const destination = path.join(
    outputRoot,
    ...document.relativePath.split("/"),
  );

  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, document.content);

  const shortCommit = document.source.commit.slice(0, 8);
  const prTitle = `Agent testimony: ${document.project.label} main @ ${shortCommit}`;
  const prBody = [
    "Collects an agent testimony submitted from work performed directly on the project main branch.",
    "",
    `- Project: ${document.project.label}`,
    `- Source: ${document.sourceUrl}`,
    `- GitHub Actions run: ${document.source.runUrl ?? "not provided"}`,
    `- Agent: ${document.agentName ?? "non renseigné"}`,
    "- Publication status: collected in the internal inbox; not rendered by Jekyll yet",
    "",
    "The testimony body is preserved as authored. This pull request only adds provenance metadata.",
  ].join("\n");
  await writeFile(prBodyPath, `${prBody}\n`);
  await appendOutput(args["github-output"], {
    file_path: path.posix.join(
      "editorial/inbox/agents",
      document.relativePath,
    ),
    pr_title: prTitle,
    project_label: document.project.label,
    source_url: document.sourceUrl,
  });

  process.stdout.write(`Collected ${document.relativePath}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`agent-testimony-main: ${error.message}\n`);
    process.exitCode = 1;
  });
}
