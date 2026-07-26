# Claude Code Skills — Release & Distribution Guide

This repo ships two agent skills (`branchdiff-review`, `branchdiff-resolve`) via three install paths. `SKILL.md` is a cross-agent open standard (Anthropic's Agent Skills spec) that Claude Code, opencode, Codex CLI, Gemini CLI, Cursor, OpenClaw and others all read unchanged — so while the Claude plugin path is Claude-only, the `npx`/`curl` paths install into any of them. This doc covers the full layout, sync model, release steps, and gotchas.

## Where things live

```
.claude-plugin/marketplace.json        # Claude Code marketplace manifest (top-level)
plugins/branchdiff-skills/
  .claude-plugin/plugin.json           # Plugin manifest
  README.md                            # Plugin landing doc
  skills/
    branchdiff-review/SKILL.md         # Skill 1 (rendered)
    branchdiff-resolve/SKILL.md        # Skill 2 (rendered)
install-skill.sh                       # curl|sh installer at repo root
packages/skills-cli/                   # @encryptioner/branchdiff-skills (npm)
  package.json
  bin/skills.js                        # CLI entry — fetches SKILL.md via raw URL
  README.md
```

## Source of truth — do not edit SKILL.md by hand

The canonical skill content is **generated** from `../branchdiff/packages/cli/src/review-skill.ts` (functions `reviewSkillContent(name)` and `resolveSkillContent(name)` exported via `generateSkillFiles({ name })`).

Both `SKILL.md` files in this repo are the rendered output of those templates with `name = 'branchdiff'`. Editing them here drifts from the CLI-generated copy that `branchdiff skill add` writes into user repos. **Always edit the templates in the CLI source, then re-render and copy.**

## Three install paths — single artifact

All three methods point at the **same** `plugins/branchdiff-skills/skills/<name>/SKILL.md` files. There is no duplication.

| Path | User command | Pulls from |
|------|--------------|------------|
| Claude plugin | `/plugin marketplace add Encryptioner/branchdiff-releases` then `/plugin install branchdiff-skills@branchdiff` | Sparse clone of `plugins/branchdiff-skills/` subtree |
| npx CLI | `npx @encryptioner/branchdiff-skills add <name>` | `raw.githubusercontent.com/.../plugins/branchdiff-skills/skills/<name>/SKILL.md` |
| curl shell | `curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh \| sh -s -- <name>` | Same raw URL as npx |

Future install methods (e.g. a Homebrew skill cask) should point at the same path.

## Multi-agent install (opencode, Codex CLI, Gemini CLI, ...)

Both `npx` and `curl` paths accept `--agent <name>` (or `BRANCHDIFF_SKILL_AGENT`), resolved by a small known-agent table in `install-skill.sh` / `bin/skills.js`:

| Agent | Resolved directory |
|-------|---------------------|
| `claude` (default) | `~/.claude/skills` |
| `opencode` | `$XDG_CONFIG_HOME/opencode/skills` (opencode follows XDG; also reads `~/.claude/skills`, so this only matters if there's no `.claude` dir) |
| `agents` | `~/.agents/skills` — tool-neutral fallback location (Gemini CLI reads this as an alias; likely others per the open standard) |
| `codex`, `gemini`, `openclaw` | `~/.<agent>/skills` — best-effort, per each agent's own docs, not yet in upstream `review-skill.ts`'s `--target` list |

Cursor is project-scoped only (`.cursor/skills`, no home dir) — set `BRANCHDIFF_SKILL_DEST=.cursor/skills` directly.

This mirrors (but is not identical to) upstream `branchdiff skill add --target`, which additionally supports project-scoped variants (`claude-project`, `opencode-project`, `agents-project`) since it runs inside a checked-out repo — see `../branchdiff/packages/cli/src/review-skill.ts`'s `skillTargets()`. The releases-repo installers only do user-level (global) installs.

Both paths still honor:

| Var | Default | Purpose |
|-----|---------|---------|
| `BRANCHDIFF_SKILL_AGENT` | `claude` | Target agent (table above) |
| `BRANCHDIFF_SKILL_DEST` | *(derived from agent)* | Target directory — overrides agent lookup entirely |
| `BRANCHDIFF_SKILL_REF`  | `master`           | Git ref to pull from (use a tag to pin) |
| `BRANCHDIFF_SKILL_REPO` | `Encryptioner/branchdiff-releases` | Source repo |

Example — pin a release tag and install into a project-local skills dir:

```bash
BRANCHDIFF_SKILL_DEST=./.claude/skills \
BRANCHDIFF_SKILL_REF=v1.6.0 \
  npx @encryptioner/branchdiff-skills add all
```

Example — install into opencode explicitly:

```bash
npx @encryptioner/branchdiff-skills add --agent opencode all
```

## Release flow (when skill templates change)

1. **Edit templates** in `../branchdiff/packages/cli/src/review-skill.ts`.
2. **Re-render** with `name = 'branchdiff'`. Either:
   - Run a one-off Node script that imports `generateSkillFiles({ name: 'branchdiff' })` and writes the two files, or
   - Manually read each `reviewSkillContent` / `resolveSkillContent` body and copy into `plugins/branchdiff-skills/skills/<name>/SKILL.md`.
3. **Bump versions** — the plugin/marketplace version tracks the `branchdiff` CLI version it was rendered from (e.g. skill content rendered from CLI `v1.7.0` → plugin version `1.7.0`), so a user can tell which CLI release a skill matches at a glance:
   - `plugins/branchdiff-skills/.claude-plugin/plugin.json` → `version`
   - `.claude-plugin/marketplace.json` → `plugins[0].version` **and** `metadata.version`
4. **Bump `packages/skills-cli` version** independently (its own semver, not the CLI's) only if `bin/skills.js` itself changed — e.g. the `--agent` flag landing is a minor bump. Skill-content-only syncs don't need it.
5. **Commit + push to `master`.** GitHub Pages serves `install-skill.sh`; raw GitHub serves SKILL.md; the marketplace fetches both on `/plugin update`.
6. **Publish CLI to npm** (only when CLI changed):
   ```bash
   cd packages/skills-cli
   npm publish --access public
   ```

Today step 2 is **manual**. Automate via a `pnpm run sync-skills` script when frequency justifies it (similar to the existing `chore: sync content (guideline, changelog, readme)` automation seen in recent commits).

## Smoke tests

```bash
# 1. JSON manifests parse
node -e "require('./.claude-plugin/marketplace.json')"
node -e "require('./plugins/branchdiff-skills/.claude-plugin/plugin.json')"
node -e "require('./packages/skills-cli/package.json')"

# 2. CLI runs
node packages/skills-cli/bin/skills.js list
node packages/skills-cli/bin/skills.js --help

# 3. Shell installer syntax
sh -n install-skill.sh

# 4. End-to-end install dry run (writes to /tmp)
BRANCHDIFF_SKILL_DEST=/tmp/skills-smoke \
  node packages/skills-cli/bin/skills.js add branchdiff-review
ls /tmp/skills-smoke/branchdiff-review/SKILL.md
```

## Gotchas

- **GitHub Pages serves 404s as HTML.** Both `install-skill.sh` and `bin/skills.js` reject responses that look like HTML (regex on `<!doctype` / `<html`). Don't remove that guard — a typo'd skill name would otherwise silently write a 404 page into `~/.claude/skills/`.
- **`master` is the default branch.** All raw URLs and the curl installer default to it. Branch naming for skill work follows the global rule: `{feature}/master/v1/{description}`.
- **Don't pin plugin URLs to a tag.** The marketplace manifest is fetched at install time; users get whatever is on `master`. To force users onto a new skill version, bump `plugin.json` → `version`. Claude Code shows the diff on `/plugin update`.
- **`.claude/` is gitignored** (see top-level `.gitignore`). Personal Claude Code state never leaks into the public plugin tree. Don't add it.
- **`KNOWN_SKILLS` is hard-coded** in both `install-skill.sh` and `bin/skills.js`. When adding a new skill, update both lists or the new skill becomes uninstallable through the CLI/curl paths (the plugin path picks it up automatically from the folder).
- **`KNOWN_AGENTS`/`agent_dir()` is duplicated** the same way, in both installers. If upstream `skillTargets()` in `review-skill.ts` gains or renames a target (e.g. a real Codex/Gemini entry), update both installers to match rather than trusting third-party blog docs about where an agent's skills dir lives — upstream's own comments (e.g. "opencode follows the XDG spec") are the authoritative source when they conflict.
- **`.code-review-graph/graph.db` was built on `master`.** If you query it from a non-`master` branch, results may be stale — rebuild with `code-review-graph build` first.

## Adding a new skill

1. Add a template function in `../branchdiff/packages/cli/src/review-skill.ts` and export it from `generateSkillFiles`.
2. Create `plugins/branchdiff-skills/skills/<new-name>/SKILL.md` with the rendered output.
3. Append `<new-name>` to:
   - `KNOWN_SKILLS` in `install-skill.sh`
   - `KNOWN_SKILLS` in `packages/skills-cli/bin/skills.js`
   - The table in `plugins/branchdiff-skills/README.md`
   - The "Claude Code skills" section in the top-level `README.md`
4. Follow the release flow above.

## Removing a skill

Symmetric to adding — also leave a deprecation note in the plugin README for one release before deleting the folder, so users running `/plugin update` see the change.
