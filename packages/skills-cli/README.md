# @encryptioner/branchdiff-skills

CLI to install [branchdiff](https://www.npmjs.com/package/@encryptioner/branchdiff) agent skills (`SKILL.md`, per the cross-agent Agent Skills standard). Defaults to Claude Code, but works with any agent that reads plain `SKILL.md` files — Claude Code, opencode, and others.

## Usage

```bash
npx @encryptioner/branchdiff-skills add branchdiff-review
npx @encryptioner/branchdiff-skills add branchdiff-resolve
npx @encryptioner/branchdiff-skills add all

# Target a different agent
npx @encryptioner/branchdiff-skills add --agent opencode branchdiff-review

# List available skills
npx @encryptioner/branchdiff-skills list
```

Each `add` downloads the skill's `SKILL.md` from the GitHub release repo and writes it to `<agent-dir>/<name>/SKILL.md`. Restart the agent to pick it up.

## Known agents

| Agent | Default directory |
|-------|--------------------|
| `claude` (default) | `~/.claude/skills` |
| `opencode` | `$XDG_CONFIG_HOME/opencode/skills` (usually `~/.config/opencode/skills`) — opencode also reads `~/.claude/skills`, so this is only needed if you have no `.claude` dir |
| `agents` | `~/.agents/skills` — tool-neutral location several runtimes (e.g. Gemini CLI) scan as a fallback |
| `codex`, `gemini`, `openclaw` | `~/.<agent>/skills` — best-effort, per each agent's own docs |

Cursor is project-scoped only (`.cursor/skills`, no home directory) — pass `BRANCHDIFF_SKILL_DEST=.cursor/skills` directly for it.

## Environment overrides

| Var | Default | Purpose |
|-----|---------|---------|
| `BRANCHDIFF_SKILL_AGENT` | `claude` | Target agent (see table above) |
| `BRANCHDIFF_SKILL_DEST` | *(derived from agent)* | Target directory — overrides agent lookup entirely |
| `BRANCHDIFF_SKILL_REF`  | `master`           | Git ref to pull from |
| `BRANCHDIFF_SKILL_REPO` | `Encryptioner/branchdiff-releases` | Source repo |

Useful for installing into a project-local `.claude/skills/` or pinning a specific release tag:

```bash
BRANCHDIFF_SKILL_DEST=./.claude/skills \
BRANCHDIFF_SKILL_REF=v1.6.0 \
  npx @encryptioner/branchdiff-skills add all
```

## Alternatives

- **Inside Claude Code:** `/plugin marketplace add Encryptioner/branchdiff-releases` then `/plugin install branchdiff-skills@branchdiff`.
- **Without Node:** `curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- branchdiff-review`.

## License

MIT
