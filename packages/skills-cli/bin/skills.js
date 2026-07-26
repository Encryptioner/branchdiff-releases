#!/usr/bin/env node
// @encryptioner/branchdiff-skills — install branchdiff agent skills (SKILL.md,
// per the cross-agent Agent Skills standard). Defaults to Claude Code but
// works with any agent that reads plain SKILL.md files.
//
// Usage:
//   npx @encryptioner/branchdiff-skills add <skill-name> [more-skills...]
//   npx @encryptioner/branchdiff-skills add --agent opencode <skill-name>
//   npx @encryptioner/branchdiff-skills add all
//   npx @encryptioner/branchdiff-skills list
//
// Env overrides:
//   BRANCHDIFF_SKILL_AGENT target agent (default: claude; see KNOWN_AGENTS below)
//   BRANCHDIFF_SKILL_DEST  target dir   (overrides agent lookup entirely)
//   BRANCHDIFF_SKILL_REF   git ref      (default: master)
//   BRANCHDIFF_SKILL_REPO  GH repo      (default: Encryptioner/branchdiff-releases)

import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const REPO = process.env.BRANCHDIFF_SKILL_REPO || 'Encryptioner/branchdiff-releases';
const REF = process.env.BRANCHDIFF_SKILL_REF || 'master';
const BASE_URL = `https://raw.githubusercontent.com/${REPO}/${REF}/plugins/branchdiff-skills/skills`;

const KNOWN_SKILLS = ['branchdiff-review', 'branchdiff-resolve'];

// Agents whose skills dir this installer knows. `claude` and `agents` matter
// most: opencode already reads ~/.claude/skills, and `agents` is the
// tool-neutral ~/.agents/skills location several runtimes (Gemini CLI
// included) scan as a fallback. `opencode` uses its own XDG config dir.
// codex/gemini/openclaw are best-effort ~/.<agent>/skills per their own docs.
// Cursor is project-scoped only (.cursor/skills, no home dir) — pass
// BRANCHDIFF_SKILL_DEST directly for it.
const KNOWN_AGENTS = ['claude', 'opencode', 'agents', 'codex', 'gemini', 'openclaw'];

function agentDir(agent) {
  if (!KNOWN_AGENTS.includes(agent)) {
    fail(`unknown agent: ${agent}. Known: ${KNOWN_AGENTS.join(', ')} (or set BRANCHDIFF_SKILL_DEST directly)`);
  }
  if (agent === 'opencode') {
    return join(process.env.XDG_CONFIG_HOME || join(homedir(), '.config'), 'opencode', 'skills');
  }
  return join(homedir(), `.${agent}`, 'skills');
}

let agent = process.env.BRANCHDIFF_SKILL_AGENT || 'claude';
let DEST = process.env.BRANCHDIFF_SKILL_DEST || agentDir(agent);

function printUsage(stream = process.stderr, code = 2) {
  stream.write(
`Install branchdiff agent skills (SKILL.md).

Usage:
  branchdiff-skills add [--agent <name>] <skill-name> [more-skills...]
  branchdiff-skills add [--agent <name>] all
  branchdiff-skills list

Known agents: ${KNOWN_AGENTS.join(', ')} (default: claude)

Available skills:
  ${KNOWN_SKILLS.join('\n  ')}

Files are written to: ${DEST}/<skill>/SKILL.md
`
  );
  process.exit(code);
}

function fail(msg) {
  process.stderr.write(`error: ${msg}\n`);
  process.exit(1);
}

async function fetchSkill(name) {
  if (!KNOWN_SKILLS.includes(name)) {
    fail(`unknown skill: ${name}. Known: ${KNOWN_SKILLS.join(', ')}`);
  }

  const url = `${BASE_URL}/${name}/SKILL.md`;
  process.stderr.write(`fetching ${name} from ${url}\n`);

  const res = await fetch(url, { redirect: 'follow' });
  if (!res.ok) {
    fail(`HTTP ${res.status} fetching ${url}`);
  }

  const body = await res.text();
  if (!body.trim()) {
    fail(`empty response for ${name}`);
  }
  // Guard against HTML 404 pages slipping through.
  if (/^\s*<(!doctype|html)/i.test(body)) {
    fail(`got HTML instead of a SKILL.md for ${name} — check skill name and ref`);
  }

  const targetDir = join(DEST, name);
  const targetFile = join(targetDir, 'SKILL.md');
  await mkdir(targetDir, { recursive: true });
  await writeFile(targetFile, body, 'utf8');
  process.stderr.write(`installed: ${targetFile}\n`);
}

function expandArgs(args) {
  const out = [];
  for (const a of args) {
    if (a === 'all') out.push(...KNOWN_SKILLS);
    else out.push(a);
  }
  return out;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0) printUsage();

  const [cmd, ...rest] = argv;

  if (cmd === 'list') {
    process.stdout.write(`${KNOWN_SKILLS.join('\n')}\n`);
    return;
  }

  if (cmd === 'add') {
    let names = rest;
    if (names[0] === '--agent') {
      if (names.length < 2) fail('--agent: provide an agent name');
      agent = names[1];
      if (!process.env.BRANCHDIFF_SKILL_DEST) DEST = agentDir(agent);
      names = names.slice(2);
    }
    if (names.length === 0) {
      fail('add: provide one or more skill names (or "all")');
    }
    const skills = expandArgs(names);
    for (const s of skills) {
      // eslint-disable-next-line no-await-in-loop
      await fetchSkill(s);
    }
    process.stderr.write(`done. Restart ${agent} to pick up new skills.\n`);
    return;
  }

  if (cmd === '-h' || cmd === '--help') {
    printUsage(process.stdout, 0);
  }

  fail(`unknown command: ${cmd}. Try --help.`);
}

main().catch((e) => fail(e?.message ?? String(e)));
