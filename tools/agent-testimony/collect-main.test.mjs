import assert from "node:assert/strict";
import { test } from "node:test";

import { buildMainDocument } from "./collect-main.mjs";

const project = {
  slug: "mcp-maket",
  label: "MCP Maket",
  categories: ["Agents", "MCP Maket"],
  tags: ["agent-testimony", "gestation"],
};
const source = {
  repository: "ng-galien/maket",
  ref: "main",
  commit: "abcdef1234567890",
  runId: "12345",
  runUrl: "https://github.com/ng-galien/maket/actions/runs/12345",
  actor: "ng-galien",
  submittedAt: "2026-08-14T13:15:00Z",
};

test("buildMainDocument preserves a free testimony from main", () => {
  const testimony =
    "The implementation moved quickly today. I am still unsure whether the document boundary is the right one.";
  const result = buildMainDocument(testimony, project, source);

  assert.equal(
    result.relativePath,
    "mcp-maket/2026/2026-08-14-maket-main-run-12345.md",
  );
  assert.match(result.content, /source_kind: "main"/);
  assert.match(result.content, /source_commit: "abcdef1234567890"/);
  assert.ok(result.content.endsWith(`${testimony}\n`));
});

test("buildMainDocument accepts a very short testimony", () => {
  const result = buildMainDocument(
    "Nothing surprising this time.",
    project,
    source,
  );
  assert.ok(result.content.endsWith("Nothing surprising this time.\n"));
});

test("buildMainDocument rejects an invalid commit", () => {
  assert.throws(
    () =>
      buildMainDocument("A testimony.", project, {
        ...source,
        commit: "not a commit",
      }),
    /source.commit/,
  );
});
