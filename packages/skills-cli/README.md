# @encryptioner/branchdiff-skills

CLI to install [branchdiff](https://www.npmjs.com/package/@encryptioner/branchdiff) Claude Code skills into `~/.claude/skills/`.

## Usage

```bash
npx @encryptioner/branchdiff-skills add branchdiff-review
npx @encryptioner/branchdiff-skills add branchdiff-resolve
npx @encryptioner/branchdiff-skills add all

# List available skills
npx @encryptioner/branchdiff-skills list
```

Each `add` downloads the skill's `SKILL.md` from the GitHub release repo and writes it to `~/.claude/skills/<name>/SKILL.md`. Restart Claude Code to pick it up.

## Environment overrides

| Var | Default | Purpose |
|-----|---------|---------|
| `BRANCHDIFF_SKILL_DEST` | `~/.claude/skills` | Target directory |
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
