import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, test } from "node:test";
import { spawnSync } from "node:child_process";

import { buildDocument, extractTestimony } from "./collect.mjs";

const project = {
  slug: "trust",
  label: "TRUST",
  categories: ["Agents", "TRUST"],
  tags: ["agent-testimony"],
};
const temporaryDirectories = [];

afterEach(async () => {
  await Promise.all(
    temporaryDirectories.splice(0).map((directory) =>
      rm(directory, { recursive: true, force: true }),
    ),
  );
});

function event(overrides = {}) {
  return {
    repository: { full_name: "ng-galien/trust" },
    sender: { login: "agent-runner" },
    pull_request: {
      number: 42,
      title: "Clarify the plan boundary",
      body: [
        "Context before the testimony.",
        "<!-- agent-testimony:start -->",
        "I expected a small change. The difficult part was realizing that the boundary itself was unclear.",
        "",
        "I would leave that question visible for the next agent.",
        "<!-- agent-testimony:end -->",
      ].join("\n"),
      created_at: "2026-08-14T08:00:00Z",
      updated_at: "2026-08-14T09:00:00Z",
      html_url: "https://github.com/ng-galien/trust/pull/42",
      head: { sha: "abc123" },
      user: { login: "ng-galien" },
      ...overrides,
    },
  };
}

test("extractTestimony preserves the authored prose", () => {
  const source = event().pull_request.body;
  assert.equal(
    extractTestimony(source),
    "I expected a small change. The difficult part was realizing that the boundary itself was unclear.\n\nI would leave that question visible for the next agent.",
  );
});

test("extractTestimony rejects an empty marked section", () => {
  assert.throws(
    () =>
      extractTestimony(
        "<!-- agent-testimony:start -->\n<!-- Write freely here. -->\n<!-- agent-testimony:end -->",
      ),
    /testimony is empty/,
  );
});

test("buildDocument adds distributed project metadata without rewriting the testimony", () => {
  const result = buildDocument(event(), project);
  assert.equal(result.relativePath, "trust/2026/2026-08-14-trust-pr-42.md");
  assert.match(result.content, /language: "fr"/);
  assert.match(result.content, /project: "trust"/);
  assert.match(result.content, /categories: \["Agents","TRUST"\]/);
  assert.match(result.content, /tags: \["agent-testimony"\]/);
  assert.ok(
    result.content.endsWith(
      "I expected a small change. The difficult part was realizing that the boundary itself was unclear.\n\nI would leave that question visible for the next agent.\n",
    ),
  );
});

test("buildDocument rejects an invalid project slug", () => {
  assert.throws(
    () => buildDocument(event(), { ...project, slug: "../unknown" }),
    /project.slug/,
  );
});

test("CLI writes the collected document, pull request body, and outputs", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "agent-testimony-"));
  temporaryDirectories.push(directory);
  const eventPath = path.join(directory, "event.json");
  const outputRoot = path.join(directory, "inbox");
  const prBodyPath = path.join(directory, "pr-body.md");
  const githubOutput = path.join(directory, "github-output.txt");
  await Promise.all([
    writeFile(eventPath, JSON.stringify(event())),
  ]);

  const result = spawnSync(
    process.execPath,
    [
      path.resolve("tools/agent-testimony/collect.mjs"),
      "--event",
      eventPath,
      "--project-slug",
      "trust",
      "--project-label",
      "TRUST",
      "--categories",
      '["Agents","TRUST"]',
      "--tags",
      '["agent-testimony"]',
      "--output-root",
      outputRoot,
      "--pr-body",
      prBodyPath,
      "--github-output",
      githubOutput,
    ],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(await readFile(prBodyPath, "utf8"), /not rendered by Jekyll yet/);
  assert.match(
    await readFile(githubOutput, "utf8"),
    /file_path=editorial\/inbox\/agents\/trust\/2026\/2026-08-14-trust-pr-42.md/,
  );
});
