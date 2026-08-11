import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the DevInsight analytics workspace", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>DevInsight/);
  assert.match(html, /Repository activity/);
  assert.match(html, /Insights &amp; actions/);
  assert.match(html, /Pull request performance/);
  assert.match(html, /Issue triage/);
  assert.match(html, /Sync now/);
  assert.match(html, /id="main-content"/);
  assert.match(html, /aria-controls="primary-navigation"/);
  assert.match(html, /role="group" aria-label="Analytics period"/);
  assert.match(html, /aria-expanded="false" aria-controls="insight-panel-review"/);
  assert.match(html, /id="insight-panel-review"/);
  assert.match(html, /href="#activity"/);
  assert.match(html, /href="#pull-requests"/);
  assert.match(html, /href="#issues"/);
  assert.match(html, /href="#contributors"/);
  assert.match(html, /aria-current="location"/);
  assert.match(html, /Contributor activity/);

  const overviewIndex = html.indexOf('id="overview"');
  const activityIndex = html.indexOf('id="activity"');
  const pullsIndex = html.indexOf('id="pull-requests"');
  const issuesIndex = html.indexOf('id="issues"');
  const contributorsIndex = html.indexOf('id="contributors"');
  assert.ok(overviewIndex >= 0 && overviewIndex < activityIndex);
  assert.ok(activityIndex < pullsIndex && pullsIndex < issuesIndex && issuesIndex < contributorsIndex);

  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton|ChatGPT/i);
  assert.doesNotMatch(html, /href="#"/);
});

test("removes disposable starter UI and keeps product metadata", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("app/page.tsx", projectRoot), "utf8"),
    readFile(new URL("app/layout.tsx", projectRoot), "utf8"),
    readFile(new URL("package.json", projectRoot), "utf8"),
  ]);

  assert.match(page, /DevInsight/);
  assert.match(page, /role="group" aria-label="Analytics period"/);
  assert.match(page, /aria-expanded=\{expanded\}/);
  assert.match(page, /followAnchor/);
  assert.match(page, /role="dialog"/);
  assert.match(layout, /Repository insights that lead to action/);
  assert.match(packageJson, /"name": "devinsight-frontend"/);
  assert.match(packageJson, /"lucide-react"/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  await assert.rejects(access(new URL("app/_sites-preview/SkeletonPreview.tsx", projectRoot)));
  await assert.rejects(access(new URL("app/chatgpt-auth.ts", projectRoot)));
});
