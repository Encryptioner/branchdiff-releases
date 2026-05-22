#!/usr/bin/env node
// @encryptioner/branchdiff-skills — install branchdiff Claude Code skills.
//
// Usage:
//   npx @encryptioner/branchdiff-skills add <skill-name> [more-skills...]
//   npx @encryptioner/branchdiff-skills add all
//   npx @encryptioner/branchdiff-skills list
//
// Env overrides:
//   BRANCHDIFF_SKILL_DEST  target dir   (default: ~/.claude/skills)
//   BRANCHDIFF_SKILL_REF   git ref      (default: master)
//   BRANCHDIFF_SKILL_REPO  GH repo      (default: Encryptioner/branchdiff-releases)

import { mkdir, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';

const REPO = process.env.BRANCHDIFF_SKILL_REPO || 'Encryptioner/branchdiff-releases';
const REF = process.env.BRANCHDIFF_SKILL_REF || 'master';
const DEST = process.env.BRANCHDIFF_SKILL_DEST || join(homedir(), '.claude', 'skills');
const BASE_URL = `https://raw.githubusercontent.com/${REPO}/${REF}/plugins/branchdiff-skills/skills`;

const KNOWN_SKILLS = ['branchdiff-review', 'branchdiff-resolve'];

function printUsage(stream = process.stderr, code = 2) {
  stream.write(
`Install branchdiff Claude Code skills.

Usage:
  branchdiff-skills add <skill-name> [more-skills...]
  branchdiff-skills add all
  branchdiff-skills list

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
    if (rest.length === 0) {
      fail('add: provide one or more skill names (or "all")');
    }
    const skills = expandArgs(rest);
    for (const s of skills) {
      // eslint-disable-next-line no-await-in-loop
      await fetchSkill(s);
    }
    process.stderr.write('done. Restart Claude Code to pick up new skills.\n');
    return;
  }

  if (cmd === '-h' || cmd === '--help') {
    printUsage(process.stdout, 0);
  }

  fail(`unknown command: ${cmd}. Try --help.`);
}

main().catch((e) => fail(e?.message ?? String(e)));
