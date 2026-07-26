# branchdiff-releases

Public release-distribution site for the [`branchdiff`](https://github.com/Encryptioner/branchdiff) CLI. Serves the marketing landing page (GitHub Pages), platform installers (Homebrew tap, APT repo, Scoop bucket, standalone binaries), and a Claude Code plugin marketplace shipping the `branchdiff-review` / `branchdiff-resolve` skills.

This is **not** the source of truth for the CLI, the skills, or the docs. It is a distribution layer. Upstream code lives in `../branchdiff/`; content is synced in via CI.

## Repo layout

```
index.html, *.html              GitHub Pages landing + guideline + changelog pages
styles/, scripts/, assets/      Static site assets (no build step)
content/{GUIDELINE,CHANGELOG}.md  Synced from ../branchdiff via CI — do not edit

Formula/branchdiff.rb           Homebrew formula (macOS + Linux)
bucket/branchdiff.json          Scoop bucket manifest (Windows)
apt/, apt-repo/                 APT repo (dists, key.gpg, pool)

.claude-plugin/marketplace.json Claude Code marketplace manifest
plugins/branchdiff-skills/      The plugin — SKILL.md files + plugin.json
install-skill.sh                curl|sh installer for skills
packages/skills-cli/            @encryptioner/branchdiff-skills (npx)

DEVELOPMENT.md                  Local dev for the static site
docs/skills.md                  Full skill release / sync / install guide
README.md                       Public-facing landing doc
```

## What this repo does (and doesn't)

- **Does:** host distribution artifacts, the Pages site, the plugin marketplace, the npm-published `skills-cli`.
- **Does:** receive content sync commits from CI (`chore: sync content (guideline, changelog, readme) from source`).
- **Doesn't:** build, test, or compile the `branchdiff` CLI. Those live in `../branchdiff`.
- **Doesn't:** own the skill content — it ships the rendered output of `../branchdiff/packages/cli/src/review-skill.ts`.

## Common tasks

| Task | How |
|------|-----|
| Test the landing page locally | `python3 -m http.server 8080` (see [DEVELOPMENT.md](DEVELOPMENT.md)) |
| Ship a new CLI release | Cut release in `../branchdiff`; CI bumps `Formula/branchdiff.rb`, `bucket/branchdiff.json`, APT pool, and runs the content-sync commit here. |
| Edit / release a Claude Code skill | See below + [docs/skills.md](docs/skills.md) for the full walkthrough. |
| Update site copy | Edit `index.html` / `styles/main.css` / `scripts/main.js` directly — no build. |

`packages/skills-cli` is **deliberately not published to npm** (decided 2026-07-26 — the repo is ~330MB due to the `apt/` pool, making even a no-registry `npx github:...` fetch too heavy; `curl`/`--agent` already cover the same ground). There is no "publish the skills-CLI" task — if that decision changes, publish only when `bin/skills.js` itself changed.

## Working on Claude Code skills

Quick rules so you don't break the marketplace. Full detail in [docs/skills.md](docs/skills.md).

**Source of truth is upstream, not here.** The two `plugins/branchdiff-skills/skills/*/SKILL.md` files are the **rendered output** of `../branchdiff/packages/cli/src/review-skill.ts` (functions `reviewSkillContent` / `resolveSkillContent`, called via `generateSkillFiles({ name: 'branchdiff' })`). Never edit SKILL.md directly — edit the templates upstream and re-render. Hand-edits drift from what `branchdiff skill add` writes into user repos.

**Two live install paths, one artifact.** `/plugin install` and `curl install-skill.sh | sh` both pull the same SKILL.md files. (`npx @encryptioner/branchdiff-skills add` also exists in `packages/skills-cli` but is **not published** — see below — so don't document it as usable today.) Never duplicate content across the channels.

**SKILL.md is a cross-agent standard, not Claude-only.** The `curl` installer accepts `--agent <name>` (or `BRANCHDIFF_SKILL_AGENT`) to target opencode, Codex CLI, Gemini CLI, OpenClaw, or a tool-neutral `~/.agents/skills` fallback — see `docs/skills.md` § Multi-agent install. The `/plugin install` path is Claude Code-only by nature (it's Claude's own marketplace mechanism). Keep the `KNOWN_AGENTS`/`agent_dir()` table in `install-skill.sh` and `packages/skills-cli/bin/skills.js` in sync with each other, and prefer upstream `../branchdiff/packages/cli/src/review-skill.ts`'s `skillTargets()` as the source of truth over third-party docs when they disagree (e.g. opencode's real path is XDG-based, not `~/.opencode/skills`).

**When changing skill content** (templates upstream → render → commit here):

1. Re-render and overwrite `plugins/branchdiff-skills/skills/<name>/SKILL.md`.
2. Bump **both** `.claude-plugin/marketplace.json` (`plugins[0].version` and `metadata.version`) and `plugins/branchdiff-skills/.claude-plugin/plugin.json` (`version`). Keep them in lockstep, and match the `branchdiff` CLI version the content was rendered from (e.g. rendered from CLI `v1.7.0` → plugin `1.7.0`) — see main repo `CLAUDE.md` for the matching note. `packages/skills-cli`'s own version is independent — bump it only when `bin/skills.js` code changes.
3. Commit + push to `master`. No npm publish needed — plugin and curl both read raw GitHub at runtime.
4. `packages/skills-cli` is not published (see Common tasks above); no publish step applies unless that changes.

**When adding a new skill,** update **all** of these or it becomes uninstallable via curl:
- `KNOWN_SKILLS` in `install-skill.sh`
- `KNOWN_SKILLS` in `packages/skills-cli/bin/skills.js` (keep in sync even though unpublished, for when/if it ships)
- Plugin README table in `plugins/branchdiff-skills/README.md`
- "Claude Code skills" section in top-level `README.md`
- New folder `plugins/branchdiff-skills/skills/<new-name>/SKILL.md`

The plugin marketplace path picks new skills up automatically from the folder; the curl path requires the hard-coded `KNOWN_SKILLS` list update because it validates names before fetching (guard against HTML 404s).

**Smoke tests before pushing skill changes:**
```bash
node -e "require('./.claude-plugin/marketplace.json')"           # marketplace JSON parses
node -e "require('./plugins/branchdiff-skills/.claude-plugin/plugin.json')"  # plugin JSON parses
node packages/skills-cli/bin/skills.js list                       # CLI lists known skills
sh -n install-skill.sh                                            # installer shell syntax
```

**Don't add a build step to `packages/skills-cli`.** It's intentionally plain ESM JS using Node 18+ built-in `fetch`. It isn't published anyway (see above); a bundler would only matter if that changes.

## Install channels for end users

| Channel | What lands | Notes |
|---------|-----------|-------|
| `npm i -g @encryptioner/branchdiff` | The CLI itself | Primary path; published from `../branchdiff` |
| `pip install branchdiff` | Same CLI, Python wrapper | Published from `../branchdiff` |
| `brew install` / `scoop install` / `apt install` | Standalone binaries | This repo hosts the tap / bucket / APT files |
| `/plugin install branchdiff-skills@branchdiff` | Claude Code skills | Plugin marketplace defined here — see [docs/skills.md](docs/skills.md) |
| `curl ... install-skill.sh \| sh -s -- <name>` | Same skills, any `SKILL.md` agent via `--agent` | Shell installer for no-Node users |
| ~~`npx @encryptioner/branchdiff-skills add <name>`~~ | Not published — don't tell users to run this | `packages/skills-cli` exists in-repo for a possible future release only |

## Cross-repo dependencies

- **`../branchdiff/`** — source of truth for the CLI binary, content files, and skill templates. All artifacts here are downstream of it.
- **GitHub Releases** — binary tarballs referenced by Formula / Scoop / install scripts live there; tag pattern is `vX.Y.Z`.
- **npm registry** — two packages: `@encryptioner/branchdiff` (the CLI, published from upstream) and `@encryptioner/branchdiff-skills` (this repo's skills CLI).

## Conventions

- **Default branch** is `master` (not `main`). Branch names follow `{feature}/master/v1/{description}` per the global rule.
- **No build step.** The site is plain HTML + CSS + CDN-loaded Tailwind. Don't add a bundler.
- **`content/*.md` is CI-owned** — never hand-edit. Changes will be overwritten by the next sync commit.
- **`.claude/` is gitignored** — personal Claude Code state stays out of the public tree.
- **JSON manifests get bumped together** when shipping skill changes — see [docs/skills.md § Release flow](docs/skills.md#release-flow-when-skill-templates-change).

## Gotchas

- **GitHub Pages returns 404s as HTML, not HTTP 404.** Any tool that fetches files from Pages (install scripts, the skills CLI) must reject HTML responses. The existing installers already do this — preserve the check when modifying them.
- **Homebrew tap URL casing matters.** The formula uses lowercase `encryptioner/` in URLs; GitHub redirects but tooling that follows redirects strictly may fail.
- **APT repo is rebuilt by aptly state** in `apt/.aptly-state.tar.gz`. Don't hand-edit files under `apt/dists/` — round-trip through aptly or you'll corrupt the index.
- **`.code-review-graph/graph.db` was built on `master`.** Querying from another branch can be stale — rebuild with `code-review-graph build` if you rely on it.

## Where to look next

- Building the skill marketplace or shipping a skill update → [`docs/skills.md`](docs/skills.md)
- Editing the landing page → [`DEVELOPMENT.md`](DEVELOPMENT.md)
- Public install instructions → [`README.md`](README.md)
- Parent multi-repo guide → [`../CLAUDE.md`](../CLAUDE.md)
