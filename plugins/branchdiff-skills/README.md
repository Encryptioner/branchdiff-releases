# branchdiff-skills

Two Claude Code skills that drive the [`branchdiff`](https://www.npmjs.com/package/@encryptioner/branchdiff) CLI:

| Skill | Slash command | What it does |
|-------|---------------|--------------|
| `branchdiff-review` | `/branchdiff-review` | Reads the current diff, posts inline review comments with severity tags. |
| `branchdiff-resolve` | `/branchdiff-resolve` | Reads open review threads, applies the requested code changes, marks threads resolved. |

Both skills work against a running `branchdiff` session (local web UI) or a GitHub / Bitbucket PR URL.

## Install

**Inside Claude Code:**

```text
/plugin marketplace add Encryptioner/branchdiff-releases
/plugin install branchdiff-skills@branchdiff
```

**Outside Claude Code (via `npx`):**

```bash
npx @encryptioner/branchdiff-skills add branchdiff-review
npx @encryptioner/branchdiff-skills add branchdiff-resolve
```

**Via `curl` (shell installer):**

```bash
curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- branchdiff-review
curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- branchdiff-resolve
```

## Prerequisites

The skills shell out to the `branchdiff` CLI. Install it once:

```bash
npm install -g @encryptioner/branchdiff
```

For PR URLs you also need either `gh` (GitHub) or `BITBUCKET_USERNAME` + `BITBUCKET_API_TOKEN` (Bitbucket).

## Source of truth

The canonical skill content lives in the [`branchdiff` repo](https://github.com/Encryptioner/branchdiff) at `packages/cli/src/review-skill.ts`. The files here are the rendered output of `branchdiff skill add`, kept in sync per release.

## License

MIT — see [LICENSE.md](https://github.com/Encryptioner/branchdiff-releases/blob/master/LICENSE.md).
