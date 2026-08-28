# branchdiff-releases

Public release-distribution site for the [`branchdiff`](https://github.com/Encryptioner/branchdiff) CLI. Serves the marketing landing page (GitHub Pages), platform installers (Homebrew tap, APT repo, Scoop bucket, standalone binaries), and a Claude Code plugin marketplace shipping the `branchdiff-review` / `branchdiff-resolve` skills.

This is **not** the source of truth for the CLI, the skills, or the docs. It is a distribution layer. Upstream code lives in `../branchdiff/`; content is synced in via CI.

## Repo layout

```
index.html, *.html              GitHub Pages landing + guideline + changelog pages
styles/, scripts/, assets/      Static site assets (no build step)
content/{GUIDELINE,CHANGELOG}.md  Synced from ../branchdiff via CI — do not edit
site-index.json                 RAG index for the site-aware AI chat widget — regenerate after content syncs (not CI-owned)

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
- **Does:** ship a site-aware AI chat widget ([private-chat](https://encryptioner.github.io/private-chat/)) on `index.html`, grounded on this site's content via `site-index.json` — see [RAG chat widget](#rag-chat-widget) below.
- **Doesn't:** build, test, or compile the `branchdiff` CLI. Those live in `../branchdiff`.
- **Doesn't:** own the skill content — it ships the rendered output of `../branchdiff/packages/cli/src/review-skill.ts`.

## Common tasks

| Task | How |
|------|-----|
| Test the landing page locally | From the repo root: `python3 -m http.server 8080`, open `http://localhost:8080/`. Must be HTTP, not `file://` (see Gotchas). Verify the hero **release badge** and install-section **channel chips** go live within ~1s (badge swaps from its static fallback to the highest version across channels) and the console stays clean. Force-refresh to bust cached JS. (see [DEVELOPMENT.md](DEVELOPMENT.md)) |
| Ship a new CLI release | Cut release in `../branchdiff`; CI bumps `Formula/branchdiff.rb`, `bucket/branchdiff.json`, APT pool, and runs the content-sync commit here. **Then regenerate `site-index.json`** (see below) — the sync workflow does not do this, so the RAG index goes stale on every release otherwise. |
| Edit / release a Claude Code skill | See below + [docs/skills.md](docs/skills.md) for the full walkthrough. |
| Update site copy | Edit `index.html` / `styles/main.css` / `scripts/main.js` directly — no build. |
| Refresh the RAG chat index | See [RAG chat widget](#rag-chat-widget) below. |

`packages/skills-cli` is **deliberately not published to npm** (decided 2026-07-26 — the repo is ~330MB due to the `apt/` pool, making even a no-registry `npx github:...` fetch too heavy; `curl`/`--agent` already cover the same ground). There is no "publish the skills-CLI" task — if that decision changes, publish only when `bin/skills.js` itself changed.

## Working on Claude Code skills

Quick rules so you don't break the marketplace. Full detail in [docs/skills.md](docs/skills.md).

- **Source of truth is upstream.** `plugins/branchdiff-skills/skills/*/SKILL.md` are rendered from `../branchdiff/packages/cli/src/review-skill.ts` (`generateSkillFiles({ name: 'branchdiff' })`). Never hand-edit SKILL.md — edit the templates upstream and re-render.
- **Two live install paths:** `/plugin install` and `curl install-skill.sh | sh` (`--agent <name>` for opencode/Codex/Gemini/etc). `packages/skills-cli`'s `npx` CLI is unpublished — don't document it as usable.
- **`--sparse` on `marketplace add` only works via the terminal `claude plugin marketplace add` CLI** — never the in-chat `/plugin marketplace add` slash command (it swallows the flag into the source string and errors).
- **Re-render safely:** `generateSkillFiles()` + `writeFileSync` per file — never awk/sed-split a combined stream (silently breaks frontmatter). Verify `head -c1 SKILL.md` is `-`, not a newline.
- **Release:** re-render → bump `marketplace.json` + `plugin.json` versions to match the branchdiff CLI version, in lockstep → commit + push to `master`. No npm publish needed or wanted.

Full detail (why, smoke tests, agent-targets table) is in [docs/skills.md](docs/skills.md) — read it before changing any of the above.

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

## RAG chat widget

`index.html` embeds [private-chat](https://encryptioner.github.io/private-chat/)'s floating AI chat widget (`window.PRIVATE_CHAT_CONFIG` + `<script id="aiChatEmbedScript">` near the end of the file). It's site-aware: a custom `getSections` scrapes `index.html`'s own `main > section` blocks, and `site-index.json` (committed at the repo root, served at `/site-index.json`) gives it cross-page recall over `guideline.html` and `changelog.html` too — so a visitor on `/` can ask a changelog/guideline question and get a grounded answer with a link to the right page. Only `index.html` runs the live widget; `guideline.html`/`changelog.html` have no chat UI of their own — they're indexed content only. Full mechanism: [private-chat's `docs/SITE-INTEGRATION.md`](https://github.com/Encryptioner/private-chat/blob/main/docs/SITE-INTEGRATION.md).

- **`site-index.json` is a static snapshot, not CI-owned.** Nothing regenerates it automatically — not `sync-content-to-public.yml` in `../branchdiff`, not any workflow in this repo. It goes stale the moment `content/GUIDELINE.md` or `content/CHANGELOG.md` changes (i.e. every CLI release).
- **Regenerate it after every content sync**, from the `private-chat` repo:
  ```bash
  # from ../private-chat
  python3 -m http.server 8099 --directory ../branchdiff-releases &   # serve latest local content
  pnpm build:site-index -- --url http://localhost:8099/ \
    --pages /,/guideline.html,/changelog.html \
    --out ../branchdiff-releases/site-index.json
  kill %1  # stop the local server

  # crawling localhost bakes localhost URLs into the output — rewrite before committing:
  sed -i '' 's#http://localhost:8099#https://encryptioner.github.io/branchdiff-releases#g' \
    ../branchdiff-releases/site-index.json
  ```
- Commit the regenerated `site-index.json` here. It's chunks-only (no vectors) — the widget embeds them at runtime with its own model, so there's nothing else to build.
- Prefer crawling a local server over the live deployed site: it reflects `content/*.md` immediately, with no wait for Pages to redeploy.

## Install channels for end users

| Channel | What lands | Notes |
|---------|-----------|-------|
| `npm i -g @encryptioner/branchdiff@latest` | The CLI itself | Primary path; published from `../branchdiff` |
| `pip install --upgrade branchdiff` | Same CLI, Python wrapper | Published from `../branchdiff` |
| `brew install` / `scoop install` / `apt install` | Standalone binaries | This repo hosts the tap / bucket / APT files |
| `/plugin install branchdiff-skills@branchdiff` | Claude Code skills | Plugin marketplace defined here — see [docs/skills.md](docs/skills.md) |
| `curl ... install-skill.sh \| sh -s -- <name>` | Same skills, any `SKILL.md` agent via `--agent` | Shell installer for no-Node users |
| ~~`npx @encryptioner/branchdiff-skills add <name>`~~ | Not published — don't tell users to run this | `packages/skills-cli` exists in-repo for a possible future release only |

## Cross-repo dependencies

- **`../branchdiff/`** — source of truth for the CLI binary, content files, and skill templates. All artifacts here are downstream of it.
- **GitHub Releases** — binary tarballs referenced by Formula / Scoop / install scripts live there; tag pattern is `vX.Y.Z`.
- **npm registry** — two packages: `@encryptioner/branchdiff` (the CLI, published from upstream) and `@encryptioner/branchdiff-skills` (this repo's skills CLI).
- **`../private-chat/`** — owns the chat widget (`embed.js`) this site loads by URL, and the `tools/build-site-index.mjs` crawler used to regenerate `site-index.json`. Not vendored — always used from its own repo checkout.

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
- **`file://` breaks the release badge.** `scripts/shared.js` (`loadVersionBadge`) probes npm / GitHub / PyPI plus same-origin `Formula/`, `bucket/`, `apt/` files and shows the **highest** shipped version in the header badge (`#version-badge`, all pages), hero badge (`#release-badge`, index), and channel chips (`#channel-status`, index) — results cached in `sessionStorage` per tab. Opening `index.html` directly leaves badges on static fallback. If every probe fails at runtime the page keeps the fallback silently, so a dead badge on the deployed site means checking the browser console, not the build.
- **`site-index.json` silently goes stale.** A missed regen after a content sync doesn't error or 404 — the chat widget just keeps answering from the old guideline/changelog text. No alert fires; check the diff manually after releases (see [RAG chat widget](#rag-chat-widget)).

## Where to look next

- Building the skill marketplace or shipping a skill update → [`docs/skills.md`](docs/skills.md)
- Editing the landing page → [`DEVELOPMENT.md`](DEVELOPMENT.md)
- Public install instructions → [`README.md`](README.md)
- Parent multi-repo guide → [`../CLAUDE.md`](../CLAUDE.md)
