#!/usr/bin/env node
//
// Validate that every demo endpoint in the compiled krakend.json has a
// matching MDX page in src/pages/use-cases/. Endpoints whose @comment
// starts with "Utility:" or "Internal:" are infrastructure (gateway-side
// plumbing, internal aggregators, static asset servers) and do not need
// docs pages — same filter the homepage uses in src/pages/index.tsx.
//
// Usage:
//   node scripts/validate-mdx.js
//
// Exit code: 0 if every demo endpoint has an MDX file (and no orphan MDX
// files exist), 1 otherwise. Intended for CI / pre-build sanity checks.

"use strict";

const fs = require("node:fs");
const path = require("node:path");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const KRAKEND_JSON = path.join(PROJECT_ROOT, "public/demo/data/krakend.json");
const USE_CASES_DIR = path.join(PROJECT_ROOT, "src/pages/use-cases");

const NON_DEMO_TAGS = new Set(["Utility", "Internal"]);

function createSlug(endpoint) {
    return endpoint
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/_/g, "-")
        .replace(/[^a-z0-9/-]/g, "")
        .replace(/(?!^)\//g, "-")
        .replace(/--+/g, "-")
        .replace(/-$/g, "")
        .replace("/", "");
}

function commentTag(endpoint) {
    return (endpoint["@comment"] || "").split(":")[0].trim();
}

function main() {
    const krakend = JSON.parse(fs.readFileSync(KRAKEND_JSON, "utf8"));
    const demoEndpoints = krakend.endpoints.filter(
        (ep) => !NON_DEMO_TAGS.has(commentTag(ep))
    );

    const expectedSlugs = new Set(demoEndpoints.map((ep) => createSlug(ep.endpoint)));
    const actualSlugs = new Set(
        fs.readdirSync(USE_CASES_DIR)
            .filter((f) => f.endsWith(".mdx"))
            .map((f) => f.replace(/\.mdx$/, ""))
    );

    const missing = [...expectedSlugs].filter((s) => !actualSlugs.has(s)).sort();
    const orphans = [...actualSlugs].filter((s) => !expectedSlugs.has(s)).sort();

    if (missing.length === 0 && orphans.length === 0) {
        console.log(`OK — every demo endpoint (${expectedSlugs.size}) has an MDX file, no orphans.`);
        process.exit(0);
    }

    if (missing.length > 0) {
        console.log("Missing MDX files for these demo endpoints:");
        for (const s of missing) console.log(`  - src/pages/use-cases/${s}.mdx`);
    }
    if (orphans.length > 0) {
        if (missing.length > 0) console.log("");
        console.log("Orphan MDX files (no matching demo endpoint):");
        for (const s of orphans) console.log(`  - src/pages/use-cases/${s}.mdx`);
    }
    process.exit(1);
}

main();
