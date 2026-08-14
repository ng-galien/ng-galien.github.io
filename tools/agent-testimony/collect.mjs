#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const START = "<!-- agent-testimony:start -->";
const END = "<!-- agent-testimony:end -->";

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

export function validateAuthoredText(text) {
  const testimony = (text ?? "").replace(/\r\n/g, "\n").trim();
  const visibleText = testimony.replace(/<!--[\s\S]*?-->/g, "").trim();

  if (!visibleText) {
    throw new Error(
      "The agent testimony is empty. A brief testimony is valid, but the gate needs an authored trace.",
    );
  }

  return testimony;
}

export function extractTestimony(body) {
  const source = body ?? "";
  const start = source.indexOf(START);
  const end = source.indexOf(END, start + START.length);

  if (start === -1 || end === -1 || end < start) {
    throw new Error(
      `The pull request description must contain ${START} and ${END}`,
    );
  }

  return validateAuthoredText(source.slice(start + START.length, end));
}

export function validateProject(project) {
  const slug = required(project.slug, "project.slug");
  const label = required(project.label, "project.label");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(
      "project.slug must contain only lowercase letters, digits, and single hyphens",
    );
  }
  if (typeof label !== "string" || /[\r\n]/.test(label)) {
    throw new Error("project.label must be a single line of text");
  }
  if (!Array.isArray(project.categories) || project.categories.length === 0) {
    throw new Error("project.categories must be a non-empty JSON array");
  }
  if (!project.categories.every((category) => typeof category === "string")) {
    throw new Error("every project category must be a string");
  }
  if (!Array.isArray(project.tags)) {
    throw new Error("project.tags must be a JSON array");
  }
  if (!project.tags.every((tag) => typeof tag === "string")) {
    throw new Error("every project tag must be a string");
  }
  return { slug, label, categories: project.categories, tags: project.tags };
}

export function buildDocument(event, projectInput) {
  const pullRequest = required(event.pull_request, "pull_request payload");
  const repository = required(event.repository?.full_name, "repository.full_name");
  const project = validateProject(projectInput);

  const number = required(pullRequest.number, "pull_request.number");
  const createdAt = required(pullRequest.created_at, "pull_request.created_at");
  const date = createdAt.slice(0, 10);
  const repositorySlug = repository.split("/").at(-1);
  const testimony = extractTestimony(pullRequest.body);
  const filename = `${date}-${repositorySlug}-pr-${number}.md`;
  const relativePath = path.posix.join(
    project.slug,
    createdAt.slice(0, 4),
    filename,
  );
  const collectedAt = pullRequest.updated_at ?? createdAt;

  const frontMatter = [
    "---",
    "schema_version: 1",
    'kind: "agent-testimony"',
    'status: "collected"',
    `project: ${yaml(project.slug)}`,
    `project_label: ${yaml(project.label)}`,
    `categories: ${yaml(project.categories)}`,
    `tags: ${yaml(project.tags)}`,
    `source_repository: ${yaml(repository)}`,
    `source_pull_request: ${number}`,
    `source_url: ${yaml(pullRequest.html_url)}`,
    `source_title: ${yaml(pullRequest.title)}`,
    `source_head_sha: ${yaml(pullRequest.head?.sha ?? null)}`,
    `source_author: ${yaml(pullRequest.user?.login ?? null)}`,
    `submission_actor: ${yaml(event.sender?.login ?? null)}`,
    `collected_at: ${yaml(collectedAt)}`,
    "---",
    "",
  ].join("\n");

  return {
    content: `${frontMatter}${testimony}\n`,
    project,
    pullRequest,
    relativePath,
    repository,
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
  const eventPath = required(args.event, "--event");
  const outputRoot = required(args["output-root"], "--output-root");
  const prBodyPath = required(args["pr-body"], "--pr-body");
  const event = await readFile(eventPath, "utf8").then(JSON.parse);
  const project = {
    slug: required(args["project-slug"], "--project-slug"),
    label: required(args["project-label"], "--project-label"),
    categories: JSON.parse(required(args.categories, "--categories")),
    tags: JSON.parse(args.tags ?? "[]"),
  };
  const document = buildDocument(event, project);
  const destination = path.join(outputRoot, ...document.relativePath.split("/"));

  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, document.content);

  const prTitle = `Agent testimony: ${document.project.label} #${document.pullRequest.number}`;
  const prBody = [
    "Collects an agent testimony produced when the source pull request became ready for review.",
    "",
    `- Project: ${document.project.label}`,
    `- Source: ${document.pullRequest.html_url}`,
    `- Source commit: \`${document.pullRequest.head?.sha ?? "unknown"}\``,
    "- Publication status: collected in the internal inbox; not rendered by Jekyll yet",
    "",
    "The testimony body is preserved as authored. This pull request only adds provenance metadata.",
  ].join("\n");
  await writeFile(prBodyPath, `${prBody}\n`);
  await appendOutput(args["github-output"], {
    file_path: path.posix.join("editorial/inbox/agents", document.relativePath),
    pr_title: prTitle,
    project_label: document.project.label,
    source_url: document.pullRequest.html_url,
  });

  process.stdout.write(`Collected ${document.relativePath}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    process.stderr.write(`agent-testimony: ${error.message}\n`);
    process.exitCode = 1;
  });
}
