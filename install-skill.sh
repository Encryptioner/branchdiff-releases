#!/usr/bin/env sh
# Install a branchdiff Claude Code skill into ~/.claude/skills/<name>/.
#
# Usage:
#   curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- branchdiff-review
#   curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- branchdiff-resolve
#   curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- all
#
# Env overrides:
#   BRANCHDIFF_SKILL_DEST   target dir   (default: $HOME/.claude/skills)
#   BRANCHDIFF_SKILL_REF    git ref      (default: master)
#   BRANCHDIFF_SKILL_REPO   GH repo      (default: Encryptioner/branchdiff-releases)

set -eu

REPO="${BRANCHDIFF_SKILL_REPO:-Encryptioner/branchdiff-releases}"
REF="${BRANCHDIFF_SKILL_REF:-master}"
DEST="${BRANCHDIFF_SKILL_DEST:-$HOME/.claude/skills}"
BASE_URL="https://raw.githubusercontent.com/${REPO}/${REF}/plugins/branchdiff-skills/skills"

# Skills shipped from this repo. Update when adding a new skill.
KNOWN_SKILLS="branchdiff-review branchdiff-resolve"

log()  { printf '%s\n' "$*" >&2; }
err()  { printf 'error: %s\n' "$*" >&2; exit 1; }

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || err "missing required command: $1"
}

usage() {
  cat <<EOF >&2
Install branchdiff Claude Code skills.

Usage:
  install-skill.sh <skill-name> [more-skills...]
  install-skill.sh all

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

log "done. Restart Claude Code to pick up new skills."
