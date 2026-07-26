#!/usr/bin/env sh
# Install a branchdiff skill (SKILL.md, per the cross-agent Agent Skills
# standard) into an agent's skills directory. Defaults to Claude Code but
# works with any agent that reads plain SKILL.md files.
#
# Usage:
#   curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- branchdiff-review
#   curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- --agent opencode branchdiff-review
#   curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- all
#
# Env overrides:
#   BRANCHDIFF_SKILL_AGENT  target agent (default: claude; see KNOWN_AGENTS below)
#   BRANCHDIFF_SKILL_DEST   target dir   (overrides agent lookup entirely)
#   BRANCHDIFF_SKILL_REF    git ref      (default: master)
#   BRANCHDIFF_SKILL_REPO   GH repo      (default: Encryptioner/branchdiff-releases)

set -eu

REPO="${BRANCHDIFF_SKILL_REPO:-Encryptioner/branchdiff-releases}"
REF="${BRANCHDIFF_SKILL_REF:-master}"
AGENT="${BRANCHDIFF_SKILL_AGENT:-claude}"
BASE_URL="https://raw.githubusercontent.com/${REPO}/${REF}/plugins/branchdiff-skills/skills"

# Skills shipped from this repo. Update when adding a new skill.
KNOWN_SKILLS="branchdiff-review branchdiff-resolve"

# Agents whose skills dir this installer knows. `claude` and `agents` are the
# two that matter most: opencode already reads ~/.claude/skills, and `agents`
# is the tool-neutral ~/.agents/skills location several runtimes (Gemini CLI
# included) scan as a fallback. `opencode` uses its own XDG config dir.
# codex/gemini/openclaw are best-effort ~/.<agent>/skills per their own docs.
# Cursor is project-scoped only (.cursor/skills, no home dir) — use
# BRANCHDIFF_SKILL_DEST=.cursor/skills directly for it.
KNOWN_AGENTS="claude opencode agents codex gemini openclaw"

agent_dir() {
  case "$1" in
    claude|codex|gemini|openclaw) printf '%s\n' "$HOME/.$1/skills" ;;
    opencode) printf '%s\n' "${XDG_CONFIG_HOME:-$HOME/.config}/opencode/skills" ;;
    agents) printf '%s\n' "$HOME/.agents/skills" ;;
    *) err "unknown agent: $1. Known: ${KNOWN_AGENTS} (or set BRANCHDIFF_SKILL_DEST directly)" ;;
  esac
}

log()  { printf '%s\n' "$*" >&2; }
err()  { printf 'error: %s\n' "$*" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || err "missing required command: $1"
}

usage() {
  cat <<EOF >&2
Install branchdiff agent skills (SKILL.md).

Usage:
  install-skill.sh [--agent <name>] <skill-name> [more-skills...]
  install-skill.sh [--agent <name>] all

Known agents: ${KNOWN_AGENTS} (default: claude)

Available skills:
  ${KNOWN_SKILLS}

Files are written to: ${DEST}/<skill>/SKILL.md
EOF
  exit 2
}

fetch_skill() {
  name="$1"

  case " ${KNOWN_SKILLS} " in
    *" ${name} "*) : ;;
    *) err "unknown skill: ${name}. Known: ${KNOWN_SKILLS}" ;;
  esac

  url="${BASE_URL}/${name}/SKILL.md"
  target_dir="${DEST}/${name}"
  target_file="${target_dir}/SKILL.md"

  mkdir -p "${target_dir}"

  log "fetching ${name} from ${url}"
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "${url}" -o "${target_file}.tmp"
  elif command -v wget >/dev/null 2>&1; then
    wget -q -O "${target_file}.tmp" "${url}"
  else
    err "neither curl nor wget is available"
  fi

  # Reject empty/HTML responses (e.g. 404 redirected through Pages).
  if [ ! -s "${target_file}.tmp" ]; then
    rm -f "${target_file}.tmp"
    err "downloaded file is empty — check skill name and ref"
  fi
  if head -1 "${target_file}.tmp" | grep -qi '^<!doctype\|^<html'; then
    rm -f "${target_file}.tmp"
    err "downloaded HTML, not a SKILL.md — check skill name and ref"
  fi

  mv "${target_file}.tmp" "${target_file}"
  log "installed: ${target_file}"
}

DEST="${BRANCHDIFF_SKILL_DEST:-$(agent_dir "${AGENT}")}"

# Consume a leading "--agent <name>" before the skill list.
if [ "${1:-}" = "--agent" ]; then
  [ $# -ge 2 ] || usage
  AGENT="$2"
  shift 2
  DEST="${BRANCHDIFF_SKILL_DEST:-$(agent_dir "${AGENT}")}"
fi

[ $# -eq 0 ] && usage

# Expand "all" into the known list.
expand_args() {
  for a in "$@"; do
    if [ "${a}" = "all" ]; then
      for s in ${KNOWN_SKILLS}; do printf '%s\n' "$s"; done
    else
      printf '%s\n' "$a"
    fi
  done
}

require_cmd mkdir

expand_args "$@" | while IFS= read -r skill; do
  [ -z "${skill}" ] && continue
  fetch_skill "${skill}"
done

log "done. Restart ${AGENT} to pick up new skills."
