<!-- AUTO-GENERATED - DO NOT EDIT IN THIS REPO. Source of truth: private repo. Edits here will be overwritten on the next release. -->

# User Guide

## Part 1 · Start here

Install branchdiff and get oriented. The five features just below are the whole story in brief — everything later in this guide expands one of them.

---

## What branchdiff does

branchdiff is a local-first tool for viewing diffs and reviewing code — by hand, with an AI assistant, or fully automatically. Five capabilities cover the whole tool:

- **View any diff** — working tree, commits, branches, tags, or a GitHub/Bitbucket PR, in split, unified, or full-file layouts, with Git, File, and Delta comparison modes
- **Comment inline with severity tags** — `[must-fix]`, `[suggestion]`, `[nit]`, `[question]`; comments persist across new commits when you compare named branches
- **Review with any AI** — `/branchdiff-review` and `/branchdiff-resolve` skills for Claude Code, opencode, and every `SKILL.md`-reading agent, or pipe any CLI through the review pipeline
- **Automate PR review** — `branchdiff auto` watches your open PRs, reviews the ones with new commits, and runs on a cron schedule or as a self-hosted bot
- **Sync with GitHub & Bitbucket** — push and pull comments, and approve, request changes, or merge a PR without leaving the toolbar

Everything later in this guide expands one of these. Start with [Getting started](#getting-started) to install, or skim the [Quick Reference](#quick-reference) for the command you need.

---

## Getting started

### Install

Choose your preferred installation method:

#### Option 1: npm (Node.js required)

```bash
npm install -g @encryptioner/branchdiff
```

Requires **Node.js 18+** and `git` on your PATH. Tab-completion installs automatically — restart your terminal after install.

#### Option 2: pnpm

```bash
pnpm add -g @encryptioner/branchdiff
```

#### Option 3: yarn

```bash
yarn global add @encryptioner/branchdiff
```

#### Option 4: Homebrew (macOS / Linux)

```bash
brew tap encryptioner/branchdiff https://github.com/encryptioner/branchdiff-releases
brew install branchdiff
```

No Node.js required — installs a single static binary.

#### Option 5: Standalone Binary (no Node.js required)

Download a precompiled binary for your platform from [GitHub Releases](https://github.com/encryptioner/branchdiff-releases/releases):

| Platform | Command |
|----------|---------|
| **macOS (Apple Silicon)** | `curl -fsSL -o branchdiff https://github.com/encryptioner/branchdiff-releases/releases/latest/download/branchdiff-darwin-arm64 && chmod +x branchdiff` |
| **Linux (x64)** | `curl -fsSL -o branchdiff https://github.com/encryptioner/branchdiff-releases/releases/latest/download/branchdiff-linux-x64 && chmod +x branchdiff` |
| **Linux (ARM64)** | `curl -fsSL -o branchdiff https://github.com/encryptioner/branchdiff-releases/releases/latest/download/branchdiff-linux-arm64 && chmod +x branchdiff` |
| **Windows** | Download [`branchdiff-win-x64.exe`](https://github.com/encryptioner/branchdiff-releases/releases/latest) from the Releases page |

#### Option 6: Run without installing

```bash
npx @encryptioner/branchdiff main..feature
```

Requires **Node.js 18+** and `git` on your PATH.

#### Option 7: pip / uv / pipx (universal)

```bash
pip install branchdiff
```

Also works with `uv tool install branchdiff` or `pipx install branchdiff`. Auto-selects the correct binary for your OS and architecture. No Node.js required.

#### Option 8: Scoop (Windows)

```powershell
scoop bucket add branchdiff https://github.com/encryptioner/branchdiff-releases
scoop install branchdiff
```

No Node.js required — installs a single static `.exe`.

#### Option 9: apt (Debian / Ubuntu)

One-time GPG key setup:

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://encryptioner.github.io/branchdiff-releases/apt/key.gpg \
  | gpg --dearmor \
  | sudo tee /etc/apt/keyrings/branchdiff.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/branchdiff.gpg arch=amd64,arm64] https://encryptioner.github.io/branchdiff-releases/apt stable main" \
  | sudo tee /etc/apt/sources.list.d/branchdiff.list
sudo apt update && sudo apt install branchdiff
```

---

### Supported platforms

| | Supported |
|---|---|
| **OS** | Linux (any distro — including older LTS releases like Ubuntu 18.04/20.04), macOS, Windows |
| **Node.js** (npm/pnpm/yarn/npx installs only — not needed for the standalone binary, Homebrew, Scoop, pip/uv/pipx, or apt) | 18+ |
| **git** | Any version. Older `git` (pre-2.31, e.g. the git 2.17/2.25 that ships by default on Ubuntu 18.04/20.04) is fully supported — repo-root resolution detects and falls back cleanly when a `git` build predates a flag branchdiff prefers. |

`branchdiff auto cron add`/`cron list`/`cron remove` are **Unix only** — not available on Windows. On macOS they're backed by launchd (user LaunchAgents); on Linux by `cron`/`crond` crontab entries. The `--start`/`--end` cron-expr vocabulary and `cronId` are the same on both. Everything else, including a plain `--watch` loop without `cron`, works identically on every OS above.

---

### Update branchdiff

```bash
branchdiff update
```

The `update` command auto-detects your installation method and runs the appropriate upgrade command. It resolves symlinks and queries package manager stores for reliable detection:

| Detected method | Update command |
|---|---|
| **npm** | `npm install -g @encryptioner/branchdiff@latest` |
| **pnpm** | `pnpm add -g @encryptioner/branchdiff@latest` |
| **yarn** | `yarn global add @encryptioner/branchdiff@latest` |
| **Homebrew** | `brew upgrade branchdiff` |
| **pip / uv / pipx** | `pip install --upgrade branchdiff` |
| **Scoop** | `scoop update branchdiff` |
| **apt** | `sudo apt update && sudo apt install --only-upgrade branchdiff` |
| **Standalone binary** | Downloads the latest binary from GitHub Releases |

Before updating, the command shows the detected package manager, binary path, and update command it will run:

```
Package manager : pnpm
Binary path     : /Users/you/.nvm/versions/node/v24/bin/branchdiff
Update command   : pnpm add -g @encryptioner/branchdiff@latest
```

If the update fails, all alternative update commands are listed along with the `--pm` override flag.

To override detection:

```bash
branchdiff update --pm npm      # Force npm
branchdiff update --pm brew     # Force Homebrew
branchdiff update --pm pip      # Force pip
branchdiff update --pm scoop    # Force Scoop
branchdiff update --pm apt      # Force apt
branchdiff update --pm binary   # Force standalone binary download
```

To see what was detected without updating, check the **Installation** section in `branchdiff info`:

```
Installation
  Package mgr : pnpm
  Binary      : /Users/you/.nvm/versions/node/v24/bin/branchdiff
  Resolved    : /Users/you/Library/pnpm/global/5/node_modules/@encryptioner/branchdiff/dist/index.js
  Update cmd  : pnpm add -g @encryptioner/branchdiff@latest
```

Detection resolves symlinks to find the actual package manager store, checks `pnpm list -g` / `npm list -g` for explicit ownership, and falls back to checking which package managers are available on the system.

### Quick Reference

| I want to… | Command |
|---|---|
| See my uncommitted changes | `branchdiff` |
| Compare with main | `branchdiff main` |
| Compare two branches | `branchdiff main feat` |
| View a GitHub PR | `branchdiff https://github.com/owner/repo/pull/123` |
| View a Bitbucket PR | `branchdiff https://bitbucket.org/workspace/repo/pull-requests/123` |
| Browse repo files | `branchdiff tree` |
| Review a PR without switching branches | `branchdiff <pr-url> --worktree` |
| Auto-review my open PRs | `branchdiff auto --tool claude` |
| Auto-review PRs across all my repos | `branchdiff auto --repo-paths ~/work --tool claude` |
| Browse commit history | `branchdiff history` |
| Browse the repo at an old commit | `branchdiff show HEAD~5` |
| Browse branches & tags | `branchdiff branches` |
| Search code across the repo | `branchdiff search "TODO"` |
| Export session data | `branchdiff export --all` |
| Import session data | `branchdiff import backup.json` |
| View last commit | `branchdiff HEAD~1` |
| Compare branch vs parent | `branchdiff -p` |
| Compare branch vs 3rd commit back | `branchdiff -p 3` |
| Inspect a single commit | Click any commit in the sidebar while viewing a branch diff |
| Show repo info & installation | `branchdiff info` |
| Clear UI state | `branchdiff state reset` |
| Show PR status | `branchdiff pr info [--json]` |
| Create a PR | `branchdiff pr create --title "Fix" --source feat --dest main` |
| Merge a PR | `branchdiff pr merge` |
| Approve a PR | `branchdiff pr approve --comment "LGTM"` |
| Push comments to PR | `branchdiff sync push` |
| Pull comments from PR | `branchdiff sync pull` |
| Show active session | `branchdiff session current` |
| Archive session | `branchdiff session archive` |
| Review with a clean slate | `branchdiff review run --exec "claude -p" --fresh` |
| Resolve a thread on the PR too | `branchdiff agent resolve <id> --sync` |
| Target one of several sessions | `branchdiff agent list --port 5391` |
| AI agent reference | `branchdiff agent guide` |
| Dark mode / unified view | `branchdiff main --dark --unified` |
| Clean up stale PR worktrees across repos | `branchdiff prune-worktrees --repo-paths ~/work` |

Any ref works: branch name, commit SHA, tag, `HEAD~N`, `origin/<branch>`.

---

## Part 2 · View & explore

Look at a diff and move around a repository: themes, the diff view itself, the comparison modes, the file browser, navigation shortcuts, and code tours. These are the things you do by hand, before any review or automation.

---

## Themes & appearance

### Light and dark mode

branchdiff respects your system preference automatically — no configuration needed.

**Override from the CLI:**

```bash
branchdiff --dark           # force dark theme
```

**Toggle in the browser:**

- Use the **Right side toolbar in top of each page -> 3-dot menu → Dark mode / Light mode**

The theme applies to the entire UI: toolbar, diff view, comments, file browser, and this guideline page.

### Split vs. unified view

**Split view** (default) shows old and new content side-by-side — ideal for comparing changes at a glance.

**Unified view** shows a single column with `+`/`-` markers — compact and familiar for terminal users.

Switch via the toolbar toggle or keyboard: press `s` for split, `u` for unified.

### Full file view

When comparing branches, a **Full** option appears in the view mode toggle. This renders the complete file content side-by-side — useful when you need to see the full picture, not just changed lines.

- **Inline comments** — click any line number to add, edit, or view comment threads, just like in split/unified view
- **Scroll markers** — a thin minimap strip alongside the scroll area shows old/new (red/green) status markers, so you can jump to changes instantly without scrolling in both `Split` and `Unified` view. Click any marker to jump to that line.
- **Line-by-line navigation** — in split view, scroll is automatically synchronized between left and right panes (toggle via "Sync scroll" checkbox)
- **History** — the **History** button opens the file browser to this file, on the newer side of the comparison, with its commit history already open, in a new tab
- **View mode toggle** — the Full view is modal-based; use Close (Esc) or the X button to return to the diff view
- **Markdown preview** — for `.md`, `.mdx`, `.markdown`, and other markdown files, a **Preview** checkbox appears in the view controls. When checked, both the old and new file are rendered as formatted markdown side-by-side instead of raw source code. Comments are hidden in preview mode since line numbers don't align to rendered output. Useful for documentation-heavy PRs where you want to read the final output rather than the raw diff.

---

## Viewing diffs

### Working tree changes

```bash
branchdiff              # unstaged + staged
branchdiff staged       # only staged
branchdiff unstaged     # only unstaged
```

### Recent commits

```bash
branchdiff HEAD~1       # last commit
branchdiff HEAD~5       # last 5 commits
```

### Previous commit comparison

```bash
branchdiff -p 0                     # only unstaged changes (alias for `branchdiff unstaged`)
branchdiff -p                       # current branch vs its parent (HEAD~1)
branchdiff -p 3                     # current branch vs 3 commits back (HEAD~3)
branchdiff -p 2 feature             # feature vs feature~2
branchdiff --previous 5 feature     # same, long form
```

Compares a branch against the Nth previous commit — useful for reviewing one or more commits on a branch. Defaults to N=1 (parent commit). Cannot be combined with `--base`/`--compare`.

**N=0 special case** — shows only unstaged working-tree changes: tracked files modified but not yet staged, plus new untracked files (same scope `git status` reports as unstaged). Equivalent to `branchdiff unstaged`. Useful when reviewing what an AI coding agent just changed before staging. Does not accept a source ref — `branchdiff -p 0 feature` is rejected because unstaged changes are repo-local, not branch-relative.

### Comparing branches or refs

```bash
branchdiff main                 # main vs. current branch
branchdiff main feat            # two branches
branchdiff main..feat           # range syntax (same result)
branchdiff v1.0.0 v2.0.0        # tags
branchdiff 1df74cc 3b9a54d      # commit SHAs
branchdiff origin/main feat     # remote + local
```

Anything `git rev-parse --verify` accepts works.

#### Branches are brought up to date first

Comparing `development..feature` compares your **local** copies of those branches. A destination branch you haven't checked out in weeks would otherwise be compared as it looked back then, and every review built on that diff would describe an old revision.

So before opening a comparison, branchdiff fetches and fast-forwards the branches you named:

- **Not here at all, but on a remote** → created locally from the remote and set to track it, so `git pull` on it works afterwards. This covers a branch a colleague pushed after your last fetch: branchdiff asks the remote itself rather than giving up on a branch that plainly exists.
- **Behind its remote** → fast-forwarded, and you're told which branch moved.
- **Diverged** (you have local commits the remote doesn't) → left exactly as it is, with a warning. Your commits are never discarded.
- **Currently checked out with uncommitted changes** → left alone, with a warning. Nothing touches your working files.
- **Currently checked out and clean** → fast-forwarded like `git pull --ff-only`, reported prominently since it moves files under you.
- **No remote, a tag, a SHA, `HEAD~3`, or a working-tree ref** → nothing to sync, skipped silently.

Pass `--no-sync` to skip the step — useful offline, or when you deliberately want to compare the local revision:

```bash
branchdiff development feature --no-sync
```

### Individual commit detail view

When viewing a branch comparison, the **commit history** panel lists all commits on the source branch. Merge commits are marked with a purple **merge** badge so you can spot them at a glance without opening each one. The filter row has an **expand** button (next to the search input) that grows the commit list to fill the rest of the sidebar — and auto-collapses the Files section while expanded — so long commit lists are easy to scan. Click it again to restore both sections. Click any commit to open its detail page:

- **Metadata header** — full commit SHA (click to copy), author, date, and commit message. Merge commits show both parent SHAs as clickable links so you can navigate up the ancestry chain.
- **File list sidebar** — all changed files with a git status indicator (**A** = added, **D** = deleted, **M** = modified, **R** = renamed) and per-file `+N / -N` counts. Click any file to jump directly to its diff.
- **Diff view** — unified or split diff with syntax highlighting. Use the view toggle in the header to switch modes.
- **Session comments** — if you opened the commit from a branch comparison that has active review comments, those threads appear alongside the diff as view-only. This lets you see existing feedback while inspecting individual commits.

Use the **Back** button (or browser back) to return to the originating branch comparison. The session context is preserved.

### Viewing a GitHub PR

```bash
branchdiff https://github.com/owner/repo/pull/123
```

Requires `gh` CLI installed and authenticated (`gh auth login`).

### Viewing a Bitbucket PR

```bash
branchdiff https://bitbucket.org/workspace/repo/pull-requests/123
```

Requires authentication — the CLI checks for Bitbucket credentials via environment variables (`BITBUCKET_USERNAME` and `BITBUCKET_API_TOKEN`) or `~/.branchdiff/credentials.json` — see [Bitbucket](#bitbucket) for the full setup and required scopes. Automatically detects the base and source branches, handles cross-repo PRs (forks), and displays branch info in the terminal.

---

## Diff modes

### Git mode (default)

Standard `git diff branch1..branch2` — compares commit ancestry.

```bash
branchdiff main feat            # git mode is the default
branchdiff main feat --mode git
```

### File mode

Compares actual file content (blob hashes) at each branch tip, ignoring commit history. Use when branches may have converged via rebase/cherry-pick.

```bash
branchdiff main feat --mode file
```

Example: both branches added the same line via different commits.
- **File mode** → no change (content is identical)
- **Git mode** → modified (commit paths differ)

### Delta mode (Δ) — browser only

Available via the toolbar toggle. Shows what the two modes disagree on:
- **Git-only (amber)** — appears in git diff but not file diff
- **File-only (blue)** — appears in file diff but not git diff
- **Shared** — both modes agree

Useful for detecting silent merge conflict resolutions that git diff misses.

---

## The file browser

```bash
branchdiff tree              # browse the repo file tree
```

Navigate the full repository structure in a sidebar tree. Click any file to preview it in the main area.

**Supported previews:**
- **Source code** — syntax highlighting for 50+ languages
- **Markdown** — rendered with GitHub-flavored markdown
- **SVG** — rendered as image
- **Images** — inline preview

Use the sidebar collapse button to maximize the file preview area.

### History & repo-at-a-commit

```bash
branchdiff history                     # commits up to HEAD
branchdiff history main..feature       # commits on feature but not main
branchdiff history v1.2.0 --no-merges  # up to a tag, merges hidden
branchdiff show HEAD~5                 # browse the repo as it looked 5 commits ago
branchdiff show v1.2.0 --path src      # ...opening src/ at that tag
```

`history` lists commits from the start of the repo up to any ref or range, with search and a **Merges**/**Graph** toggle pair — both stay highlighted while active and compose together, so turning one on never silently switches the other off; click a commit for the full diff view. The header shows how many commits match, **Load all** fetches the rest of the list in one go, and hovering a commit reveals copy-hash and open-in-new-tab buttons.

`show <ref>` opens the file browser pinned to that ref — the whole repository as it was at that commit, tag, or branch. A banner shows which ref you're on, and one click returns you to the working tree. Without a ref the browser stays on your working tree, untracked files and all.

Inside the browser, open any file and press **History** to see that file's own commit log (it follows renames, so a moved file keeps its full history).

---

## Navigating the diff view

### The toolbar

The top toolbar adapts to your current session and shows relevant controls:

- **File / Git / Delta** mode switcher — choose how diffs are compared
- **Expand all / Collapse all** buttons — expand or collapse all file diffs at once (toggle based on current state)
- **Unified / Split / Full** view mode toggle — choose your diff layout
- **Include staged / Include unstaged** — layer your staged or unstaged changes onto a branch comparison (appear when your checked-out branch is one side of it)
- **Comment actions** — navigate threads (previous/next), comment count, copy for AI review, archive session, view history
- **3-dot menu** — theme toggle, whitespace display, keyboard shortcuts, this guideline, changelog, and links

### Sidebar filtering

Filter badges appear at the top of the file sidebar to narrow the file list by state:

- **Commented** / **Uncommented** — files with or without open review comments
- **Resolved** — files with resolved comment threads, whether resolved locally or on the remote platform (GitHub/Bitbucket) — the fastest way to find review feedback that's already been addressed
- **Viewed** / **Unviewed** — files marked as reviewed or not yet seen
- **Stale** — files that were viewed but have since changed (amber dot indicator)
- **Collapsed** / **Expanded** — minimized or expanded diffs
- **Staged** / **Unstaged** — files with staged or unstaged changes; visible on the plain working-tree view (`branchdiff`/`branchdiff work`) and, in a branch comparison, once "Include staged"/"Include unstaged" is checked

File rows also show inline status badges: **S** (staged, accent), **U** (unstaged, amber), amber dot (stale — file changed since viewed), checkmark (viewed), an accent comment-count pill (open threads), and a green check-circle pill (resolved threads, same local-or-remote scope as the **Resolved** filter).

Badges auto-hide when inapplicable (e.g., "Commented"/"Resolved" disappear if no matching comments exist, "Staged"/"Unstaged" hidden outside working tree mode). Clicking a badge activates it; clicking again clears it. Only one badge in each pair is active at a time. The **Clear** button resets all filters.

With the **Commented** or **Resolved** badge active, clicking a file in the tree does more than open it — it scrolls straight to that file's first matching thread and expands it (even a resolved thread whose line falls outside the diff's visible hunks, which otherwise sits collapsed inside a closed "outdated comments" panel). With neither badge active, clicking a file just opens it at the top, same as before.

Filters stack with the search box — narrow by text and state simultaneously.

### Right-click context menu

Right-click anywhere in the file tree for quick access to bulk operations:

- **On a folder:** View all / Unview all files in that folder; Expand all / Collapse all diffs in that folder
- **On a file:** View / Unview the file; Expand / Collapse its diff

The menu shows only relevant actions based on the current state — e.g., if all files in a folder are already expanded, only "Collapse all" is shown.

### Marking files as reviewed

Click the **eye icon** on any file header (or press `r`) to mark it as reviewed. The toolbar shows a progress indicator tracking how many files you have reviewed. If a viewed file's content changes later, it's automatically flagged as **stale** (amber dot) so you can re-review it — filter by the **Stale** badge to find them.

Use **View all** and **Unview all** buttons in the toolbar for batch operations on all files, or right-click any folder in the file tree and select **View all** / **Unview all** to bulk-update files within that folder.

### Expanding and collapsing diffs

By default, large diffs (200+ lines) are collapsed behind an "Expand large diff" placeholder to keep the UI responsive.

**Toolbar controls:**
- **Expand all** button — expand every collapsed diff in the current view
- **Collapse all** button — collapse all expanded diffs

**Right-click menu:**
- Right-click any folder to see **Expand all** / **Collapse all** for all files under that folder
- Right-click any individual file to **Expand** or **Collapse** its diff

The toolbar indicator shows the current state (all expanded, mixed, or all collapsed).

### Swapping branches

When comparing two branches, a **Swap** button appears in the toolbar. Click it (or use the ↔ arrow) to reverse which branch is base vs. compare.

### Behind-by indicator

If the right branch is behind the left branch, an amber **"↓ N behind"** badge appears in the toolbar, so you know the diff excludes those trailing commits.

---

## Code tours

A **code tour** is a guided walkthrough of your codebase — each step links to a specific file and line, with an explanation. Tours are created by AI agents or manually via the `agent` commands.

### Create a tour

```bash
branchdiff agent tour-start --topic "How does auth work?" --body "Overview of the request auth flow"
# → prints tour ID

branchdiff agent tour-step --tour <id> --file src/auth.ts --line 10 --body "Entry point — request hits this middleware first"
branchdiff agent tour-step --tour <id> --file src/auth.ts --line 42 --body "Token is validated here against the session store"
branchdiff agent tour-step --tour <id> --file src/session.ts --line 8 --body "Session schema — note the expiry field"

branchdiff agent tour-done --tour <id>   # mark as ready to view
```

Add `--json` to any `tour-start` call to receive the tour object as JSON (useful for AI agents).

### View tours

Once a tour is marked ready, open the branchdiff diff view and click the **compass icon** in the toolbar (top right). A dropdown lists all ready tours for the current session, each showing its topic and step count. Click any tour to open it in a new tab.

Inside the tour, a step-by-step panel opens on the right. Each step jumps to the relevant file and highlights the target lines. Use the numbered circles or the arrow buttons to move between steps. Click **Back** (top left) to return to the diff view.

Steps support multi-line ranges via `--end-line`. Step bodies support Markdown, Mermaid diagrams, and clickable `focus:` line references.

### AI-generated tours (Workflow 3)

Use the AI Tour workflow to have an AI create a tour automatically:

```
You are creating a guided code tour using branchdiff.
1. Start: branchdiff agent tour-start --topic "<topic>" --body "<overview>" --json
2. Add 5–12 steps: branchdiff agent tour-step --tour <id> --file <path> --line <n> --body "<explanation>"
3. Finish: branchdiff agent tour-done --tour <id>
```

---

## Part 3 · Review

Comment on a diff and drive an AI through it. This part rises in automation within itself — manual inline comments, then AI skills you invoke, then the agent commands both use — but every step is one you start. Fully unattended review is the next part.

---

## Review sessions

branchdiff tracks inline comments in a local SQLite database. How sessions work depends on what you're comparing:

### Branch comparisons — persistent

When comparing two named branches, tags, or remote branches, your review comments **persist across new commits**. Reopening the same comparison always shows previous comments — just like a GitHub PR thread.

```bash
branchdiff main..feature     # comments survive new commits to either branch
```

To start a fresh review (archive current comments and begin empty):

```bash
branchdiff main..feature --new          # archive + restart
# or: click "New review" in the browser toolbar
```

### PR-linked sessions reset automatically on a new PR

If the compared branches also match an open GitHub/Bitbucket PR, branchdiff remembers that PR's number alongside the session. If that PR closes and a **different** PR later opens for the same branch names, branchdiff notices the PR number changed — the next time it looks up the PR (opening the diff, `branchdiff auto`, or `review run --url`) — and starts a fresh session automatically, same effect as `--new` but without you having to remember it. The old PR's comments are archived, not deleted; see them with `branchdiff session history`.

### Snapshot reviews — ephemeral

Working tree, staged changes, or a specific commit get their own session per HEAD state. Making a new commit creates a new session — old comments are not shown.

### Summary

| Comparison type | Comments survive new commits? | Start fresh |
|---|---|---|
| `branchdiff main..feature` | Yes | `--new` or "New review" button |
| `branchdiff HEAD~1` | No — new commit = new session | — |
| `branchdiff` (working tree) | No — new commit = new session | — |

---

## Inline comments

### Posting comments

Click the **+** button that appears on any diff line to start a comment thread. The editor is a live WYSIWYG editor — markdown formatting applies as you type, so what you see is what gets posted. No Write/Preview toggle needed.

**Formatting shortcuts:**

| Shortcut | Result |
|---|---|
| `**text**` or `Ctrl+B` | **Bold** |
| `*text*` or `Ctrl+I` | *Italic* |
| `` `code` `` | `inline code` |
| ` ``` ` then Enter | fenced code block |
| `# `, `## `, `### ` | Heading levels |
| `- ` or `* ` | Bullet list |
| `1. ` | Numbered list |
| `> ` | Blockquote |
| `~~text~~` | ~~Strikethrough~~ |
| `[text](url)` | Hyperlink |
| `Shift+Enter` | Hard line break within a paragraph |
| `ArrowDown` (inside code block) | Exit code block and continue below |

Comments are stored as standard GitHub-Flavored Markdown and render correctly when synced to GitHub or Bitbucket. Every thread's first comment shows a small "reviewed at `<sha>`" line underneath (plus `file:line` for inline threads) — visible here and, once you `sync push`, on the remote PR comment too — so it's always clear which commit a finding applies to. Because that line changes with the commit, `sync push` recognizes an already-posted comment by its remote id rather than its exact text, so running it again after the PR picks up new commits never reposts what's already there.

### Severity tags

Use tags in your comment body to categorize feedback:

| Tag | Meaning |
|---|---|
| `[must-fix]` | Bug, security issue, data loss — must be fixed before merge |
| `[suggestion]` | Improvement, not required |
| `[nit]` | Style, naming, cosmetic |
| `[question]` | Unclear behavior, needs clarification |

Tags appear as colored badges in the UI, making it easy to scan comment threads by severity.

### Thread lifecycle

- **Open** → newly posted comment
- **Resolved** → the issue was addressed (click resolve or AI resolves)
- **Dismissed** → won't fix / by design (click dismiss or AI dismisses)

### Thread navigation

Use the **comment count button** in the toolbar to see a dropdown of all open threads. Click any thread to jump directly to it. The toolbar also shows counts for open vs. resolved threads.

### General-comments jump

When unresolved **general** PR comments exist (comments not tied to a file/line), the toolbar shows a separate `comment` chip with their count next to the per-file counter. Click it to expand the General Comments panel at the top of the diff and scroll to its first thread — symmetric to the file-level navigation. This works the same way in the branch comparison view and the file browser (`branchdiff tree`/`show`).

General comments from **one review pass** — an AI summary, any general remarks, and the deterministic verdict — consolidate into a single comment body (sections separated by `---`), so a pass reads as one block and pushes to the PR as one comment (one notification per pass). General comments **pulled from the PR** are separate threads, matching how they appear on the remote. Inline findings stay anchored to their own `file:line`.

---

## AI review

Review and fix diffs with any AI assistant — no plugin, no MCP server, no special setup.

### Claude Code, opencode — Skills

Install skills once, then use slash commands in any session:

```bash
branchdiff skill add   # creates .claude/skills/branchdiff-{review,resolve}/SKILL.md
```

**Want branchdiff's skills through a standard plugin system instead?** [`branchdiff-releases`](https://github.com/Encryptioner/branchdiff-releases) distributes the same two skills standalone — plugin version always matches this CLI's version.

```bash
# Run in a terminal — --sparse skips that repo's unrelated apt/ package pool
# (the in-chat /plugin marketplace add prompt doesn't support --sparse):
claude plugin marketplace add Encryptioner/branchdiff-releases --sparse .claude-plugin plugins
claude plugin install branchdiff-skills@branchdiff
```

```bash
# opencode, Codex CLI, Gemini CLI, or any other SKILL.md-reading agent (no Node.js needed):
curl -fsSL https://encryptioner.github.io/branchdiff-releases/install-skill.sh | sh -s -- --agent opencode all
```

| Slash command | What it does |
|---|---|
| `/branchdiff-review` | AI reads the diff and posts inline comments with severity tags |
| `/branchdiff-review main feature` | Review a specific branch comparison by ref |
| `/branchdiff-review http://localhost:5391/diff?b1=main&b2=feature&mode=git` | Paste the URL from your browser — server, branches, and mode are parsed automatically |
| `/branchdiff-resolve` | AI reads open threads, fixes the code, resolves each comment |
| `/branchdiff-resolve abc123` | Resolve a single thread by ID |
| `/branchdiff-resolve http://localhost:5391/diff?b1=main&b2=feature&mode=git` | Paste the URL to target a specific running session |

**Skill options:**

```bash
branchdiff skill add --type review           # review skill only
branchdiff skill add --type resolve          # resolve skill only
branchdiff skill add --name myproject        # custom slash command prefix
branchdiff skill add --force                 # replace files branchdiff didn't write
```

#### Where skills get installed

`--target` picks the directory. The default installs into the current repo; pass a
comma-separated list to install in several places at once.

| Target | Directory | Reach |
|---|---|---|
| `claude-project` *(default)* | `.claude/skills` | This repo |
| `claude-user` | `~/.claude/skills` | Every repo on this machine |
| `opencode-project` | `.opencode/skills` | This repo |
| `opencode-user` | `$XDG_CONFIG_HOME/opencode/skills` | Every repo on this machine |
| `agents-project` | `.agents/skills` | This repo, tool-neutral |
| `agents-user` | `~/.agents/skills` | Every repo, tool-neutral |

Short aliases: `claude`/`project`/`local`, `user`/`global`/`home`, `opencode`, `agents`.

```bash
branchdiff skill add --target user                     # every repo on this machine
branchdiff skill add --target claude-user,opencode-user
branchdiff skill add --dir ~/my-skills                 # an exact directory, taken literally
```

> **opencode needs no separate install.** It reads `.claude/skills` and
> `~/.claude/skills` alongside its own directories, so the default target already
> covers both runtimes. The `opencode-*` targets exist for setups that keep no
> `.claude` directory at all.

Every target uses the same layout — `<dir>/<skill-name>/SKILL.md` — which is what
Claude Code, opencode, and the tool-neutral `.agents` convention all read.

#### Updating installed skills

Re-run `branchdiff skill add` after upgrading branchdiff; each release can change
the skills. It rewrites what it wrote before and leaves your own work alone:

| Existing file | What happens |
|---|---|
| None | Created |
| Unchanged from a previous `skill add` | Reported *up to date*, not rewritten |
| An older generated skill | **Updated** — pre-2.0.0 files are copied to `SKILL.md.bak` first |
| Something you wrote yourself | Kept, with a warning. `--force` replaces it |

**Don't edit a generated skill in place** — the next `skill add` replaces it, which
is the point of the command. To customise, generate under your own prefix and edit
that: `branchdiff skill add --name myproject` writes `myproject-review` and
`myproject-resolve`, which `skill add` will never touch.

`branchdiff update` tells you when a release changed the skills, so you know when a
re-run is worth doing.

### Review skill workflow

The simplest way to start a review is to pass a URL as the skill argument. Three forms are accepted:

**1. Branchdiff URL** (server already running — copy from your browser):
```
/branchdiff-review http://localhost:5391/diff?b1=origin%2Fmain&b2=origin%2Ffeature&mode=git
```
The skill parses out the server address, base branch (`b1`), source branch (`b2`), and diff mode — no manual refs needed.

**2. GitHub PR URL** (no session needed — the skill creates one):
```
/branchdiff-review https://github.com/owner/repo/pull/123
```

**3. Bitbucket PR URL** (same — auto-creates a session):
```
/branchdiff-review https://bitbucket.org/workspace/repo/pull-requests/123
```

For PR URLs, the skill runs `branchdiff <pr-url> --no-open` under the hood — that command checks out the PR locally, derives base/compare refs, and starts the session.

**Multiple sessions per repo can run in parallel** — one per ref pair. `branchdiff <pr-url>` reuses an existing session only when the repo *and* the derived ref pair both match. If your workspace already has sessions running for unrelated refs, the PR URL starts a new one alongside them.

**Extra guidance for one pass — `instructions`.** Both `/branchdiff-review` and `/branchdiff-resolve` accept an optional free-form `instructions` argument after the URL/ref, e.g. `/branchdiff-review <url> skip files under ai/`. Applied alongside the normal workflow, not instead of it — the same knob `branchdiff auto --prompt` uses for unattended runs.

**Desktop notifications — `--notify`.** Add `--notify` to `/branchdiff-review` or `/branchdiff-resolve` (e.g. `/branchdiff-review <url> --notify`) to get a desktop toast when the pass starts and when it completes — useful if you step away from the chat during a long review. It fires via `branchdiff agent notify` and is off by default. It only applies when you run the skill yourself; when `branchdiff auto` drives a skill, `auto` fires its own toasts and the skill stays silent.

> **Session lifecycle** — a skill-created session keeps running in the background until you stop it explicitly (`branchdiff killall` or `branchdiff kill --port N`). It does **not** auto-end when the review/resolve pass completes. The skill prints the session URL at the end of each run so you can jump back to the browser. If the session was started with `--worktree`, its `.worktrees/pr-<n>` checkout is *not* removed when you stop it — add `--worktree-remove` to `kill`/`killall` to clean it up too (kept and reported instead if it holds untracked or modified files).

`/branchdiff-review` reads the full diff, analyzes each changed file, and posts inline comments tagged by severity:
- `[must-fix]` — bugs, security issues, data loss risks
- `[suggestion]` — concrete improvements, missing tests
- `[question]` — unclear behavior needing clarification

After the review, it summarizes findings, prints the active session URL, and prompts you to run `/branchdiff-resolve`.

### Review tone

The review skill uses a constructive, collaborative tone:

- **Lead with the problem, not a judgment** — "this returns undefined when X is empty" instead of "this is wrong"
- **Collaborative language** — "Consider using X" and "We might want to handle Y" instead of "You should"
- **Acknowledge good code** — brief praise for well-written sections
- **Explain the why** — suggestions include reasoning, not just prescriptions

### Follow-up (nth-time) reviews

Reviews are **additive**, not repetitive. Before analyzing code, the review skill fetches resolved and dismissed threads:

- **Resolved threads** are not re-raised — the author already addressed them
- **Dismissed threads** are only re-flagged if new evidence contradicts the dismissal reason
- **Improvements are acknowledged** in the general summary when the author clearly addressed prior feedback

This makes follow-up reviews (2nd, 3rd, nth pass) practical without repeating the same feedback loop.

When you ask for a verdict, the skill also reconciles threads still **open** from earlier passes: it re-checks each against the current diff (by what the comment describes, not by its old line number — a fix can land at a different spot than originally flagged) and, if genuinely fixed, resolves its own prior findings — but only ever *replies* to a human's ("Looks fixed — OK to close?"), since closing someone else's thread is always their call, unless the human already made that call themselves: a thread whose latest reply is a closing remark ("fixed", "done", "lgtm", "wontfix") is resolved directly, quoting them. A fixed thread no longer blocks the verdict; an uncertain one is left untouched.

### Starting over — `--fresh`

Sometimes you want the opposite of a follow-up: a clean, independent opinion, unbiased by the drafts already sitting in the session.

```bash
branchdiff review run --exec "claude -p" --fresh
```

`--fresh` archives the current comments before the review, so the AI never sees them — the same thing the **New review** button in the toolbar does. Archived comments are preserved and still viewable; nothing is deleted.

### Reviews read from git, not your checkout

The branch you have checked out is often *not* the code under review — you may be on another task, in a worktree, or comparing two remote refs for a PR. So the AI reads file content at the compared refs:

```bash
branchdiff agent file src/app.ts --ref feature   # content at that ref
branchdiff agent file src/app.ts                 # working-tree content
```

The generated skills use `agent file --ref` instead of reading files off disk, so a review can't be skewed by whatever happens to be checked out.

### Reviewing your own uncommitted work too

A branch-pair comparison is committed-only by default — exactly `git diff b1..b2`, nothing more. When you want to also see your currently staged or unstaged changes layered onto it (only meaningful once your checked-out branch is one side of the comparison), two independent toggles cover it. Both are off unless you turn them on, and the page URL is the single source of truth — there's no separate saved preference, so whoever opens a link (you, a teammate, or an AI) sees exactly the layers the sender had on.

- **In the browser** — "Include staged"/"Include unstaged" checkboxes appear in the toolbar once your checked-out branch matches `b1` or `b2`. Checking them updates the diff, file tree, and commit list live, and writes the current state into the page URL (`includeStaged=1`/`includeUnstaged=1`); reloading or sharing the link reopens with the same layers on.
- **From the CLI** — `branchdiff <b1> [b2] --include-staged --include-unstaged` seeds a freshly started session's URL the same way, so the browser opens with those layers on.
- **For an AI** — the review and resolve skills read `includeStaged`/`includeUnstaged` straight off a branchdiff URL you hand them (same as `b1`/`b2`/`mode`) and pass matching flags through: `branchdiff agent diff --include-staged --include-unstaged` layers the extra content onto the unified diff, and `branchdiff agent file <path> --staged` or `--ref`-less reads full context for a file that isn't committed yet.

This is deliberately **not** available to `branchdiff auto` or `review run` — automated PR review always stays committed-only, so comments stay anchored to stable content instead of a resolve pass's own in-progress edits.

<details>
<summary>Technical breakdown — exactly which git diff each layer reads</summary>

The staged layer is the index against `HEAD` (`git diff --cached`) everywhere — the file list, the per-file diff, and `agent diff`. The unstaged layer is the index against the working tree (`git diff`) everywhere. Both hold for every consumer (browser, CLI, AI agent), so clicking a staged or unstaged file always shows exactly the hunks the list implied, never a wider change set.

</details>

### Remote comments are pulled first

A **PR-linked** session pulls the latest comments from the PR as soon as it's created — whether you opened it yourself (`branchdiff <pr-url>`), it was created for you by `branchdiff auto`, or an AI agent started it while following the review skill — so the discussion is already there the first time anyone (you or the AI) looks at the session. `review context`, `review run` and `review import` pull again before doing anything, so a session left open for a while still sees anything posted since. The review skill does the same before reading the diff — `branchdiff agent refresh` pulls the latest comments and refuses to review if your local branch has fallen behind the PR head, so a standalone skill review runs against fresh code just like a `review run`. It's best-effort — no network, no auth, or no PR just means the review proceeds on local state. Branch-pair sessions (not tied to a PR) stay local by design.

### One AI, one session

Reviewing two PRs at once is normal — PR #2124 on port 5391, PR #2125 on port 5392. The rule is simple: **every review is tied to exactly one session, and branchdiff never guesses which.**

**For AI reviews, this is automatic.** A review started for one PR is pinned to it for its whole run and cannot drift onto the other, even with a browser tab open on a different session in the background.

**For commands you type, name the session.** Every `agent` and `review` subcommand takes `--session <id>` or `--port <n>`. With two or more sessions live, a command that names neither stops and shows you the choices:

```
$ branchdiff agent list
Error: 2 branchdiff sessions are live for this repo.
  port 5392  origin/development..origin/feat/batch-time
  port 5391  origin/stage/prod
Pick one:  --port <n>   or  --session <id>
(or set BRANCHDIFF_SESSION_ID; --yes uses the last-active session)
```

Three ways to answer it:

| | When to use |
|---|---|
| `--port 5391` | One-off. The port is right there in the error and in `branchdiff list`. |
| `export BRANCHDIFF_SESSION_ID=<id>` | You'll be on this session for a while — set it once, drop the flag entirely. |
| `--yes` | You genuinely mean "whichever was last active". |

Resolution order is `BRANCHDIFF_SESSION_ID` → `--session` → `--port` → the shared pointer, and that last one is only consulted when a single session is live.

With one session open — the common case — nothing changes and no flag is needed.

The generated review and resolve skills follow the same rule automatically: they resolve a selector once at the start and attach it to every command, rather than trusting the environment to survive into a sub-shell. That is what lets several automated reviews run at once without reading each other's sessions.

### Resolve skill workflow

`/branchdiff-resolve` reads all open review threads and resolves them:
1. Reads each thread's comment body to understand the requested change
2. Confirms the reviewed code is actually present in the tree it's about to edit
3. Finds the construct the comment describes and makes the edit
4. Runs the project's own checks before claiming a thread is fixed
5. Marks the thread resolved with a summary, or dismisses it with a reason if the fix shouldn't apply
6. Skips general comments and threads waiting for user clarification

The review and resolve skills form a complete loop — review, inspect in browser, resolve — without leaving your editor.

#### Fixing on a branch other than the reviewed one

A review names a `b1 → b2` comparison, but fixes don't always land on `b2`. They may
go to a branch that later merges into it, to a rebased successor, or to a shared base
several review branches feed from — and `b2` may already have been merged into where
you are standing. All of these are ordinary.

So the resolve skill does **not** check the branch name. It checks whether the
reviewed code is in the tree it is about to edit: first `git merge-base --is-ancestor`,
then, failing that, a per-file comparison against `branchdiff agent file --ref <b2>`.
If the code the comment describes is there, the fix applies; the skill locates it by
content rather than by the thread's line number, which is only valid on `b2` at review
time. When a finding can't be placed, that one thread is reported instead of guessed —
the rest of the run continues. Fixes made outside `b2` are named in the resolve
summary, since the session itself only records the comparison.

Two things it will not do: edit inside a `--worktree` review checkout (detached, so
commits there are lost), or check out a branch on your behalf.

**Resolving is local by default.** Marking a thread resolved in branchdiff never touches the pull request. To mirror it onto the remote as well:

```bash
branchdiff agent resolve <thread-id> --summary "Fixed" --sync
branchdiff agent dismiss <thread-id> --reason "By design" --sync
```

`--sync` resolves the matching thread on GitHub (collapsed as resolved) or Bitbucket. It only works for threads that were pushed to the PR first, and it's best-effort — if the remote is unreachable you get a warning and the local resolve still stands.

### Any other AI

Copy-paste one of these prompts:

#### To review

```
You are reviewing code using branchdiff agent commands (not any other tool).
Run `branchdiff review guide` first to load the full reference, then:

1. Check for prior review context (nth-time review):
   branchdiff agent list --status resolved --json
   branchdiff agent list --status dismissed --json
   - Do NOT re-raise resolved issues — the author already addressed them.
   - Only re-flag dismissed issues if new evidence contradicts the dismissal reason.
   - Acknowledge improvements when the author addressed prior feedback.

2. Refresh remote state, then read the full diff:
   branchdiff agent refresh          # pull latest PR comments; refuses if the local branch is behind the PR head (--allow-stale to override)
   branchdiff agent diff

3. For each changed file, read the ENTIRE file (not just diff hunks) for full context.
   Analyze: data flow (null/undefined?), state/lifecycle (resource cleanup?), contracts (callers updated?), boundaries (input validation?), edge cases.

4. Validate each finding before commenting — re-read surrounding code, grep for imports, read actual call sites.
   Flag: logic errors, security issues, race conditions, broken contracts, missing tests.
   Skip: style, linter-catchable issues, pre-existing problems in unchanged code.

5. Post comments (order: [must-fix] first, then [suggestion], then [question]):
   branchdiff agent comment --file <path> --line <n> --body "[tag] message"
   Tags: [must-fix] bugs/security/data-loss · [suggestion] improvements/missing tests · [question] unclear
   For multi-line: add --end-line <n>

   Tone: lead with the problem, not a judgment. "This returns undefined when X is empty" not "this is wrong".
   Use collaborative language ("Consider using X" not "You should"). Acknowledge good code.

6. General comment (optional): 3+ findings → summarize themes.
   branchdiff agent general-comment --body "<overall summary>"

7. Confirm: branchdiff agent list --status open
Start: branchdiff review guide
```

#### To resolve

```
You are resolving open review comments using branchdiff agent commands.
Run `branchdiff review guide` first to load the full reference, then:

1. Run `branchdiff agent list --status open --json` to get open threads.

2. For each thread:
   - Skip general comments (filePath "__general__") — these are summaries, not actionable.
   - Skip threads where the last comment is an agent asking a question and the user hasn't responded.
   - Read the comment body to understand the requested change. Interpret intent:
     code suggestion → make the change; documentation suggestion → update docs; unclear → ask for clarification.
   - Read the ENTIRE source file around the commented lines for full context, then make the fix.
   - Resolve: branchdiff agent resolve <id> --summary "Fixed: <what you did>"
   - Or dismiss if the fix shouldn't apply: branchdiff agent dismiss <id> --reason "<why>"

3. Confirm: branchdiff agent list
Start: branchdiff review guide
```

### One-shot pipe

```bash
branchdiff review context | claude -p "review for security"
branchdiff review context --refs "main feature" | your-ai-tool  # no session needed
branchdiff review run --exec "claude" --mode review
branchdiff review run --exec "llm -m gpt-4o" --mode resolve

# --url bootstraps and then binds to that exact session, so the run can't drift
# onto another PR even with several sessions open. PR URLs auto-create a session
# if no matching one exists; branchdiff URLs target the instance on that port.
branchdiff review run --exec "claude" --url https://github.com/owner/repo/pull/123
branchdiff review run --exec "claude" --url https://bitbucket.org/ws/repo/pull-requests/45
branchdiff review run --exec "claude" --url http://localhost:5391/diff?b1=main&b2=feature
```

Before doing anything, `review run` prints a **run summary** — every flag you passed, and which default applies to everything you didn't — split into "Using:" and "Defaults in effect:", so you can see what's about to happen before the AI runs. It ends with a pointer back to this guide for the full flag reference.

**`--notify`** — desktop notification on each review state: started, finished, comments pushed, verdict set, or failed (default off; same behavior as `auto`).

After every `review run` or `review import`, branchdiff prints the active session URL/port/pid so you can jump back to the browser. Sessions stay alive — stop them with `branchdiff killall` or `branchdiff kill --port N`.

### Reviewing without touching your working tree

`branchdiff <pr-url> --worktree` checks a GitHub or Bitbucket PR out into `.worktrees/pr-<n>` instead of switching your branch, so whatever you had open stays open. `branchdiff review run --worktree` does the same for the AI reviewer, and `--worktree-remove` cleans up afterwards (a worktree holding untracked or modified files is kept and reported, never force-deleted). Since a `<pr-url> --worktree` session stays running until you stop it, its worktree instead cleans up via `branchdiff kill --port N --worktree-remove` (or `killall --worktree-remove`) — same dirty-worktree guard. `branchdiff auto --worktree` also accepts `--worktree-remove` and forwards it to the `review run` it spawns for each PR.

**A worktree whose directory vanished gets recreated automatically** — if the `.worktrees/pr-<n>` checkout disappears between review cycles (an ephemeral disk reset, a container restart, manual cleanup) while git still has it registered, the next `--worktree` review prunes that stale registration and recreates the checkout rather than failing on a missing directory.

**Seeing where a worktree session landed** — `branchdiff list` prints a `worktree:` line with the checkout path for any session started with `--worktree` (also in `--json` output), and the browser toolbar shows the same as a small badge next to the branch name — hover it for the full path.

**Seeing which PR a session is linked to** — once a branch-pair session is reconciled against a GitHub or Bitbucket PR, `branchdiff list` and every startup banner (`branchdiff <pr-url>`, reattaching to an already-running instance, `--detach`) show a `<platform> #<number>` tag next to `PORT`/`pid` — nothing is shown until the link is known (e.g. a plain `branchdiff main..feature` with no PR yet).

---

## AI workflows

### Workflow 1 — AI Review

```
You are reviewing a code diff using branchdiff.
1. Run `branchdiff agent diff` to read the full diff.
2. For each genuine issue, post a comment:
   branchdiff agent comment --file <path> --line <n> --body "[<tag>] <message>"
   Use [must-fix] for bugs/security, [suggestion] for improvements,
   [nit] for style, [question] for unclear behavior.
3. Be concrete: quote the problematic code or reference the exact line.
4. For multi-line issues add --end-line <n>.
5. After posting, run `branchdiff agent list --status open` to confirm.
Start: branchdiff agent diff
```

### Workflow 2 — AI Resolve

```
You are resolving open review comments using branchdiff.
1. Run `branchdiff agent list --status open --json` to get open threads.
2. For each thread:
   - [must-fix] or [suggestion]: apply the fix, then resolve.
   - [question]: answer with a reply instead.
   - Disagree: dismiss with a reason.
Start: branchdiff agent list --status open --json
```

### Workflow 3 — AI Tour

```
You are creating a guided code tour using branchdiff.
1. Start the tour: branchdiff agent tour-start --topic "<topic>" --body "<overview>" --json
2. Add 5–12 steps: branchdiff agent tour-step --tour <id> --file <path> --line <n> --body "<explanation>"
3. Finish: branchdiff agent tour-done --tour <id>
Start: branchdiff agent tour-start
```

### Workflow 4 — AI Summary

```
Summarize the current branchdiff review session.
1. Run `branchdiff agent list --json` to get all threads.
2. Output an informal status read (not approve/request-changes — that's `branchdiff review verdict`'s call), top must-fix items, recurring themes, thread counts.
Start: branchdiff agent list --json
```

### Workflow 5 — Security Audit

```
You are doing a SECURITY-FOCUSED review using branchdiff.
1. Run `branchdiff agent diff` to see every changed line.
2. Look ONLY for security issues: injection, auth, secrets, crypto, deserialization, path traversal, SSRF.
3. For each finding: post [must-fix] with CWE reference.
Start: branchdiff agent diff
```

### Workflow 6 — Test Coverage Gaps

```
You are finding TEST COVERAGE gaps using branchdiff.
1. Run `branchdiff agent diff` to see additions.
2. For every new function or error path, check test directories for coverage.
3. For each gap: post [suggestion] with suggested test code.
Start: branchdiff agent diff
```

### Workflow 7 — Breaking-Change Review

```
You are reviewing a BREAKING CHANGE using branchdiff.
1. Run `branchdiff agent diff`.
2. Classify every change as BREAKING or NON-BREAKING.
3. For each BREAKING item: post [must-fix] with migration steps.
Start: branchdiff agent diff
```

### Workflow 8 — Dependency Review

```
You are reviewing DEPENDENCY CHANGES using branchdiff.
1. Run `branchdiff agent diff` and focus on package.json and lock files.
2. Check: maintained? license? bundle size? CVEs?
3. For each finding: post [severity] with alternative.
Start: branchdiff agent diff
```

---

## Agent command reference

> **Full AI agent reference:** `branchdiff agent guide` outputs the complete CLI reference for AI agents — all commands grouped by workflow (comments, PR, sync, sessions, review pipeline).

Every command below also takes `--session <id>` / `--port <n>`. With one session open you can leave them off; with several, add one or branchdiff will ask which you meant (see [One AI, one session](#one-ai-one-session)).

```bash
branchdiff agent diff                                         # read the full diff
branchdiff agent list --json                                  # all threads
branchdiff agent list --status open --json                    # only open threads
branchdiff agent comment \
  --file src/app.ts --line 42 \
  --body "[must-fix] Missing null check"                     # post inline comment
branchdiff agent comment \
  --file src/app.ts --line 42 --end-line 48 \
  --body "[suggestion] Extract this into a helper"           # multi-line range
branchdiff agent general-comment \
  --body "[suggestion] Overall: auth module needs attention" # diff-wide comment
branchdiff agent resolve <thread-id> --summary "Fixed"       # mark resolved
branchdiff agent dismiss <thread-id> --reason "By design"    # mark won't fix
branchdiff agent reply <thread-id> --body "Can you clarify?" # reply to thread
branchdiff agent delete-thread <thread-id>                   # delete thread + comments
branchdiff agent clear-threads                                # delete all threads (prompts to confirm)
branchdiff agent clear-threads --yes                          # skip confirmation
branchdiff agent edit-comment <id> --body "updated text"     # edit a comment
branchdiff agent delete-comment <id>                          # delete a single comment
```

> The comment, thread, diff, file, and `review context`/`threads`/`run`/`import` commands write the local database directly — they need **no running server**, only an active session, and must run from the same repo directory as the session. Only `branchdiff pr`, `sync`, and `session` go through the HTTP server, so those are the ones that need branchdiff running.

> The delete and edit commands (`delete-thread`, `clear-threads`, `edit-comment`, `delete-comment`) write to the database directly — they only work from the same repo directory where branchdiff is running.

---

## Part 4 · Automate

Let branchdiff review pull requests on its own. `branchdiff auto` finds open PRs, reviews the ones with new commits, and can run on a cron schedule or as a self-hosted bot. Comments stay local until you — or a schedule — publish them.

---

## Automatic PR review — `branchdiff auto`

`branchdiff auto` finds your open pull requests (GitHub and Bitbucket), works out which ones picked up new commits since their last review, and runs your AI reviewer on them. Nothing happens without your say-so: matching PRs are listed once so you can **pick which ones to review**, and comments **stay local** until you ask for them to be pushed.

Before it starts, `auto` prints a **run summary** — every flag you passed ("Using:") and which default applies to everything you didn't ("Defaults in effect:") — so a command with two dozen possible flags still tells you plainly what this particular run will do. Only lines relevant to the run show up (e.g. resolve-pass lines are omitted when `--resolve` isn't set). It ends with a pointer to `branchdiff guide` for the full flag reference.

```bash
branchdiff auto --tool claude                      # pick from matching PRs (default)
branchdiff auto --tool opencode --review      # review every match, no prompt
branchdiff auto --watch 10 --tool claude --review --notify
branchdiff auto --source 'feature/*,fix/*' --dest main --tool claude
branchdiff auto --tool claude --review --push   # publish comments to the PR
branchdiff auto --tool claude --worktree --parallel 3 --review   # review up to 3 PRs at once
branchdiff auto --tool claude --resolve                          # review, then fix + resolve open threads locally
cd ~/work && branchdiff auto --tool claude                            # every repo directly under ~/work, one combined list
branchdiff auto --repo-paths ~/work/api,../web --tool claude          # name the repos yourself
```

**Which flags for which scenario.** One rule applies to every row below, before anything else: **run it from a real terminal, or pass `--review`.** `auto` always asks (unless told not to), so outside a TTY with no `--review` it refuses immediately rather than hang on a prompt nothing can answer — this has nothing to do with `--tool`/`--exec`. Beyond that, `--tool`/`--exec` is the only flag anything else depends on — without one, `auto` still finds PRs, decides which need review, and lets you pick, but stops short of running an AI (first row). Everything else composes freely, except the two hard requirements called out in bold.

| Scenario | Command | Requires | Optional extras |
|---|---|---|---|
| Just see what needs reviewing, no AI yet | `branchdiff auto` | a terminal (or `--review`) — see rule above | `--source`/`--dest` to narrow the list |
| Interactive, pick which PRs to review | `branchdiff auto --tool claude` | `--tool` or `--exec` | `--worktree`, `--fresh`, `--prompt` |
| Fully unattended (cron, CI, a script) | `branchdiff auto --tool claude --review` | `--tool`/`--exec` **and `--review`** (mandatory here — nothing can answer the prompt in a script) | `--notify`, `--push` |
| Never offer to review my own PRs | `branchdiff auto --tool claude --review --skip-author` | `--tool`/`--exec` | `--source`/`--dest` (narrow the list too), `--watch` — composes with any other row; `--skip-author` is a filter, not a mode |
| Leave the giant PRs to a human | `branchdiff auto --tool claude --max-files 200 --max-lines 4000` | `--tool`/`--exec` | `--min-files`/`--min-lines` to skip trivial ones too; composes with any other row — these are filters, not a mode |
| Keep watching for new commits | `branchdiff auto --watch 10 --tool claude --review` | `--watch` | `--watch` alone uses the 10-min default; `--review`/`--notify` — not enforced, but there's no one at the terminal to answer the per-cycle prompt otherwise |
| Publish comments to the PR | `branchdiff auto --tool claude --push` | `--tool`/`--exec` — `--push` silently does nothing without an actual review to publish | forge credentials already set up (`gh auth login` / Bitbucket env vars), same as manual `sync push` |
| See the verdict reasoning locally, no remote action | `branchdiff auto --tool claude --request-changes` | `--tool`/`--exec` — works with or without `--push`; without it, only a local verdict comment is created, nothing reaches the remote PR and no approve/request-changes call is made | `--approve` too; either alone still gets the other side an AI-written recommendation instead of silence |
| Set an actual PR verdict (approve / request changes) | `branchdiff auto --tool claude --push --request-changes` | **`--push`** — the verdict comment still gets created without it, but the remote approve/request-changes call is skipped | `--approve` too (full auto-verdict); either alone still gets the other side an AI-written recommendation instead of silence. Any open human-started thread blocks approval too, not just `[must-fix]` ones — except a bare status remark ("PR Updated", "LGTM", "done") or one whose latest reply already signals it's fine to close |
| Review several PRs concurrently | `branchdiff auto --tool claude --worktree --parallel 3` | **`--worktree`** — `auto` refuses `--parallel > 1` without it, since concurrent PRs would race checking out the same working tree | `--worktree-remove`, `--review` (otherwise the one selection prompt still happens up front, then the picks run in parallel) |
| Don't touch my working tree at all | `branchdiff auto --tool claude --worktree` | — | `--worktree-remove` to also clean the checkout up afterward |
| Drive an actual review skill, not JSON | `branchdiff auto --tool claude --skill` | `--tool`/`--exec` — `--skill`/`--skill-name`/`--additional-skill` have nothing to pipe to without one | `--skill-name`, `--additional-skill`, `--prompt` |
| Review PRs across several repos in one go | `branchdiff auto --repo-paths ~/work --tool claude` | — (run it from a parent directory and discovery does the same thing) | `--repo-concurrency`, `--keep-servers`, `--review`; everything else works per repo exactly as it does in one |
| Fix + resolve open threads locally, after review | `branchdiff auto --tool claude --resolve` | `--tool`/`--exec` — `--resolve`/`--resolve-skill-name`/`--additional-resolve-skill` have nothing to pipe to without one | `--resolve-skill-name`, `--additional-resolve-skill`, `--resolve-prompt`, `--skill` (compose review + resolve in one pass) |

**Notifications link to the PR.** With `--notify`, each toast — and the `done`/`ready` lines in your terminal — carries a link to the PR (or, for a review that finished without pushing its comments, to the local session view). Clicking it opens your browser directly where supported; anywhere else the URL is shown in the toast and the terminal, so it's still one click away.

**PATH just works, even under cron/systemd/CI with a bare environment.** `auto` and the AI reviewer it spawns can always find `branchdiff`, no setup needed.

<details>
<summary>Technical breakdown</summary>

Clicking a notification toast opens the browser where the OS supports it (macOS with `terminal-notifier` installed; Linux `notify-send` with action support); a toast never blocks or hangs `auto`, even on Ctrl-C.

`auto` hands its own install location to the AI reviewer it spawns, so the reviewer resolves `branchdiff` by name even when the launcher's `PATH` is bare — cron's default, a systemd unit, a CI runner all work without you adding `branchdiff` to the launcher's `PATH`. `auto cron add` already invokes branchdiff by absolute path, so the schedule starts regardless; the reviewer it then launches is covered too. The same install location is also spelled out as literal text in every review and resolve prompt the reviewer receives — skill mode, the classic diff+JSON pipe, and the resolve pass alike — so the reviewer can `export PATH` and self-heal even if its own tool sandbox drops inherited environment variables on top of the process env, a further-nested layer some coding-agent CLIs apply. If `branchdiff` still can't be reached (or a command that worked a moment ago stops working mid-review), the review/resolve skills instruct the AI to stop the pass and report the failure rather than reviewing the checkout manually outside branchdiff — a manual review posts nothing branchdiff can track, and would otherwise repeat as a duplicate PR comment on the next scheduled pass.

</details>

**One `auto` per repo.** A second `auto` in the same repo is refused (two would race on the same PRs); pass `--force-session` to allow one anyway. Running `auto` in several different repos at once is always fine — each is isolated.

### Several repos at once — `--repo-paths`

One `auto` can cover every repo you work on. Run it from a directory that isn't itself a repo and it reviews every git repo **directly under** that directory; `--repo-paths` names the set explicitly instead:

```bash
cd ~/work && branchdiff auto --tool claude              # every repo directly under ~/work
branchdiff auto --repo-paths ~/work --tool claude       # same, without leaving your current directory
branchdiff auto --repo-paths ~/work/api,../web --tool claude   # exactly these two
branchdiff auto --repo-paths ~/work,~/oss --tool claude        # repeatable and comma-separated
```

**How a path is read.** Absolute, relative, or `~/…`. A path that is itself a repo means that repo. Any other directory expands to the git repos that are its **direct children** — one level down only, never recursive, so `~/work` finds `~/work/api` but not `~/work/team/api`. Children whose names start with `.`, and `node_modules`, are skipped. Inside a repo with no `--repo-paths`, nothing changes — that repo is the only target.

**How a cycle runs.** All repos are scanned first (`--repo-concurrency`, default 4, sets how many at once), each reporting `X open, Y need review` as it finishes. Every candidate across every repo is then listed **together**, grouped under per-repo headings, and picked in **one** prompt (ranges help: `1-6,9`). Reviews run one repo at a time, and `--parallel` still applies within a repo. Every other flag behaves per repo exactly as it does in a single one, and each repo keeps its own sessions, comments and skill files.

**Server memory — `--keep-servers <n|all>`.** Each reviewed PR gets its own session server, and those add up across repos. `--keep-servers` caps how many this run leaves running **after each cycle** — default is 4 for a multi-repo run, unlimited (no sweep) for a single repo. `--keep-servers all` keeps everything; `--keep-servers 0` leaves none.

<details>
<summary>Technical breakdown</summary>

A path that doesn't exist, or isn't a directory, stops the run with an error rather than quietly reviewing less than you asked for.

A repo already being reviewed by another `auto` is skipped (with a note) instead of raced; `--force-session` overrides that per repo. Picking enough PRs in one cycle prints a one-time heads-up — a full pass per PR takes a while, and each one parks a `.worktrees/pr-<n>` until it's cleaned up — pointing at `--worktree-remove` and a longer `--watch` interval; purely advisory, nothing about how the cycle runs changes. The threshold scales with `--watch <minutes>` (half the interval, e.g. `--watch 10` warns at 5+ PRs, `--watch 20` at 10+) — a longer interval has more slack before the next cycle, so it tolerates more PRs before the warning is worth showing; bare `--watch`/no `--watch` uses the same 10m default the interval itself falls back to elsewhere, so 5+.

`--keep-servers` is deliberately not a cap on how many servers are alive *during* a cycle: a cycle reviewing 12 PRs holds up to 12 servers while it works, then retires the oldest down to `<n>` once **every** review has finished, so nothing is ever stopped mid-review. Ctrl-C skips the sweep on purpose — in-flight work is abandoned, not finished, so its servers stay up; `branchdiff killall` is the cleanup, bearing in mind it stops *every* branchdiff server on the machine, not only this run's.

</details>

**Asking before acting on repos you didn't name.** Because a parent directory can hold repos you weren't thinking about, `auto` asks once — listing the discovered repos and what's about to happen — before reviewing them with `--review` (where you'd never see a list), and before `--fresh` archives their existing comments. Naming repos with `--repo-paths` skips the prompt entirely, and so does a single repo. In a non-interactive shell it refuses and exits instead of guessing, pointing at `--repo-paths` as the way to run unattended. The answer lasts the whole run: under `--watch` you're asked again only if a repo joins the set that your earlier answer didn't cover.

**`--watch` picks up changes to the set.** Each cycle re-resolves the repos, so a repo cloned into the parent directory mid-run appears in the next cycle, and one that's deleted or moved drops out without an error.

**What a cycle costs.** Scanning is one `gh`/Bitbucket query per repo per cycle — 25 repos on `--watch 5` is roughly 300 API calls an hour, so widen the scope deliberately if you're near a rate limit. `--notify` also fires per review event **per PR**, which multiplies quickly across repos.

**Exit codes.** `0` clean — including quitting at the prompt, Ctrl-C, and PRs you chose not to select. `1` a usage refusal where nothing was attempted (a bad `--repo-paths` entry, no repos found, an invalid flag value, a refusal in a non-interactive shell). `2` the run proceeded but something didn't happen: a repo skipped or unreadable, a review that failed, or comments that couldn't be published under `--push`. Deselecting PRs, and PRs that simply needed no review, never make a run non-zero.

### What a pass did — the end-of-cycle report

Every cycle that reviewed at least one PR ends with a report of what it did, in single- and multi-repo runs alike:

```
  Reviewed this cycle (under ~/work)
    api
      done   github #142 feature/login → main — 3 comments  https://github.com/acme/api/pull/142
             session http://127.0.0.1:5391/diff?b1=main&b2=feature/login — running
    web  team/web
      failed github #7 fix/timeout → main — session no longer running  https://github.com/acme/web/pull/7
             session http://127.0.0.1:5402/diff?b1=main&b2=fix/timeout — stopped
  reopen any session with: branchdiff <pr-url>
```

Rows are grouped under the repo they belong to. The directory every repo sits under is named once in the header, and each heading carries whatever path is left below it — so two repos that share a name stay distinguishable, and a single-repo run shows that repo's full path. Each row carries the outcome, the PR URL, and the local session URL marked **running** or **stopped**. It prints after the servers are retired, so the marks are the settled truth rather than a link that just died. A stopped session isn't a lost review — comments and threads live in the database — so reopen it any time with `branchdiff <pr-url>`. A cycle that reviewed nothing prints no report.

#### Choosing the AI

`--tool` covers the common CLIs; `--exec` takes any command that reads a prompt on stdin and prints review JSON on stdout:

| Flag | Runs | Classic mode | Skill mode (`--skill`) |
|------|------|:---:|---|
| `--tool claude` | `claude -p` | ✅ | ✅ auto-adds `--dangerously-skip-permissions` |
| `--tool gemini` | `gemini -p` | ✅ | ✅ auto-adds `--yolo` |
| `--tool opencode` | `opencode run` | ✅ | ✅ auto-adds `--auto` |
| `--tool codex` | `codex exec -` | ✅ | ✅ auto-adds `--dangerously-bypass-approvals-and-sandbox` |
| `--tool cursor` | `cursor-agent -p` | ✅ | ⚠️ needs Auto-review run mode enabled in cursor settings (no headless flag) |
| `--tool llm` | `llm` | ✅ | ❌ `llm` runs no tools — use classic mode |
| `--exec "<cmd>"` | anything else, e.g. `--exec "llm -m gpt-4o"` | ✅ | ⚠️ you must add your tool's auto-approve flag yourself |

#### Classic vs skill mode — why the difference

In **classic mode** the AI only reads the diff on stdin and prints review JSON — it runs no tools, so **every** tool works with zero permission setup. In **skill mode** the AI runs `branchdiff agent` commands *itself* to post comments; run headless, a CLI with approval prompts on will block and post nothing. So skill mode needs a tool that auto-approves tool calls unattended. `--tool` handles this for the known agentic CLIs (appending the right flag, logged); for a spelled-out `--exec`, add the flag yourself — branchdiff warns if it looks missing. Each auto-approve flag runs the AI unattended, which is why reviews go in an isolated `.worktrees/` checkout.

#### Using your own account, a wrapper, or any custom tool

`auto` runs the AI as a child process that **inherits your shell's environment**, and it launches the command through `sh -c`. That gives you three ways to point it at your own setup — no branchdiff config needed. These apply to whichever CLI you use; the examples happen to use one, but the mechanism is the same for `gemini`, `opencode`, `codex`, or your own binary.

- **A specific account, profile, or config directory (env-prefix).** Anything you export before `branchdiff` reaches the AI, so use whatever env var your tool reads for its account/profile. For example, a CLI that isolates each account in its own config dir (Claude Code uses `CLAUDE_CONFIG_DIR`; other tools have their own):

  ```bash
  # reviews as account1's config, leaves account2 untouched
  CLAUDE_CONFIG_DIR=~/.claude-account1 branchdiff auto --tool claude --skill --review
  ```

  `--tool <name>` still supplies the right invocation *and* the skill-mode autonomy flag; the env var just selects which account/profile runs it. Set it once with `export` (or in the surrounding script) to apply it to a whole `--watch` session.

- **A tool family plus a custom launcher (`--tool` + `--exec` together).** When you need to override *how* the tool is launched but still want the family's skill-autonomy flag added for you, pass both — `--exec` sets the command, `--tool` names the family:

  ```bash
  branchdiff auto --tool claude \
    --exec "CLAUDE_CONFIG_DIR=~/.claude-account1 claude -p" --skill --review
  # runs your exact command, and (skill mode) still appends that family's auto-approve flag
  ```

- **Any other binary or wrapper script (`--exec` alone).** Point `--exec` at any command — an absolute path, a `$PATH` executable, or your own wrapper. In skill mode add the auto-approve flag yourself (branchdiff warns if it looks missing):

  ```bash
  branchdiff auto --exec "/path/to/my-reviewer --headless" --skill --review
  ```

> **Shell aliases won't work here** (including under cron) — `auto` launches through a non-interactive `sh -c`, which never loads `~/.bashrc`, so `--exec "my-cli-account1"` fails with "not found". Use the **env-prefix** form above instead, or turn the alias into a tiny wrapper script on your `$PATH` and pass that to `--exec`. A renamed binary (you invoke `claude` as `claude-account1`) works the same way: `--exec` runs it, and adding `--tool claude` alongside still gets you that family's auto-approve flag.

<details>
<summary>Technical breakdown — aliases, wrapper scripts, and cron</summary>

A bare shell alias resolves to nothing under `sh -c`, so turn it into a wrapper script instead (`#!/bin/sh` + `exec env <YOUR_ENV_VAR>=<value> <your-cli> "$@"`) and pass that script to `--exec`.

For a renamed or wrapper binary (`--tool` only accepts its six preset names, so `--tool claude-account1` errors out naming the known list):
```bash
branchdiff auto --tool claude --exec "claude-account1 -p" --skill --review   # runs claude-account1, still auto-adds --dangerously-skip-permissions
branchdiff auto --exec "claude-account1 -p" --review                          # standalone — add the auto-approve flag yourself in skill mode
```

Under cron, the env-prefix and wrapper-script forms survive unchanged — the `--exec` value is baked verbatim into the schedule, so nothing cron-specific to set up. One caveat per form:
- **env-prefix in `--exec`** — works as-is, but the value lands in the generated per-schedule script (`~/.branchdiff/cron-scripts/<cronId>.sh`) in plain text, so put a config-dir or account selector there, not a raw API key. A key you `export` in `~/.zshrc`/`~/.bashrc` already reaches the tool at every fire via branchdiff's login-shell wrap — no crontab edit needed.
- **wrapper script on `$PATH`** — its directory (e.g. `~/.local/bin`) must be on the `PATH` of the shell running `cron add`, since that `PATH` is snapshotted into the schedule and resolves the wrapper at every fire. The wrapper carries the env, so there are no `VAR=value` crontab lines to add.

Full env story at [Cron doesn't inherit your shell's `PATH` or env vars](#cron-doesnt-inherit-your-shells-path-or-env-vars).

</details>

#### Controls

| Flag | Default | What it does |
|------|---------|--------------|
| `--review` | off — asks | Skips the selection prompt and reviews every matching PR. Without it, PRs that need review are listed once — pick several with comma-separated numbers, `a` for all, or `q` to quit; in a non-interactive shell `auto` refuses rather than guessing. |
| `--notify` | off | Desktop notification when a review starts, finishes, is pushed, or fails. Silently skipped if your system has no notifier. |
| `--push` | off | Pushes that PR's comments (and, if set, the verdict comment below) to the remote. Without it, everything stays local. |
| `--approve [level]` | off; 1 if bare | Always writes a local verdict comment reasoning about whether to approve. `level` (1-5, default 1) sets how strict the gate is. Actually approving on the remote additionally requires `--push`. Full gating rules in [Setting a PR verdict](#setting-a-pr-verdict-approve-level-request-changes-level) below. |
| `--request-changes [level]` | off; 1 if bare | Same idea, for requesting changes — same `level` as `--approve` (the two must agree if both are set). See [Setting a PR verdict](#setting-a-pr-verdict-approve-level-request-changes-level) below. |
| `--watch [min]` | off (single pass); 10 if bare | Keep looping every `<min>` minutes (`--watch 10`), or every 10 by default (`--watch` alone). Ctrl-C stops cleanly. Each cycle re-resolves the repos, so one cloned into the parent directory mid-run joins the next cycle. |
| `--repo-paths <paths>` | this directory if it's a repo, else its direct child repos | Repos to review — comma-separated and repeatable, absolute, relative or `~/…`. A path that is itself a repo means that repo; any other directory expands to its **direct** child repos (one level down, never recursive). A path that doesn't exist stops the run. |
| `--repo-concurrency <n>` | 4 (clamped 1-16) | How many repos are scanned at once. Reviews still run one repo at a time. |
| `--keep-servers <n\|all>` | every server in a single repo; 4 in a multi-repo run | How many session servers this run **leaves alive after each cycle** — not a cap on how many are alive during one (a 12-PR cycle holds up to 12, then retires the oldest once every review has finished, never mid-review). Ctrl-C skips the sweep; use `branchdiff killall` to clean up. |
| `--source` / `--dest` | any | Branch filters — comma-separated globs (`feature/*`) or `/regex/`. |
| `--worktree` | off | Runs each reviewer in a `.worktrees/` checkout so your working tree is untouched. |
| `--worktree-remove` | off | Removes that worktree after each review (kept by default; kept + warned if it holds untracked/modified files). |
| `--fresh` | off | Archives existing local comments before each review. |
| `--parallel <n>` | 1 (sequential) | Reviews up to `n` of the selected PRs at once instead of one at a time. Requires `--worktree` — otherwise concurrent PRs would race checking out the same working tree. |
| `--no-skip` | off (skips reviewed) | Makes every matching PR eligible again, even one already reviewed at its current commit. Use it when a prior review recorded state but posted nothing (e.g. the AI was permission-blocked) — a successful re-review re-stamps the commit and normal skipping resumes. |
| `--skip-author` | off | Drops PRs you opened yourself before they reach the candidate list, matched by the authenticated user (your GitHub login / Bitbucket uuid), so `auto` never offers to review your own work. Best-effort — a PR whose author can't be determined is kept, and if your own identity can't be resolved nothing is skipped. |
| `--max-files <n>` / `--min-files <n>` | any size | Skips a PR changing more than `n` (or fewer than `n`) files. |
| `--max-lines <n>` / `--min-lines <n>` | any size | Same, on diff lines — additions + deletions together. |
| `--skill` | off | Drive the built-in "branchdiff" review skill instead of the context+JSON pipe — no install needed, see below. |
| `--skill-name <name>` | — | Drive a custom skill instead (must already be installed via `skill add`; implies `--skill`). |
| `--additional-skill <name>` | — | Merge another installed skill's guidance into the same pass (repeatable; implies `--skill`). |
| `--prompt <text>` | — | Extra instructions passed to the AI for this run — merged into the skill prompt, or forwarded as `review run --prompt` in classic mode. It's **advisory, not a filter**: `--prompt "skip ai/**/plans"` *asks* the reviewer to ignore those paths; branchdiff still sends the full diff. Quote it so your shell keeps it intact — use double quotes if the text has an apostrophe (`--prompt "don't touch ai/"`). |
| `--resolve` | off | After the review pass, drive the built-in "branchdiff" resolve skill: the AI fixes open threads locally and resolves them. Local only — nothing is committed or pushed. Works even without `--skill` (resolves whatever's already open on top of the classic review pass). |
| `--resolve-skill-name <name>` | — | Drive a custom resolve skill instead (must already be installed via `skill add --type resolve`; implies `--resolve`). |
| `--additional-resolve-skill <name>` | — | Merge another installed resolve skill's guidance into the same pass (repeatable; implies `--resolve`). |
| `--resolve-prompt <text>` | — | Extra instructions merged into the resolve prompt only (separate from `--prompt`, which is the review pass's). |

A PR is re-reviewed only when non-merge commits land on it after the last review, so a `--watch` loop stays quiet until there's actually something new.

#### Skipping PRs by size

`--max-files`, `--min-files`, `--max-lines` and `--min-lines` gate on how big a PR is, so a 900-file dependency bump goes to a human and a one-word typo fix doesn't cost an AI pass at all. Each bound is optional and they compose (`--max-files 200 --max-lines 4000`), the bounds are inclusive, and "lines" means additions + deletions. The measurement is the **whole PR against its base**, not the increment since the last review — a PR over the bound stays skipped as it grows. A size skip is a normal outcome, so the run still exits `0`.

<details>
<summary>Technical breakdown</summary>

Each skip says which flag rejected it and by how much: `skip  github#412 — 412 files changed, over --max-files 200`. Across several repos the individual lines give way to one tally (`skip  6 PRs outside the size bounds (--max-files 200)`), the same way `--skip-author` reports.

It's cheap by construction: the size comes from the PR listing wherever the forge includes it (GitHub does, at no extra request), otherwise from one local `git diff --shortstat` against the base the scan just fetched — and it's measured only for the PRs that were about to be reviewed anyway, after every cheaper filter has already pruned the list. With no bound set, nothing is measured at all. A PR whose size can't be determined (a fork whose head was never fetched) is reviewed rather than dropped, the same way an unknown author is kept.

</details>

#### Re-reviewing a PR whose review failed

A review is recorded against the PR's current commit as soon as it completes — and a run that *completed but posted nothing* (say the AI was blocked on permissions and exited cleanly) still counts, so the next cycle reports `skip — no new commits since last review`. To make those PRs eligible again, add **`--no-skip`**: it ignores the "already reviewed" check for every matching PR, and a successful re-review re-stamps the commit so normal skipping resumes.

<details>
<summary>Technical breakdown</summary>

The state is one small file per PR under `~/.branchdiff/<repo>/pr-review-*`, keyed by `<platform>#<number>` — deleting it has the same effect as `--no-skip` if you'd rather reset without reviewing.

</details>

#### When the AI reviewer itself errors

If `claude`/`codex`/`gemini`/`--exec` exits non-zero — a subscription or billing issue, an invalid or missing API key, rate-limited (429), overloaded (529), a network error, or the command not found on `PATH` — the per-PR failure line and the `--notify` toast name the reason and a one-line fix. Transient ones (rate-limit, overload, network) note that the next `--watch` cycle retries on its own; the rest need you to act (re-auth, resolve billing, fix `--exec`/`--tool`, or raise `--timeout`). An unrecognised failure still shows the reviewer's clipped output, just without a named reason.

One reason is named separately from a plain "command not found": the AI itself started and ran (`--exec`/`--tool` resolved fine), but its own tool-use sandbox couldn't resolve `branchdiff` — a different binary than `--exec`/`--tool`, so the fix isn't "check `--exec`/`--tool` and PATH" the generic not-found hint gives. branchdiff already hands the AI its own install location as both an env var and a literal `export PATH=...` line inside every review/resolve prompt specifically so it can self-heal past a sandbox that drops inherited env; this failure line means even that didn't land, and points at retrying once (often a one-off sandbox glitch) or installing `branchdiff` globally so it's on this machine's default PATH regardless of what the sandbox strips.

#### When a PR's session fails to start

A PR can also fail before the AI reviewer ever runs, while `auto`/`review run --url` is checking it out into a session — a `git`/`gh` problem, not an AI one. The failure line shows the actual error plus a one-line fix: `gh auth login` for an unauthenticated GitHub CLI, `git worktree prune` (or `branchdiff killall`) for a stale worktree lock left by an earlier interrupted run, a wait-and-retry for a rate limit, installing `gh` if it's missing, or setting `BITBUCKET_USERNAME`/`BITBUCKET_API_TOKEN`. This is reported separately from the AI-reviewer errors above, so a checkout problem is never shown as an AI/Claude auth issue.

#### Picking which PRs to review

Instead of asking about each PR one at a time, `auto` lists every matching PR that needs review once, numbered:

```
[1] github #142 feature/login → main — never reviewed
[2] github #144 fix/timeout → main — new commits
Review which? (numbers comma-separated, 'a'=all, 'q'=quit)
```

Type `1,2` to review both, `1-5` for an inclusive range (or mix them: `1-5,9`), `a` for everything listed, or `q` to quit the cycle without reviewing anything. With several repos in scope the list is grouped under per-repo headings and numbered straight through, so a range picks one repo's PRs in a few keystrokes. PRs left off the list are skipped for that cycle (they're asked about again next time, e.g. under `--watch`). `--review` skips this prompt entirely and reviews everything that needs it.

#### Reviewing several PRs at once — `--parallel <n>`

By default, selected PRs are reviewed one at a time (`--parallel 1`, unchanged from before). Pass `--parallel <n>` to review up to `n` of them concurrently instead — useful when you've picked several PRs and don't want to wait for each one in turn. It requires `--worktree`: each concurrent PR needs its own isolated `.worktrees/pr-<n>` checkout, otherwise two PRs being checked out at the same time would race on your one working tree.

```bash
branchdiff auto --tool claude --worktree --parallel 3 --review
```

#### Driving an actual skill instead of the JSON pipe

By default `auto` pipes diff context to `--exec`/`--tool` and parses review JSON back — the same protocol `review run` uses. Pass `--skill` to switch to skill mode instead: the AI receives the review skill's own instructions (severity tags, analysis passes, session-isolation rules) as its prompt and posts comments itself via `branchdiff agent ...`, so there's nothing to import.

```bash
branchdiff auto --tool claude --skill                                    # built-in skill, no install anywhere
branchdiff auto --tool claude --skill-name security-focused              # a skill you generated yourself
branchdiff auto --tool claude --skill --additional-skill security-focused --prompt "skip files under ai/"
```

- **`--skill`** uses the instructions this package ships internally — nothing is written to `.claude/skills` or anywhere else; it's read straight from source and piped to the AI, so it works with zero setup.
- **`--skill-name <name>`** is for a skill you generated with `branchdiff skill add --name <name>`. Since that content is yours, `auto` requires it to already be installed and exits with an error (naming the exact `skill add` command) if it isn't — it never guesses.
- **`--additional-skill <name>`** folds another *installed* skill's guidance into the primary pass rather than running it separately — useful for a specialized skill (e.g. security-focused) that doesn't know branchdiff's own comment/resolve commands but adds a review angle worth including.

#### Adding a resolve pass — `--resolve`

After the review pass above (skill or classic — whichever ran), `--resolve` drives the built-in "branchdiff" resolve skill: the AI reads the session's open threads, fixes the code, and resolves them as it goes. It's **local only** — no commit, no push, matching the resolve skill's normal stance. `--resolve` works on its own too — no `--skill` required — resolving whatever threads are already open on that session:

```bash
branchdiff auto --tool claude --resolve                                     # classic review, then resolve
branchdiff auto --tool claude --skill --resolve                             # skill review, then resolve — one session
branchdiff auto --tool claude --resolve --resolve-prompt "leave TODOs alone" # extra resolve-only instructions
```

- **Without `--worktree`,** resolve edits your **actual working tree** — uncommitted, but real. That's expected, not a mistake; just know where the fixes land.
- **With `--worktree`,** fixes land in the same throwaway `.worktrees/pr-<n>` checkout the review pass used (one checkout, shared by both passes) — inspect or extract them manually. `--worktree-remove` still refuses to delete a worktree the resolve pass left dirty (kept + warned), so fixes are never silently thrown away.
- **`--resolve-skill-name`/`--additional-resolve-skill`** mirror `--skill-name`/`--additional-skill` exactly, but for the resolve pass, and need an already-installed `<name>-resolve` skill (`branchdiff skill add --name <name> --type resolve`).
- A resolve pass never advances the "last reviewed" marker on its own — it rides on the same commit-SHA stamp the review pass already sets, so a PR with only local fixes (no new remote commits) is correctly left out of the next `--watch` cycle until the author pushes.

#### Setting a PR verdict — `--approve [level]` / `--request-changes [level]`

These two flags decide whether a PR should be approved or have changes requested, and **always** create a local verdict comment explaining the decision — independent of `--push`. Actually setting the PR's review state (approved / changes requested) on GitHub or Bitbucket additionally requires `--push`; without it, you get the reasoning as local commentary only, and branchdiff never touches the remote review state:

```bash
branchdiff auto --tool claude --request-changes                                 # local-only verdict comment, no remote push or PR state change
branchdiff auto --tool claude --push --request-changes                     # only ever requests changes, never auto-approves
branchdiff auto --tool claude --push --approve --request-changes      # full auto-verdict: whichever applies
branchdiff auto --tool claude --push --approve 2 --request-changes 2  # gate at level 2: also blocks on open [suggestion] threads
```

- **The gate has an optional severity level, 1-5 (bare flag = 1).** Level 1 is today's default: any OPEN thread tagged `[must-fix]` blocks. Each step up also blocks the next severity tag — 2 adds `[suggestion]`, 3 adds `[nit]`, 4 adds `[question]` — and 5 blocks any open thread at all, tagged or not. If both flags are set, they must name the same level; branchdiff refuses to guess between two different ones.
- **The gate is deterministic, not the AI's opinion.** `auto` decides this itself from the session's actual open threads after the pass — an LLM never gets to self-report "this looks safe to approve". Two things block approval: any OPEN thread at or above the chosen severity level (from the AI or a human), **and** any OPEN thread a human started at all, tagged or not — an unresolved human comment is exactly the kind of thing an automated approval must never paper over. The one exception is a bare status remark with no actual feedback in it ("PR Updated", "LGTM", "done", "+1"), which never blocks on its own.
- **Either flag alone still covers both outcomes — just not both as actions.** With only `--request-changes` set: a blocked PR gets an actual `request-changes` call (with `--push`), but a clean one does **not** get auto-approved — the verdict comment instead says "recommend approving this", so a human still sees the pointer. Symmetric with only `--approve` set.

<details>
<summary>Technical breakdown — how the AI reconciles prior threads before deciding</summary>

Before deciding, the AI reconciles **every** open thread from an earlier pass — not just `[must-fix]`-tagged ones, and this check is a property of the thread state itself, not of any particular skill or format: it applies the same way whether the default skill, a custom `--skill-name`, or classic JSON mode is driving the review, regardless of who opened a thread. It judges each by what the comment describes against the current code, never by the thread's stored line number — commits shift lines, so a fix can now sit at a different line, or even a different file, than the one originally flagged.

It checks the thread's **last** comment first: if a human's own most recent reply signals agreement or closure ("fixed", "done", "lgtm", "wontfix", "please close"), the thread is resolved directly, quoting them — the commenter already made the call. Otherwise what the AI may *do* about a fixed one depends on who opened it: its own prior finding (`author.type` "agent") gets resolved directly (`branchdiff agent resolve` in skill mode, a `resolves` entry in classic mode's JSON); anyone else's (`author.type` "user") never gets resolved, even when the fix is obvious — instead the AI replies with a suggestion so the human still gets a pointer, but the thread stays open, and blocking, until they close it themselves. This is what makes the verdict converge correctly across cycles instead of staying stuck on stale findings, without the tool ever closing someone else's discussion for them without their say-so.

Classic (JSON) mode runs with `--mode full` under the hood when either flag is set, so the AI's context includes prior open threads to reason about — nothing else about classic mode changes.

The verdict comment and the PR-state change are two separate steps: the reasoning is created as a normal local comment and travels to the remote via `--push`'s `sync push`; setting the actual PR state reuses `branchdiff pr approve`/`branchdiff pr request-changes` (see [Agent command reference](#agent-command-reference)) with no comment body of its own. A failed verdict call prints the real error live (e.g. GitHub's "cannot approve your own pull request") instead of a bare "failed". If `sync push` fails, the verdict comment stays local but the remote approve/request-changes call is skipped.

</details>

#### Everything together — a watched, parallel, skill-driven review

```bash
branchdiff auto --tool claude --dest development --source 'BDN-*/dev*' \
  --parallel 3 --worktree --notify --watch 5 --skill \
  --prompt "don't check ai/**/plans"
```

This keeps running until you Ctrl-C. Each cycle it:

1. `git fetch --prune`, then lists every open PR whose **source** matches `BDN-*/dev*` and whose **destination** is `development` and that picked up non-merge commits since its last review.
2. Prompts you once — `Review which? (numbers, 'a'=all, 'q'=quit)` — since there's no `--review` (add it to skip the prompt and review everything matched; needed if nobody's at the terminal to answer each cycle).
3. Reviews your picks **up to 3 at a time** (`--parallel 3`), each inside its own `.worktrees/` checkout (`--worktree`, required for `--parallel > 1`) so your working tree is never touched.
4. Runs in **skill mode** (`--skill`): the built-in "branchdiff" review skill's instructions are piped to `claude -p`, which posts its own comments via `branchdiff agent` — no JSON to import. `--prompt` is merged into that skill prompt, *asking* the reviewer to skip `ai/**/plans` (advisory — the full diff is still sent).
5. Fires a **desktop notification** (`--notify`) on each review's start/finish/failure — and, in a `--watch` loop without `--review`, when a new cycle has PRs waiting for your selection (so you're not stuck watching the terminal).
6. Waits **5 minutes** (`--watch 5`), then repeats — staying quiet unless a matching PR has new commits.

Comments stay local unless you add `--push`. Worktrees are kept after each review unless you add `--worktree-remove`.

#### Aliasing it

A command this long is worth a shell alias so you can just type its name from the repo. Add to `~/.bashrc` / `~/.zshrc`:

```bash
alias branchdiff-auto-cd='branchdiff auto --tool claude \
  --notify --skill \
  --dest main --source "feature/*,fix/*" \
  --parallel 3 --worktree --watch 5 \
  --prompt "skip generated files"'
```

Run `branchdiff-auto-cd` from any repo checkout to start the same watched, parallel, skill-driven loop. Swap `--dest`/`--source` for your own branch naming, and `--prompt` for whatever instructions matter to your repo — or keep several aliases (one per repo/config) side by side. The single quotes keep the alias literal, so the backslash line continuations above are safe to use.

#### Tips

Alias a variant on top of the base alias instead of duplicating flags (`alias branchdiff-auto-c1='branchdiff-auto-cd --exec "..."'`), and tack extra flags onto any alias at the terminal for a one-off run (`branchdiff-auto-cd --no-skip --push`) — both expand and merge correctly.

> **Skill mode needs unattended tool access.** In skill mode the AI runs `branchdiff agent` commands *itself*. Headless (`claude -p`), a CLI with permission prompts on will block on approvals nothing can grant and post nothing — a silent "0 comments". `--tool claude` handles this for you: in skill mode it appends `--dangerously-skip-permissions` (safe — each review runs in an isolated, detached `.worktrees/` checkout) and logs that it did. If you spell out your own `--exec`, add the flag yourself: `--exec "claude -p --dangerously-skip-permissions"` (or scope it with `--allowedTools`). branchdiff warns if it looks missing.

### Unattended & cron scheduling

`auto` runs in the foreground by default, tied to the terminal that started it — close the SSH session and it's gone. `--detach` forks it into the background instead: the terminal returns immediately, output goes to a session-scoped log file, and the process survives the shell closing.

```bash
branchdiff auto --tool claude --review --detach              # one background cycle, then exits
branchdiff auto --tool claude --review --detach --watch 10   # keeps looping in the background
```

`--detach` requires `--review` — an unattended background process can never answer the PR-selection prompt. Against a discovered `--repo-paths` folder it also requires `--yes` (the backgrounded process has no terminal to confirm discovery, and a detached `--watch` can't come back to re-prompt for a repo cloned in later) — naming repos explicitly skips that, same as a foreground run. It prints a session id, pid, and log path:

```
Started detached auto session a1b2c3d4-e5f6-7890-abcd-ef1234567890 (pid 4821).
  Log: ~/.branchdiff/auto-sessions/a1b2c3d4-e5f6-7890-abcd-ef1234567890.log
  branchdiff auto attach a1b2c3d4-e5f6-7890-abcd-ef1234567890   # follow it live (once available)
```

#### Managing sessions

| Command | Does |
|---|---|
| `branchdiff auto list` | Every running `auto`: foreground runs in other terminals too, alongside every `--detach`/cron session (id, repo(s), pid, mode, watch interval, log path). `--json` for scripts. |
| `branchdiff auto attach <id>` | Read-only tail of that session's log — Ctrl-C stops watching only, never the session itself. An already-ended session prints its existing tail once and exits. |
| `branchdiff auto stop <id>` | Sends the same `SIGINT` a foreground Ctrl-C would — releases repo locks, retires servers, logs `Stopped.`. Stopping an id already gone is a clean no-op, not an error. |
| `branchdiff auto stop <pid>` | Same `SIGINT`, aimed at a **foreground** run by pid instead of a session id (a plain number is never a session id — those are UUIDs). Stopping your own pid, or a pid that's already gone, refuses/no-ops cleanly instead of erroring. The stopped run logs `Stopped — requested from another terminal (\`branchdiff auto stop\`).` instead of a bare `Stopped.`, so its own terminal shows it wasn't a local Ctrl-C. |
| `branchdiff auto stopall` | Stops every live `auto` session in one call — registered, cron, or unregistered, across every repo (unscoped, like `killall`). Prints one line per session (stopped / already gone / failed) plus a summary count; a failure on one session never skips the rest. Nothing running is a clean, non-error message. |

Sessions covering different repos (or repo sets) are fully independent — distinct session id, distinct log file, each repo's own lock. Stopping one never touches another.

A foreground `auto` (no `--detach`, no cron) has no session id or log file, but it still shows up in `auto list` — labelled `foreground`, with its pid and repos, plus a `branchdiff auto stop <pid>` hint printed right under it — so you can tell at a glance what's running and stop it from another terminal without hunting down the one that started it. Ctrl-C in that original terminal still works too; `attach` is for `--detach`/cron sessions only (those are the ones with a log to tail).

**`unregistered` sessions.** `auto list` (and the [Stats](#stats-dashboard) page's Auto sessions section) resolve "every live session" as the union of the session registry and every live per-repo lock — a lock held by a pid with no matching registry entry still shows up, flagged `unregistered`, rather than silently vanishing from the list. It's stoppable exactly like any other row (`auto stop <pid>`, the Stats page's per-row Stop, or `auto stopall`); the flag is informational only, surfacing a session whose registration write didn't land for whatever reason.

#### `--yes` — pre-approve the discovery/fresh prompts

A scripted or unattended run against a discovered folder still needs to answer `auto`'s discovery-consent prompt; `--yes` answers it as if you'd typed "yes" yourself, without needing a terminal:

```bash
branchdiff auto --repo-paths ~/work --tool claude --review --yes
```

Re-checked every `--watch` cycle (not just once at the start), so a repo cloned into `~/work` later stays covered too — this is what makes the cron scheduling below (which re-resolves `--repo-paths` forever) work unattended.

#### Scheduling with cron — `auto cron add/list/remove`

For "review PRs from 10am to 8pm on weekdays" (or any start/stop window), branchdiff manages a real cron schedule — crontab entries on Linux, a user LaunchAgent on macOS — tagged so it only ever touches its own lines:

```bash
branchdiff auto cron add --start "0 10 * * 1-5" --end "0 20 * * 1-5" \
  --repo-paths "~/work" --tool claude --review --push
branchdiff auto cron list                      # every branchdiff-managed schedule
branchdiff auto cron remove --id <cronId>      # removes both lines, stops a live session for it too
branchdiff auto cron removeall                 # removes every schedule, incl. orphaned entries/scripts
```

- `cron add` prints exactly what it just scheduled right under the confirmation — the crontab lines (Linux) or LaunchAgent plist paths (macOS) — so you can see it without a separate lookup.
- **Also from the browser** — the Stats page's Cron schedules panel (see [Stats / dashboard](#stats-dashboard)) lists every schedule live, alongside a Kill/Stop/Remove action per row, so day-to-day management doesn't need a terminal at all — `auto cron add`/`removeall` and the standing-trust prompt above still need the CLI.
- Naming repos explicitly (`--repo-paths "~/work/api,~/work/web"`) shows no prompt. Naming a **folder** shows a one-time **standing-trust** prompt first: any repo added to that folder *in the future* gets reviewed/pushed/verdicted automatically too, not only the repos listed today. Declining writes nothing.
- **`--repo-paths` must be an absolute or `~/`-prefixed path, never a bare relative name.** `cron`/`crond` always runs jobs from `$HOME`, not the directory you were in when you ran `cron add` — a relative `--repo-paths "api,web"` looks fine when you add it, then silently does nothing at every single fire. This is the single most common cron setup mistake; see the Technical breakdown below for how to spot and fix it.
- **`--notify` under cron just works** — no env vars to add yourself. Run `cron add ...` with `--notify` from your normal desktop session (not `sudo`, not a headless SSH session) and toasts fire on schedule exactly like a foreground `--notify` run. Skip it on a genuinely headless server.
- **No catch-up.** A schedule only fires at the exact wall-clock minute it matches, and only while the scheduler itself is running — a minute missed to a sleeping/rebooting machine is skipped, never queued or replayed. Added the schedule after today's `--start` already passed? Today's window just doesn't run; see the Technical breakdown below for how to cover the gap by hand.
- **More than one window a day** (e.g. 11am–1pm *and* 3pm–6pm)? Run `auto cron add` once per window — each gets its own tagged start/stop pair (`auto cron list` / `auto cron remove --id`), and both share each repo's lock so overlapping windows never double-review a PR.
- Unix only (launchd on macOS, `cron`/`crond` on Linux) — `--detach` itself has no such constraint. `--detach`/`--yes` join the other launch-wide `auto` config keys too — see [Config File](#config-file) below.

<details>
<summary>Technical breakdown</summary>

**Where the schedule actually lives.** Every scheduled flag/value, the forwarded env (`PATH`, `--notify`'s desktop vars), and the login-shell wrap go into a generated script, `~/.branchdiff/cron-scripts/<cronId>.sh` (macOS: same path, referenced from the START LaunchAgent's plist). The crontab START line itself is just `<cron> /bin/sh '<that script>'` — a small constant length regardless of how many flags the schedule carries, which keeps a flag-heavy `cron add` safely clear of the OS's crontab line-length cap (commonly ~1024 bytes). `cron remove`/`removeall` deletes the script along with the crontab/plist entries and any orphaned scripts left behind by a hand-removed entry; nothing to clean up by hand. The **start** entry runs a `--detach --watch` loop (`--yes` appended automatically) so it re-resolves `--repo-paths` live every cycle; the **end** entry runs `auto stop --cron-id <cronId>` (a silent no-op if the start job never fired or already crashed).

**Diagnosing the relative-path mistake.** With `cwd = $HOME`, `auto` exits immediately with "path does not exist" — and on a typical box with no mail transport agent, `cron` itself discards that error, so nothing appears anywhere: no toast, no log, no `auto list` entry. If a schedule seems to be doing nothing, compare `branchdiff auto cron list`'s `last start`/`last end` (a recent timestamp means it DID fire) against `auto list` and `~/.branchdiff/auto-sessions/` — no matching session/log almost always means this cwd mismatch. The same absolute-path requirement applies to the implicit "no `--repo-paths` given → use this directory" default.

**A line break in a scheduled value is flattened, not written raw**, so a `\n`/`\r` inside a free-text `--prompt` can't split the generated crontab line and break every single fire with a silent `sh` syntax error — `cron add` quotes every value through the same function, replacing any line break with a space, and warns when it does so.

**On macOS, schedules run via a per-user LaunchAgent, not crontab** — a plain crontab job needs Full Disk Access since Catalina or cron silently kills it before exec, so `cron add` sidesteps that entirely on macOS (`launchctl`-loaded, survives reboots, no manual setup step). The `--start`/`--end` vocabulary maps straight onto launchd's `StartCalendarInterval` fields; the two plists (`<cronId>.start`/`.end`) live in `~/Library/LaunchAgents`, logs in `~/.branchdiff/launchd/`. On an always-on Linux server, confirm `cron` itself resumes after a reboot with `systemctl is-enabled cron` (`sudo systemctl enable --now cron` if not) — there's no branchdiff-side mechanism to re-arm a window missed while the machine was down either way.

**Covering a gap by hand** (missed today's `--start`, or added the schedule late): fire the same invocation manually, dropping `--start`/`--end` and adding `--detach` yourself:
```bash
branchdiff auto --repo-paths "repo-a,repo-b" \
  --tool claude --review --push --skip-author --approve --request-changes \
  --keep-servers 0 --watch 10 --detach
```
This registers as a plain `manual` session (no `cronId`) sharing each repo's lock with the scheduled runs, so nothing double-reviews. The cron `--end` line only stops sessions tagged with its own `cronId`, so stop this one yourself when done (`branchdiff auto stop <sessionId>` from `auto list`). `auto list` shows every session — manual and cron alike — in one combined list, with a `mode` column (`manual` vs `cron (<cronId>)`) telling them apart; `auto cron list` shows schedules only (start/end expressions, next/last fire, running/waiting/idle), with no pid/log — that's what `auto list`/`attach` are for.

**Stopping and reconciliation.** `auto stop --cron-id <cronId>` resolves to the same stop logic as stopping by session id, and finds a schedule's live session even when its registry entry is missing, as long as its per-repo lock is still held. A session stopped this way, or by `cron remove`/`removeall`, logs which command asked for the stop in its own terminal, so it's never mistaken for a local Ctrl-C.

</details>

### Running your own PR-review bot

branchdiff's self-hosted alternative to a hosted bot like CodeRabbit — your infra, your token, your model choice. Everything below is pieces already covered above, assembled end to end:

1. **Create a bot account.** GitHub: a dedicated machine-user account (e.g. `yourorg-review-bot`) added as a collaborator/team member with write access to the target repos. Bitbucket: a dedicated user, same idea.
2. **Generate a scoped token.** GitHub: a fine-grained PAT on the bot account, scoped to the specific repos, with `Pull requests: read/write` + `Contents: read`; authenticate as that account (`gh auth login` under that account's shell/environment, or `GH_TOKEN`). Bitbucket: an Atlassian API token (bot account's email, Bitbucket app, Read + Write on repositories/pull requests), set as `BITBUCKET_USERNAME` / `BITBUCKET_API_TOKEN` — see [Bitbucket](#bitbucket) for the full setup.
3. **Put branchdiff on a server.** Clone the target repos there, install branchdiff, verify the bot identity resolves (`gh auth status`, or the Bitbucket env vars are set).
4. **Pick an AI tool.** `--tool claude` / `--tool opencode` / `--skill` — see [Automatic PR review](#automatic-pr-review-branchdiff-auto) above.
5. **Schedule it.**
   ```bash
   branchdiff auto cron add --start "0 10 * * 1-5" --end "0 20 * * 1-5" \
     --repo-paths "~/work" --tool claude --review --push
   ```
   That posts comments but leaves the approve/request-changes call to a human. For a fully autonomous bot — no one ever looks at a verdict before it lands on the PR — add `--skip-author` (never reviews its own bot-authored PRs), `--approve` + `--request-changes` (post the actual remote verdict, gated on `--push`), and a fixed, **absolute** `--repo-paths` list instead of a folder (skips the standing-trust prompt since there's no one to answer it, and sidesteps the cwd pitfall above since it doesn't depend on cron's `$HOME`):
   ```bash
   branchdiff auto cron add --start "0 10 * * 1-5" --end "0 19 * * 1-5" \
     --repo-paths "/srv/work/repo-a,/srv/work/repo-b" \
     --tool claude --review --push --skip-author --approve --request-changes \
     --keep-servers 0 --watch 10 --notify
   ```
   `--approve`/`--request-changes` without `--push` only ever write a local reasoning comment — never the remote verdict — so this combination needs both to actually act unattended (see the verdict rows in [Which flags for which scenario](#automatic-pr-review-branchdiff-auto) above). `--keep-servers 0` is worth adding here specifically: nobody's opening the browser UI on a headless bot server, so there's no reason to leave any session server resident between cycles — it retires every server this run spawned at the end of each cycle instead of the default (a single named repo has *no* sweep at all otherwise — every server stays up forever). `--keep-servers` is an explicit override regardless of repo count, so `0` applies the same way to a one-repo `auto` run as it does here with two. `--watch 10` cycles every 10 minutes for the whole window instead of a single pass — this is what makes a 10am–8pm schedule actually keep reviewing all day rather than firing once at 10am and stopping; `--notify` fires a desktop notification on each start/done/push/failure, useful for a machine you're at (skip it on a headless server with no one to see it). Every flag here is baked verbatim into the generated script (see above) — nothing to remember or re-type at fire time, and no `--` separator needed before them; the crontab line this all sits behind stays a short, fixed shape regardless of how many flags this example has.
6. **Check it.** `branchdiff auto cron list` shows each schedule's live status (`running`/`waiting`/`idle`) plus its next and last fire times, so you can confirm the bot is alive without waiting for it to fire:
   ```
     a1b2c3d4  0 10 * * 1-5 → 0 20 * * 1-5        [running]
     auto --repo-paths ~/work --tool claude --review --push
     next start: in 18h (2026-08-04 10:00)   last start: 2h ago (2026-08-03 10:00)
     next end:   in 8h  (2026-08-03 20:00)   last end:   yesterday (2026-08-02 20:00)
   ```

---

## Part 5 · Integrate

Connect branchdiff to GitHub and Bitbucket: view PRs, sync comments both ways, and drive the full PR lifecycle (approve, request changes, merge) from the toolbar or the terminal.

---

## Platform integrations

### GitHub

Sync review comments between branchdiff and GitHub PRs.

**Prerequisites:**
1. Install the [GitHub CLI](https://cli.github.com): `gh --version`
2. Authenticate: `gh auth login`
3. Your repo's git remote must point to `github.com`
4. A PR must be open for your current branch

**Required token scopes.** `gh auth login`'s default browser/device flow already grants everything branchdiff needs — nothing extra to configure for a normal account. The one scope that actually matters is **`repo`** (read/write on pull requests: view, checkout, comment, approve, request changes). Two cases need more:
- **An org enforcing SAML SSO on private repos** also needs **`read:org`**, plus that token authorized for the org: `gh auth refresh -s read:org` and re-authorize when GitHub prompts.
- **A fine-grained PAT** instead of the classic OAuth flow needs `Pull requests: Read and write` + `Contents: Read` on the repos branchdiff will touch (same as the bot-account setup below).

Check current scopes any time with `gh auth status`. A 403 with wording like "Resource not accessible" or naming a missing scope means the token is authenticated but under-scoped — `gh auth refresh -s repo,read:org` fixes it without a full re-login; this is different from an actual auth failure (`gh auth login` again) or a rate limit (wait and retry) — see [When a PR's session fails to start](#when-a-prs-session-fails-to-start) for how `auto`/`review run` tell these apart.

**Push local comments to GitHub:**
1. Write comments in branchdiff (manually or via AI review)
2. Click the PR number button in the toolbar (e.g. `#42`)
3. Click **Push to PR** — each single-comment thread is posted as an inline review comment

**Pull GitHub comments into branchdiff:**

branchdiff pulls automatically the moment a session opens against a PR-linked branch pair — no click required — so the discussion is already there the first time you look. Duplicate comments are skipped on every pull, so a manual pull afterwards is always safe to re-run:
1. Click the PR number button
2. Click **Pull from PR** — all review comments from the GitHub PR are imported as local threads
3. Duplicate comments are automatically skipped

**Sync All (pull + push in one click):**
1. Click the PR number button
2. Click **Sync All** — pulls remote comments first, then pushes any remaining local unsynced threads

**Per-thread sync badge:**

Every comment thread shows a small GitHub icon with a colored dot when a PR is active. The badge sits between the Collapse button and the Delete icon in the thread header:
- **Green dot** — thread is synced with the remote PR (was pushed or pulled from it)
- **Amber dot** — thread has not yet been pushed to the PR

Click the badge for per-thread actions: **Push this thread** (push only this one), **Pull all from PR**, or **Sync all**. The dot updates automatically after each operation — no page reload needed.

**Sync status bar:**

The dialog always shows a status bar at the top: green ("✓ All local threads are synced with the PR") or amber ("● N thread(s) not yet pushed to PR"). This reflects the actual database state and persists across close/reopen — you never need to re-run an operation just to see the current status.

**First-open preview ("N new"):**

The first time you open the PR sync dialog in a session, branchdiff runs a dry-run pull against the remote. If any remote threads or replies aren't local yet, the pull section shows an amber **N new** chip and a hint like `2 new threads · 5 new replies · click Pull to fetch`. Once you pull, the chip clears. This answers "is a pull necessary right now?" without you having to actually run the operation.

**Push before Request Changes:**

The Request Changes confirm dialog includes a **"Push N pending comments to PR first"** checkbox, on by default. With it checked, branchdiff posts every unsynced local thread before submitting the review — reviewers see your full local context alongside the changes-requested action. Uncheck it to submit the review without pushing first.

**General PR comments:**

Pull also imports PR-level comments (overall comments not tied to a file or line). On GitHub these are issue comments on the PR thread; on Bitbucket they are PR comments without an inline position. They appear in the **General Comments** panel alongside any general comments you've written locally. General comments cannot be pushed back to the PR as inline review comments.

**Review bodies (GitHub only):**

Pull also imports the note attached to an approve/request-changes/comment review — real feedback that would otherwise only show as a state icon. It appears in the **General Comments** panel like any other comment, and the reviewer badge's tooltip shows the same text on hover. Bitbucket's approve/request-changes action carries no body at the API level, so this is GitHub-only.

**PR description and remote-resolved state:**

The PR description shows in the sync dialog under the title, for both GitHub and Bitbucket. A thread already marked resolved on the remote platform (GitHub's review-thread resolve, Bitbucket's comment resolution) shows a **Resolved on remote** badge locally, distinct from branchdiff's own resolve status — so you can tell a thread someone closed out on the PR itself from one still open there.

### Bitbucket

**Setup — Atlassian API Token**

1. Go to **[id.atlassian.com/manage-profile/security/api-tokens](https://id.atlassian.com/manage-profile/security/api-tokens)** → Create API token with scopes
2. Pick the Bitbucket app, and grant it **Read** + **Write** access to repositories and pull requests
3. Set `BITBUCKET_USERNAME` to your **email address** — Atlassian tokens require email, not username

> **Important:** Repositories: Read is required for private repos — without it, the PR list API returns 401 even if Pull requests scopes are set.

```bash
# Environment variables (restart branchdiff after setting)
export BITBUCKET_USERNAME="your-email@example.com"
export BITBUCKET_API_TOKEN="your-token"

# Or a config file instead
mkdir -p ~/.branchdiff
echo '{"bitbucket":{"username":"...","apiToken":"..."}}' > ~/.branchdiff/credentials.json
chmod 600 ~/.branchdiff/credentials.json
```

**Viewing and Syncing Bitbucket PRs**

View a Bitbucket PR by pasting its URL:
```bash
branchdiff https://bitbucket.org/workspace/repo/pull-requests/123
```

Push and pull review comments identically to GitHub — click the PR number button in the toolbar. Bitbucket comments sync seamlessly with your local review threads. The **Sync All** button, **per-thread sync badge** (amber/green dot), **sync status bar**, and **general PR comment pull** all work identically to GitHub.

### Creating Pull Requests from the UI

When comparing two branches and no PR exists, branchdiff shows an "Open a Pull Request" button in the toolbar platform pill.

**GitHub:**
- Requires GitHub CLI installed and authenticated (same as PR sync)
- Uses `gh pr create` — the branch must be pushed to the remote first
- Source branch (b2) and destination branch (b1) are auto-detected from the comparison

**Bitbucket:**
- Requires Bitbucket credentials configured (same as PR sync)
- Source and destination branches are auto-detected from the comparison

**Steps:**
1. Start a branch comparison (e.g., `branchdiff main..feature`)
2. If no PR exists, the toolbar shows a yellow dot with the platform icon
3. Click the pill to expand the details popup
4. Click **Open a Pull Request** — a modal appears with auto-filled title and branches
5. Edit the title or add a description, then click **Create Pull Request**
6. The toolbar automatically refreshes to show the new PR link

> **Tip:** Use ⌘+Enter (Mac) or Ctrl+Enter (Windows/Linux) in the modal to create the PR instantly.

### Managing PRs — Lifecycle Actions

When a PR already exists, the toolbar platform pill becomes a **dropdown menu**. Click the PR badge (e.g. `#42`) to see all available actions:

| Action | What it does | Confirmation? |
|--------|-------------|---------------|
| **Approve** | Submit an approval review — tick **also post review comments** to push your pending local threads to the PR as part of approving | No — executes immediately (the confirm dialog appears when posting comments) |
| **Request Changes** | Submit a changes-requested review with an optional comment | Yes |
| **Comment** | Submit a review comment without approval/rejection | Yes — comment is required |
| **Merge** | Merge the pull request | Yes — warning displayed (GitHub supports merge, squash, and rebase strategies) |
| **Close PR** | Close/decline the PR without merging | Yes — warning displayed |
| **Reopen PR** | Reopen a previously closed PR | No — only shown for closed PRs |
| **Mark Ready for Review** | Convert draft → ready | No — only shown for draft PRs |
| **Mark as Draft** | Convert ready → draft | No — only shown for open PRs |
| **Edit Title/Description** | Edit the PR title and body inline | Opens edit modal with ⌘+Enter to save |
| **Sync Comments** | Open the comment sync dialog (Pull, Push, and Sync All) | No |
| **Open in Browser** | Open PR on GitHub/Bitbucket | Opens in new tab |

**GitHub** uses the `gh` CLI for all operations (requires `gh auth login`). **Bitbucket** uses the REST API (requires configured credentials).

After any action, the toolbar automatically refreshes to reflect the updated PR state (e.g., a merged PR updates its status).

### CLI Commands for PR, Sync & Session

Everything in [Managing PRs — Lifecycle Actions](#managing-prs-lifecycle-actions) and the sync dialog above is also available from the terminal — same actions, same effect on the PR, just without opening a browser. Commands target a running branchdiff instance via HTTP — they work from any directory.

**Targeting** — all commands accept `--port <n>` (specific port), `--pid <n>` (specific PID), or default to the instance for the current git repo. When multiple instances exist for the same repo, the command lists matches and asks you to specify with `--port`.

#### PR lifecycle

```bash
branchdiff pr info                              # show PR status for current branch
branchdiff pr info --branch feat                # lookup PR for a specific branch
branchdiff pr create --title "Fix bug" \
  --source feat --dest main                     # create a PR
branchdiff pr merge                             # merge (uses repo default strategy)
branchdiff pr merge --strategy squash           # squash or rebase
branchdiff pr approve                           # approve the PR
branchdiff pr approve --comment "LGTM"          # approve with comment (GitHub + Bitbucket)
branchdiff pr request-changes --comment "Fix X" # request changes
branchdiff pr close                             # close without merging
branchdiff pr reopen                            # reopen a closed PR
branchdiff pr draft                             # convert to draft
branchdiff pr ready                             # mark ready for review
branchdiff pr edit --title "New title"          # edit PR title
branchdiff pr edit --body "New description"     # edit PR body
branchdiff pr comment --body "Nice work"        # add a general PR comment
```

Platform (GitHub/Bitbucket) is auto-detected from the running instance's remotes. When both are configured, use `--platform github` or `--platform bitbucket` to disambiguate.

#### Comment sync

```bash
branchdiff sync push                            # push local threads to remote PR
branchdiff sync pull                            # pull remote PR comments into session
branchdiff sync push-thread <id>                # push one thread (8-char id prefix is enough)
branchdiff sync push --port 5392                # target a specific instance
```

Push shows created/updated/skipped counts. Pull shows new threads, new replies, and skipped duplicates.

**Every comment shows its file:line and review commit — locally and once pushed.** An inline comment's first message carries a `` `file:line` · reviewed at `<sha>` `` line under the body (shown in the local UI, and appended when `sync push`/`push-thread` sends it to GitHub/Bitbucket). A general comment (not tied to a file/line) instead carries the review commit plus a `file:line` list of the inline findings pushed in the same batch, since it has nothing of its own to anchor to. This is display-only — the footer is never written into the stored comment body, so it never duplicates on a re-push and stays out of exports. Replies don't carry it, only a thread's first comment.

**Resolved and dismissed threads sync too.** Push reaches every thread with a local change — resolving or dismissing a thread (with its summary reply), editing a comment, replying as the agent, or deleting a comment all mark that thread for the next push — so the resolution rationale and any dismissal decision reach the PR for other reviewers, not just open-thread comments. A reply pulled *from* the PR is the one case that doesn't re-queue, since it's already there. GitHub and Bitbucket both receive the root comment and its replies the same way. A pushed resolved or dismissed thread is also **closed on the PR**, not just its text — the same push that lands the summary reply marks the PR thread resolved (GitHub review threads resolve, Bitbucket comments resolve), so other reviewers see the rationale *and* the thread stops demanding attention. This mirror is best-effort alongside the comment push; it never fails the push itself.

#### Session management

```bash
branchdiff session current                      # show active session info
branchdiff session current --json               # JSON output
branchdiff session archive                      # archive current session
branchdiff session history                      # list archived sessions
branchdiff session history --b1 main --b2 feat  # filter by branch pair
branchdiff session delete --id <id>             # delete an archived session
```

---

## Part 6 · Operate & reference

Run and maintain branchdiff: keyboard map, shell completion, manage instances, move data between machines, read your review stats, set defaults in a config file, debug, and find help. The full feature inventory closes out the guide.

---

## Keyboard shortcuts

| Key | Action |
|---|---|
| `j` / `k` | Next / previous file |
| `n` / `p` | Next / previous hunk |
| `u` | Unified view |
| `s` | Split view |
| `f` | Full file view |
| `x` | Collapse / expand current file |
| `Shift+X` | Collapse / expand all files |
| `r` | Toggle file as viewed |
| `/` | Focus search |
| `?` | Show keyboard shortcuts |
| `Esc` | Close modal / blur search |

---

## Shell completion

Tab-completion for branches, subcommands, and flags is available for **zsh** and **bash**.

### Auto-install (global install only)

When you install branchdiff globally, the post-install script runs `branchdiff completion install` automatically:

```bash
npm install -g @encryptioner/branchdiff
# → Restart your terminal — completion is active
```

### Manual install

```bash
branchdiff completion install   # auto-detects zsh or bash
```

Or print the script and source it yourself:

```bash
branchdiff completion zsh       # print zsh completion script
branchdiff completion bash      # print bash completion script
```

**Manual zsh setup** (if auto-install did not add it to `.zshrc`):

```bash
branchdiff completion zsh > ~/.zfunc/_branchdiff
echo 'source ~/.zfunc/_branchdiff' >> ~/.zshrc
exec zsh
```

**Manual bash setup:**

```bash
branchdiff completion bash > ~/.local/share/bash-completion/completions/branchdiff
# Restart your shell
```

### What gets completed

| Context | Completions offered |
|---|---|
| First positional arg | All git branches (local + remote), `staged`, `unstaged`, `HEAD`, `.`, subcommands |
| Second positional arg | All git branches (for two-ref comparison) |
| `--mode` | `file`, `git`, `delta` |
| `--base` / `--compare` | All git branches |
| `branchdiff review <tab>` | `context`, `threads`, `import`, `run`, `skill`, `guide` |
| `branchdiff review context <tab>` | `--format`, `--files`, `--full-files`, `--no-instructions`, `--with-threads` |
| `branchdiff review run <tab>` | `--exec`, `--mode`, `--prompt`, `--url`, `--dry-run`, `--files`, `--fresh`, `--worktree`, `--worktree-remove`, `--timeout`, `--notify` |
| `branchdiff auto <tab>` | `--watch`, `--source`, `--dest`, `--tool`, `--exec`, `--review`, `--notify`, `--push`, `--approve`, `--request-changes`, `--worktree`, `--worktree-remove`, `--fresh`, `--timeout`, `--parallel`, `--skill`, `--skill-name`, `--additional-skill`, `--prompt` |
| `--tool` | `claude`, `opencode`, `codex`, `gemini`, `cursor`, `llm` |
| `branchdiff history` / `show <tab>` | All git branches and refs |
| `branchdiff skill add <tab>` | `--target`, `--dir`, `--out`, `--type`, `--name`, `--force` |
| `branchdiff agent <tab>` | every agent subcommand, then `--session`, `--port`, `--yes` |
| `branchdiff sync <tab>` | `push`, `pull`, `push-thread` |
| `branchdiff pr <tab>` | `info`, `create`, `merge`, `approve`, `request-changes`, `close`, `reopen`, `draft`, `ready`, `edit`, `comment` |
| `branchdiff session <tab>` | `current`, `archive`, `history`, `delete` |
| `branchdiff list` / `killall <tab>` | `current` |
| `branchdiff kill <tab>` | `--repo`, `--pid`, `--port`, `--worktree-remove` |
| `branchdiff completion <tab>` | `install`, `zsh`, `bash` |

Branch names come from `git branch -a` at completion time, so remote branches appear once fetched.

---

## Instance management

Multiple repos open at once — each gets its own port starting at 5391. You can also run multiple sessions **within the same repo** when comparing different ref pairs.

```bash
branchdiff list              # show all running instances (with URLs); annotates each with the last AI review time and sorts most-recently-reviewed first
branchdiff list current      # only the instances for the repo you're in
branchdiff open              # reopen browser for this repo (prompts to choose if multiple running sessions)
branchdiff killall           # stop all instances
branchdiff killall current   # stop only the instances for the repo you're in
branchdiff kill --port 5391  # stop a specific instance by port
branchdiff kill --pid 12345  # stop a specific instance by PID
branchdiff kill --repo       # stop instances for current repo only
branchdiff kill --port 5391 --worktree-remove   # also remove that session's .worktrees/pr-<n> checkout
branchdiff clear             # stop this repo's instance and delete its review data
branchdiff prune             # delete all stored data (~/.branchdiff)
branchdiff doctor       # diagnose install / environment issues
branchdiff doctor --notify   # also fire a test desktop notification
branchdiff update       # self-update (auto-detects package manager)
branchdiff version      # print current version
branchdiff version --check  # check npm for latest version
branchdiff info         # show repo fingerprint, installation info, and state table size
branchdiff state reset  # clear UI state (collapse, viewed markers) without affecting sessions
```

`list current` and `killall current` both narrow to the repo you're standing in — the set you usually mean when several repos are open. Outside a repo they report an empty result rather than failing, so they're safe in a script; `list current --json` still prints `[]`.

Opening a session's port on its own (`http://localhost:5392`) takes you straight to that session's comparison, so you never have to remember the full query string.

Rerunning `branchdiff` with the **same ref pair** in a repo that already has a running instance **reuses** it (just reopens the browser). Use `--new` to force a restart. Running with a **different ref pair** starts a new session on the next available port.

### Stale-tab protection across port reuse

If you stop branchdiff and later run a *different* review session on the same port (e.g. port 5391 hosted PR1's review, then later hosts PR2's), any browser tab still pointed at that port will not silently show the new session's comments. branchdiff handles this in two layers:

- Every API request from the UI carries an `X-Branchdiff-Server-Id` header. The server rejects requests carrying the previous process's id with `409 STALE_SERVER`.
- The UI also polls `/api/info` and detects the mismatch, then shows an amber banner ("a new review session is running on this port — this tab's session is no longer active") with a **Refresh** button. All API traffic is gated until you refresh.

The result: a tab opened for one PR review can never display threads or comments from a later, unrelated review that happens to claim the same port.

### Background mode

Run branchdiff in the background to free your terminal:

```bash
branchdiff main --detach     # run in background, prints URL and exits
branchdiff main -d           # short form

# Check status later
branchdiff list               # shows URLs for all running instances

# Stop when done
branchdiff killall            # stop all instances from any directory
```

Logs are written to `~/.branchdiff/logs/`.

### Close session from the browser

Every 3-dot menu (toolbar, commit detail, file browser, changelog, guideline) has a **Close session** button at the bottom. Clicking it stops the server and closes the browser tab — equivalent to running `branchdiff kill` from the terminal.

### Running multiple sessions in the same repo

Useful when you want to review a colleague's PR while also diffing your own branch:

```bash
# Terminal 1 — review a PR branch
branchdiff main feature/payments

# Terminal 2 — check your own work in progress
branchdiff main feature/auth

# Both open in separate browser tabs; branchdiff open will prompt which to focus
branchdiff open
```

Each session keeps its own comments, viewed markers and collapse state. Because two are live, `agent` and `review` commands need to know which one you mean — pass `--port` / `--session`, or set `BRANCHDIFF_SESSION_ID` for the shell. See [One AI, one session](#one-ai-one-session).

---

## Export & Import

Back up your review & tour data and restore it on another machine — useful when switching devices, collaborating with a teammate, or archiving finished reviews.

### Export

```bash
branchdiff export --all                        # export every session
branchdiff export --all --output backup.json   # custom filename
branchdiff export --sessions abc123,def456     # specific sessions only
```

The output is a self-contained JSON file containing sessions, comment threads, replies, and code tours.

### Import

```bash
branchdiff import backup.json                          # merge (default)
branchdiff import backup.json --conflict skip          # skip duplicates
branchdiff import backup.json --conflict overwrite     # overwrite existing
branchdiff import backup.json --dry-run                # preview without writing
```

**Conflict strategies:**

| Strategy | Behaviour |
|---|---|
| `merge` (default) | Keep whichever version has the newer timestamp |
| `skip` | Leave existing data untouched, ignore incoming duplicates |
| `overwrite` | Replace existing sessions with the imported version |

Sessions are matched by their semantic key (`branch1 + branch2` for branch comparisons, `ref + HEAD hash` for snapshots) — not UUID. This prevents duplicate ghost sessions when importing across machines.

A round-trip preserves everything: PR number/platform/description, files/lines reviewed, sync state, and comment review verdicts all survive an export → import cycle, in the CLI and the browser alike. Comments merge the same way threads do — an edited-on-source comment with a newer timestamp wins on import; normal day-to-day use stays append-only. Importing on a different repo remaps any imported viewed/collapse state to that repo, so it actually shows up instead of being silently orphaned under the source repo's identity. A malformed or partial file is reported precisely — which entity is missing what field, rather than a bare parse error.

### UI

Both Export and Import are also available in the **3-dot menu** (⋯) on the diff view and file browser:
- **Export** — opens a checklist of sessions; select which to include and download the file. The downloaded filename includes the repository name and timestamp (e.g. `branchdiff-export-my-repo-2026-01-15_10-30-00.json`).
- **Import** — upload a `.json` export file, choose conflict strategy, and confirm. A warning appears if the file came from a different repository.

---

## Stats / dashboard

See how much branchdiff has actually reviewed for you — reviews run, comments posted, lines and files reviewed, resolution and approval rates, and a per-PR breakdown — aggregated across **every repo** under `~/.branchdiff`, or narrowed to just the one you're in.

```bash
branchdiff stats                          # opens the /stats dashboard (last 30 days by default)
branchdiff stats --repo                   # scope to the current repo only (default: all repos)
branchdiff stats --no-open                # print a text summary to stdout instead
branchdiff stats --json                   # machine-readable JSON (for scripts)
branchdiff stats --share                  # a shareable markdown summary block
branchdiff stats --days 30 --no-open      # time-window: last N days (default 30; --days 0 = all time)
branchdiff stats --since 2026-07-01 --until 2026-07-31 --no-open   # explicit range
branchdiff stats --today --no-open        # time-window: today only
```

The dashboard shows:
- **KPI tiles** — reviews, comments, threads, replies, lines reviewed, files reviewed. Hover any tile for exactly what it counts — the Reviews tile breaks down branch-pair vs snapshot (a local ref/branch comparison with no PR attached counts too), and the rest note whether the My activity / Whole PR toggle affects them.
- **Highlights** — resolution rate, approval rate, average comments/lines per review, busiest day, longest daily streak. Each only appears when the underlying counts make it meaningful (no "0%" noise on a near-empty history).
- **Charts** — verdict breakdown (approved / changes requested / commented) taken from branchdiff's own review verdict (`auto` / `review run`), so it populates for Bitbucket PRs as well as GitHub; plus thread status (open / resolved / dismissed), a resolved-by-whom split (you / resolve skill / platform), a reviews-and-comments time series (auto-downsampled to weekly/monthly over long windows), and a per-repo bar chart.
- **By platform** — GitHub vs Bitbucket split, when your sessions span both.
- **Recent PRs** — a table per pull request: review pass count (every re-review of the same PR counts, not just its first), verdict, severity-tagged comment counts (must-fix / suggestion / nit / question), and resolved-thread fraction. Each PR number links to the PR on its forge (GitHub or Bitbucket) in a new tab. Comment bodies and PR descriptions are never included — counts only.
- **Per-repo breakdown** — a table of reviews, comments, threads, and last-reviewed date for every repo (hidden when scoped to one repo), plus a compact summary per repo: passes (times reviewed), distinct PRs, approved, changes-requested, and suggestions (`Passes`/`PRs`/`A`/`CR`/`S`; the summary tooltip expands every code).
- **Quick commands** — four collapsible sections mirroring CLI commands you'd otherwise run in a terminal: **Instances** (`branchdiff list`), **Auto sessions** (`branchdiff auto list`), **Cron schedules** (`branchdiff auto cron list`), and **Configs** (`branchdiff config` — see [Config File](#config-file) below for the precedence model). Each fetches live data on expand, grouped by repo, with a **Refresh** button, and lets you act on any entry directly — **Kill** an instance, **Attach**/**Stop** an auto session, **Remove** a cron schedule — every action button's tooltip naming the exact CLI command it performs.
- **Bulk actions** — once a section has at least one entry, a page-level **Kill all** / **Stop all** / **Remove all** button appears, matching the per-row commands (`branchdiff killall`, `auto stopall`, `auto cron removeall`), with the same click-to-arm, click-again-to-confirm pattern as every per-row action.

<details>
<summary>Technical breakdown</summary>

A **refresh icon at the top of the dashboard** reloads the whole page at once — the usage-stats query plus whichever quick-command sections you currently have expanded — spinning while it works and toasting success or naming any section that failed. A foreground (non-detached) auto session shows only **Stop** (no **Attach** — it has no log file to tail); stopping it this way prints `Stopped — requested from the Stats page.` in the terminal it's running in, so whoever's sitting there knows it wasn't their own Ctrl-C. An auto session found only through its live per-repo lock (no matching registry entry) is flagged **unregistered** — informational only, it stops exactly like any other row. Firing a bulk action disables every button (bulk and per-row) in that section until it resolves, then toasts a count of how many succeeded; the Instances section also badges the row matching the port you're viewing Stats from as **this session** — informational only, **Kill** still works on it like any other row.

</details>

**My activity vs Whole PR.** A toggle at the top of the dashboard switches the author-scoped numbers — comments, threads, replies, verdict breakdown, severity counts, and the trends comments series — between **My activity** (the default) and **Whole PR**:

- **My activity** counts only *your* work: comments and verdicts from branchdiff's automated reviews, plus anything you did manually (a comment, approve, or request-changes — whether through branchdiff or directly on GitHub/Bitbucket, which branchdiff re-reads on its next pull). Other people's comments and other bots are excluded.
- **Whole PR** counts everyone on the PR — you, teammates, and other bots.

branchdiff's verdict is approve or request-changes only, so the **My activity** verdict pie has no "Commented" slice; switch to **Whole PR** to see teammates' commented reviews as a third slice. Reviews, lines, files, and passes are always yours regardless of the toggle (they are branchdiff sessions). **What's stats?**, next to the scope toggle, opens a scrollable explanation of every section on the dashboard plus a glossary defining each class. Your identity is resolved from `gh` (GitHub) and your Bitbucket credentials; if it can't be resolved, your manual actions can't be attributed and fall under Whole PR only.

**Resolved (by whom).** Every Resolve/Dismiss click or resolve-skill pass now records who acted, split into four slices: **You** (a Resolve/Dismiss click in the browser), **Resolve skill** (the resolve skill, `review import`, or `review run` applying an AI resolve), **Platform** (resolved directly on GitHub/Bitbucket — this can be a teammate, not just you), and **Other (pre-tracking)** for threads resolved before this attribution existed. This chart is always whole-repo and doesn't switch with the My activity / Whole PR toggle above — a local `reviews.db` has exactly one operator, so "You" and "Resolve skill" are already unambiguous without needing your login.

**Time window:** preset chips (All / 90d / 30d / 7d / Today, defaulting to 30d) or a custom date range, both reflected in the URL so a filtered view is shareable. **Scope:** an "All repos" / "This repo" toggle, also reflected in the URL (`?scope=repo`). The activity toggle is reflected in the URL too (absent for the default My activity view, `?activity=pr` otherwise).

**Sharing:** **Copy summary** copies a markdown block (the same shape `--share` prints) to your clipboard; **Export PNG** downloads the dashboard as an image, matching your current theme.

### Platform activity

The **Platform activity** button opens a modal that pulls *your* cross-platform pull-request activity — across **both GitHub and Bitbucket** — over a date range you choose, preseeded from the dashboard's current window, into four dimensions: **PRs authored**, **PRs approved/reviewed**, **Commits pushed**, and **Comments/reviews given**.

It's a query-builder, not an auto-load: you pick a date range, toggle which platforms and which dimensions you want, then click **Fetch**. Nothing runs until you do, so a quick glance at a single dimension costs only that one query. Each dimension carries a cost badge — **fast** (authored, approved: list searches), **medium** (commits), or **slow · per-PR walk** (comments, which has to fetch each PR's review history) — so you can drop the expensive one when all you need is a tally. The **fast** dimensions (authored, approved) come checked by default; the costlier **commits** and **comments** start unchecked, so the expensive ones are opt-in. While it runs, a spinner shows the two platforms fetching independently.

**Platforms default to both.** GitHub and Bitbucket run independently: each is fetched on its own, so one can come back with results while the other reports a missing credential or rate-limit. Deselect a platform you don't care about, or have no credential for, before fetching.

**Scope is your tracked repos** — the repos you've run `branchdiff` in (running it in a new one is the only "registration" needed). Pick specific repos in the **Repos** checklist, or **Select all**; **Fetch** stays disabled until at least one is checked.

Results open in a near-full-screen modal: a sticky filter bar (repo dropdown, platform toggle, free-text search — all client-side, no re-fetch), an **Insights** card summarizing the report at a glance, a **By PR** rollup, and per-platform tables for each dimension you queried. **Copy all** copies the whole report as markdown; **Reconfigure** goes back to the query form.

Reachable three ways: `branchdiff stats` (auto-opens the dashboard), the **3-dot menu** → **Stats**, or the `--no-open`/`--json`/`--share` flags for scripting and AI agents.

<details>
<summary>Technical breakdown</summary>

The filter bar's repo dropdown lists only the repos already in the report (not every tracked repo) and offers **Select all** but no **Clear** (an empty selection would show nothing, so **Apply** stays disabled until at least one repo is staged); checking boxes never hits the API — narrowing takes effect only once you click **Apply**, recomputing the Insights figures and every Copy markdown string to match. The platform toggle (**All** / **GitHub** / **Bitbucket**) only appears when both platforms actually returned data; both per-platform variants of every figure are computed up front, so switching never re-fetches. The whole report scrolls as one page, with the header and filter bar pinned and a floating **↑** button once you've scrolled down.

The **Insights** card only shows a figure for a dimension you actually checked (never a misleading zero for one you didn't) — the four raw activity counts; how many of your reviews/comments landed on **other people's PRs** versus your own; the review-verdict breakdown; commits split by category and grouped under their top ticket IDs; and your busiest day.

The **By PR** rollup is one row per PR across both platforms that you authored, reviewed, or commented on. Each row's 💬 button reveals that PR's comments inline: on **GitHub** the count is already in the report (the global events feed, capped near 90 days/300 events by GitHub itself) so it just displays; on **Bitbucket** it fetches on first click, since the automatic scan only covers PRs you authored or reviewed — this button is the per-PR way to pull comments for any other tracked PR. Collapsing the list never clears the count once known.

The per-platform tables: **commits** carries a **Ticket** column pulling each branch's ticket ID out of its name (`BSP-146/dev/v1/…` shows `BSP-146`), grouping work by ticket across branches. **Approved/reviewed** carries a **Verdict** column, and on a changes-requested row also shows who approved it instead when that's available (from Bitbucket's PR participants, or GitHub's changes-requested set). Bitbucket counts every review you gave — approved, changes-requested, and comment alike.

</details>

---

## Options

| Flag | Description |
|---|---|
| `--mode <file\|git>` | Diff mode (default: `git`) |
| `--port <n>` | Port (default: auto-assigns from 5391) |
| `--no-open` | Don't auto-open browser |
| `--dark` | Dark theme |
| `--unified` | Unified view (default is split) |
| `--quiet` | Minimal terminal output |
| `--new` | Archive current session and start fresh |
| `-p, --previous [n]` | Compare branch against Nth previous commit (default: 1). Use `-p 0` for unstaged-only view |
| `--worktree` | With a GitHub or Bitbucket PR URL: check the PR out into `.worktrees/pr-<n>` instead of switching your working tree |
| `--no-sync` | Skip fast-forwarding the compared branches from their remote first |

Subcommands have their own flags — `branchdiff <command> --help` lists them. Two appear on every `agent` and `review` subcommand:

| Flag | Description |
|---|---|
| `--session <id>` | Act on this session (see `branchdiff list`) |
| `--port <n>` | Act on the session served on this port |

**Environment variables**

| Variable | Effect |
|---|---|
| `BRANCHDIFF_SESSION_ID` | Pins every command in the shell to one session — no `--session`/`--port` needed |
| `BRANCHDIFF_PORT` | Same, by port |
| `BRANCHDIFF_DEBUG=1` | Diagnostic output (see [Debug Mode](#debug-mode)) |

`review run` and `auto` set the first two automatically on the AI they launch, which is what keeps concurrent reviews from reading each other's sessions.

---

## Config File

Stop retyping long flag sets. branchdiff reads two optional JSON files and fills in any flag you didn't pass on the command line — a flag you actually type always wins.

| File | Scope |
|---|---|
| `~/.branchdiff/config.json` | Global — applies everywhere |
| `.branchdiff.json` | Folder-level — a repo root, or the directory you ran branchdiff from |

Both are optional; a missing file is not an error. Two top-level keys are recognized:

- **`defaults`** — mirrors the root command's flags (`base`, `compare`, `mode`, `port`, `open`, `detach`, `quiet`, `dark`, `unified`, `new`, `previous`, `worktree`, `sync`), by their commander attribute name (`--no-open` → `open`).
- **`auto`** — mirrors every `auto` flag, by its camelCase name (`--max-files` → `maxFiles`).

```json
// .branchdiff.json
{
  "defaults": { "port": "6100", "dark": true },
  "auto": { "notify": true, "maxFiles": 200, "skipAuthor": true }
}
```

**Precedence** — a flag you pass on the CLI always wins. For the root command, `.branchdiff.json` in the directory you ran branchdiff from beats `~/.branchdiff/config.json`. For `auto`, every key falls into one of three tiers:

- **Launch-wide** — resolved once for the whole run (e.g. `repoPaths`, `watch`, `keepServers`): CLI flag → launch directory's `.branchdiff.json` → global config → built-in default.
- **Per-repo** — resolved separately for each target repo, so a multi-repo run can give each its own size gates, skill, notify setting, and so on: CLI flag → that repo's own `.branchdiff.json` → launch directory's `.branchdiff.json` → global config → built-in default.
- **Exec-only** (`exec`, `tool`) — only from `~/.branchdiff/config.json` or a CLI flag, never from any `.branchdiff.json` — a committed folder-level config can't make `auto` run an arbitrary shell command the moment someone else clones the repo.

Run `branchdiff config` to see the fully-merged effective config for where you're standing, with the tier each value came from — a key nobody set anywhere still shows its actual built-in default, so you never have to hunt for what a flag defaults to. `branchdiff config sample` writes a starter file with the commonly-useful keys (`--full` for every key with a fixed default, `--global` for `~/.branchdiff/config.json` instead of the current directory).

**Also from the browser** — the same resolution is browsable at `branchdiff stats` → **Configs**: pick a launch directory and expand **Global** / **Launch dir** / each repo to see its raw file plus the fully-resolved per-key table, with **create** offered wherever a file doesn't exist yet (seeded from what's currently in effect). Copy a file's path/content or open it in your default editor straight from the tree.

<details>
<summary>Technical breakdown</summary>

`yes` is a launch-wide field never read from a target repo's own `.branchdiff.json` — its consent decision is made before any individual (possibly untrusted, discovered) repo's own config is read, so a discovered repo can't self-approve its own inclusion.

Full per-tier field lists:

| Tier | Fields | Can be set from |
|---|---|---|
| Launch-wide | `repoPaths`, `repoConcurrency`, `keepServers`, `watch`, `forceSession`, `detach` | CLI, launch-dir `.branchdiff.json`, global config |
| Launch-wide (global/launch-dir only) | `yes` | CLI, launch-dir `.branchdiff.json`, global config — **not** a target repo's own `.branchdiff.json` |
| Per-repo | `source`, `dest`, `review`, `notify`, `push`, `approve`, `requestChanges`, `worktree`, `worktreeRemove`, `fresh`, `timeout`, `parallel`, `skip`, `skipAuthor`, `maxFiles`, `minFiles`, `maxLines`, `minLines`, `skill`, `skillName`, `additionalSkill`, `prompt`, `resolve`, `resolveSkillName`, `additionalResolveSkill`, `resolvePrompt` | CLI, that repo's own `.branchdiff.json`, launch-dir `.branchdiff.json`, global config |
| Exec-only | `exec`, `tool` | CLI, global config only |

`branchdiff auto cron add` resolves `repoPaths` at the same launch-wide tier and order (CLI → the directory you ran `cron add` from → global config). Since the crontab job itself always runs with `cwd = $HOME`, a launch-dir `.branchdiff.json` set anywhere other than `$HOME` won't be read again at fire time — put a durable `repoPaths` in the global config instead if you rely on config rather than `--repo-paths` for a scheduled run.

An unrecognized key in either file prints a warning naming the key and file, then is ignored. Malformed JSON fails clearly: for the root command and a single-repo `auto` run this stops the command; for a multi-repo run, a bad per-repo config only skips that one repo, while a bad global or launch-directory config stops the whole run.

`config sample --full` groups every valid key under its correct `defaults`/`auto` section; a key with no single fixed default (e.g. `maxFiles`, `base`, `skillName`) is never guessed at with a placeholder, just named in a note after the file is written. `exec`/`tool` only become eligible with `--full --global`, matching the exec-only tier's own restriction. `config --json` emits the same resolution as JSON, and `--dir <path>` resolves against an arbitrary directory — given a directory that isn't itself a repo, both expand to every repo directly under it, the same depth-1 rule `auto`'s own discovery uses.

A bare key name can exist in more than one section with a different meaning — `detach` is both a root-command flag and a whole-run `auto` flag; `worktree` is both a root-command flag and an `auto` per-repo flag. The CLI and the Stats "Configs" section always show each key under its own section heading (`defaults` vs `auto — …`) so the two are never confused. The Stats page's ⓘ button explains these same precedence rules, including the caveat that the launch-dir tier is wherever you point it, not a fixed parent folder — branchdiff has no ancestor-directory config cascade.

</details>

---

## Debug Mode

Set `BRANCHDIFF_DEBUG=1` to print diagnostic output from branchdiff to the terminal. Works in all versions, including the published npm package.

```bash
BRANCHDIFF_DEBUG=1 branchdiff origin/main origin/my-feature
```

**What it logs:**

| Log line | Means |
|---|---|
| `GitHub remote: { owner, repo }` | GitHub remote was detected |
| `GitHub remote: none` | No GitHub remote found in this repo |
| `Bitbucket remote: { workspace, repoSlug }` | Bitbucket remote was parsed from git remote URL |
| `Bitbucket credentials: username=...` | Which username was loaded from env or config file |
| `Bitbucket credentials: none` | No credentials found — set `BITBUCKET_USERNAME` + `BITBUCKET_API_TOKEN` |
| `Bitbucket fetchDetails error: ... 401` | Credentials exist but are invalid or missing **Pull requests: Read** scope |
| `Bitbucket PR lookup: { branch, destinationBranch, resultCount: 0 }` | Credentials valid, no open PR found for that exact source → destination pair |
| `Bitbucket PR lookup: { branch, destinationBranch, resultCount: 1 }` | PR was found (problem is elsewhere) |
| `GitHub getPr error: ...` | `gh pr view` failed — check `gh auth status` |
| `GitHub PR lookup: { branch, baseBranch, resultCount: 0, number: null }` | No open PR found for that exact head → base pair |
| `GitHub resolvePrNumberForBase error: ...` | `gh pr list --head/--base` failed — check `gh auth status` |
| `GitHub getFiles/getComments/pullComments error` | Comment sync step failed |
| `Bitbucket getDiffStatFiles error` | Comment push: failed to list PR files |
| `git getBlobMap(branch) error` | Branch comparison: git ref not found or invalid |
| `git getBranchFileContent(branch, file) error` | File content fetch failed for that branch/file |
| `git getBranches error` | Could not list git branches |

**Common fixes from debug output:**

- **Bitbucket 401** — `BITBUCKET_USERNAME` must be your email address (Atlassian API tokens use email, not username). Also ensure **Repositories: Read** scope is enabled (required for private repos).
- **Bitbucket resultCount: 0** — verify the branch name shown matches the PR's source branch exactly on Bitbucket, and that the PR's destination matches the branch you're comparing against (a branch with open PRs to more than one destination only matches the one branchdiff is actually comparing).
- **repoSlug or workspace wrong** — check your git remote URL: `git remote get-url origin`.
- **getBlobMap error** — the branch ref passed to branchdiff doesn't exist locally; run `git fetch` first.

**`--debug` — full stack traces on a fatal error.** Separate from `BRANCHDIFF_DEBUG=1`: that env var streams the diagnostic detail in the table above while a command runs *normally*; `--debug` is a leading global flag that only matters when a command *fails*, printing the full stack trace under the one-line `Error:` message. Place it before the subcommand — `branchdiff --debug auto`, not `branchdiff auto --debug` — because it's a root-level option read before the subcommand dispatches. Whether or not `--debug` is set, every fatal prints a red `Error:` line and names the per-run log file under `~/.branchdiff/logs/` where that invocation's full output is kept; `--debug` just brings the stack trace into the terminal too.

---

## Troubleshooting

#### "Not a git repository"

Run from inside a git working tree.

#### A fatal error with no detail, or just a non-zero exit

Rerun with `--debug` placed before the command — `branchdiff --debug <command>` — for the full stack trace (see [Debug Mode](#debug-mode)). Every fatal also names the per-run log file under `~/.branchdiff/logs/` where the invocation's full output, including the trace, is kept.

#### branchdiff can't see a remote that `git remote -v` clearly shows

Very old `git` versions emit remote output in a format branchdiff doesn't recognize, so the remote looks absent even though it's configured and `git remote -v` prints it fine. Update `git` to the latest release (`git --version` to check what you're on) and retry.

#### Port already in use

Use `branchdiff --port 7000`.

#### UI won't load / stale state

Run `branchdiff --new`.

#### "Local &lt;branch&gt; not updated: local branch has diverged"

Your local copy has commits the remote doesn't, so branchdiff won't touch it and compares the local revision instead. Reconcile it yourself (`git rebase`, `git merge`, or `git reset --hard origin/<branch>` if the local commits are disposable), or pass `--no-sync` to silence the step.

#### "Refusing to review stale code"

The branch being reviewed is behind the pull request, so the review would describe an old revision. Update it (`gh pr checkout <n>`, or `git pull`) and retry. `--allow-stale` reviews the local revision anyway.

#### "N branchdiff sessions are live for this repo"

You have more than one session open here, so branchdiff won't guess which one you meant. It lists them; pick one:

```bash
branchdiff list                          # see every running session
branchdiff agent list --port 5391        # target one by port
branchdiff agent list --session <id>     # or by session id
branchdiff agent list --yes              # use the last-active one deliberately
```

Working on one session for a while? Set it once and drop the flag:

```bash
export BRANCHDIFF_SESSION_ID=<id>        # every command in this shell now targets it
```

Closing the sessions you're done with (`branchdiff kill --port N`) also makes the message go away. See [One AI, one session](#one-ai-one-session).

#### `branchdiff auto` says it's "refusing to review without confirmation"

You ran it somewhere without a terminal to prompt in (a script, CI, a pipe). Add `--review` to review every match unattended, or run it in a normal terminal to get the selection prompt.

#### `branchdiff auto` skips a PR you expected it to review

It only reviews PRs with *non-merge* commits since their last review, so merging main into your branch doesn't retrigger one. `--fresh` forces a clean review of the current state.

#### `auto` can't start a PR's session

`auto` checks each PR out into a review session before the AI reviewer runs, and that checkout can fail — a `git`/`gh` problem, not an AI one. The usual culprit is a stale worktree or `index.lock` left behind by an earlier interrupted run (a crash, a `kill`, or a `--worktree --detach` server that never retired). Clear it and retry:

```bash
branchdiff killall          # retire any leftover detached servers
branchdiff prune-worktrees  # drop stale worktrees git no longer sees, plus any lingering pr-<n>
```

`gh pr checkout`'s "branch already used by another worktree" is the most common shape of this — branchdiff recovers from it automatically when it safely can: if the branch is held by a **clean, branchdiff-owned** `.worktrees/pr-<n>` leftover from a prior cycle (not a live sibling under `--parallel`, not dirty, not your own worktree or the main checkout), it removes that stale worktree and retries once, no action needed. When it can't — the branch is checked out in your own worktree, a dirty `pr-<n>`, or a possibly-live `--parallel` sibling — it skips that PR with a message naming exactly where the branch is held and how to free it, instead of crashing the run.

`branchdiff prune-worktrees` reports removed vs kept (a worktree with untracked/modified files is kept and reported, same guard `kill --worktree-remove` uses) and only ever touches branchdiff's own `pr-*` worktrees, never one you or another tool created; add `--repo-paths <paths>` for a sweep across repos instead of just this one. `scripts/prune-worktrees.sh` does the same thing as a standalone shell script for a cron entry (see its own header for setup) — same kept-not-deleted guarantee for a dirty `pr-*`, so a scheduled run never silently destroys uncommitted work — reach for it for scheduled cleanup outside of any branchdiff session; the CLI command above covers a one-off run.

The same step can fail for other checkout-time reasons — an unauthenticated `gh`, a rate limit, missing `gh`, or missing Bitbucket creds — each shown on the failure line with its one-line fix. See [When a PR's session fails to start](#when-a-prs-session-fails-to-start) for the full list, and run `branchdiff <pr-url>` directly in the repo to see the raw `git`/`gh` output for the failing checkout.

#### "detected dubious ownership" when using `--worktree`

git's `safe.directory` is matched per exact path, so a worktree branchdiff creates under your repo isn't automatically covered. branchdiff now trusts the worktrees it creates itself; if you still hit this on an older version:

```bash
git config --global --add safe.directory '/path/to/repo/.worktrees/pr-123'
```

#### Desktop notifications don't appear

`--notify` is best-effort and never blocks a review. Linux needs `notify-send` (`libnotify-bin`); macOS and Windows work out of the box. Under WSL or on a headless box there's no notification daemon, so it silently no-ops — the terminal output is always the source of truth.

Start with **`branchdiff doctor --notify`**. It reports which backend your platform will use and whether it's installed, fires one test toast, and — if you don't see it — lists exactly what to check on your OS. `BRANCHDIFF_NOTIFY_DEBUG=1` on any command prints what was attempted. Between them they separate the two cases that look identical from outside: nothing was fired at all, versus the OS accepted the notification and chose not to show it.

The second case is the common one on **macOS**, where a toast is attributed to the app that requested it and notification permission is granted **per app**. Which app that is depends on the backend:

- **`terminal-notifier` installed** (`brew install terminal-notifier`) — toasts are attributed to *terminal-notifier*, which appears in System Settings → Notifications as its own entry you can allow. This is the default when it's on your PATH, and it's also the only backend with click-to-open.
- **Otherwise** — the built-in `osascript` is used, and its toasts are attributed to **Script Editor**. If Script Editor's alert style is "None", they land silently in Notification Center. Worse, on some machines Script Editor never appears in that list at all — macOS won't prompt for it either, so there is no way to grant the permission. Installing `terminal-notifier` is the fix for that.

Either way: set the relevant app to Allow Notifications, style Banners or Alerts. `BRANCHDIFF_MAC_NOTIFIER=0` forces the built-in path if a `terminal-notifier` install misbehaves.

#### Native module errors (`better-sqlite3`)

Its compiled `.node` binding is locked to one Node major version at a time, and breaks two ways:
- **ABI mismatch** — you switched Node versions (`nvm use`, an OS update, a new machine) and the binding wasn't rebuilt for the new one. The error names both versions (`NODE_MODULE_VERSION X` vs `Y`).
- **Missing entirely** — "Could not locate the bindings file". Common on NTFS/FUSE mounts: the binding gets orphaned if a branchdiff server held it open while something replaced the file underneath it.

Either way, stop every branchdiff process first — rebuilding while one still holds the binding open just orphans it again — then rebuild for whichever Node version you actually run branchdiff under:
```bash
branchdiff killall
npm rebuild -g better-sqlite3
```
Working from a source checkout (`pnpm install`) instead of the published package? `pnpm rebuild better-sqlite3` can silently no-op if pnpm believes the install already succeeded once, even with the binding file gone. If the file's still missing afterward, rebuild it directly:
```bash
cd node_modules/.pnpm/better-sqlite3@*/node_modules/better-sqlite3
npx node-gyp rebuild --release
```

`branchdiff doctor` is the way to confirm the fix worked — it actually opens a database, not just checks the module is requireable, so it catches this reliably. Run it under **every** Node version/entry point you invoke branchdiff from, not just your current shell — see the next entry for why that matters with `nvm`.

#### Using `nvm` with more than one Node version (including a cron-scheduled `auto`)

A single `node_modules/better-sqlite3` holds one compiled binding at a time. If you run branchdiff under more than one Node version (e.g. `nvm use 24` sometimes, an older default `node` other times), whichever version you last rebuilt the binding for works and every other version breaks with the ABI-mismatch error above — `branchdiff doctor` under each Node path you use is how to check.

<details>
<summary>Technical breakdown — why a cron schedule pins one exact Node binary</summary>

`branchdiff auto cron add`'s generated script bakes in `process.execPath` and `process.argv[1]` — the exact Node binary and branchdiff script that ran the `add` command — not a bare `branchdiff` resolved from `cron`'s PATH at fire time. That's deliberate: `cron` never sources `.bashrc`/`.nvmrc`/`nvm.sh`, so resolving `nvm` fresh on every single fire would be more moving parts, not fewer.

Two consequences: changing your shell's default Node version (`nvm alias default <n>`) has zero effect on a schedule that already exists — check what's actually pinned with `cat ~/.branchdiff/cron-scripts/<cronId>.sh | grep exec`, and `auto cron remove --id <id>` + re-`add` under the Node version you want if it's wrong. And while `auto cron add` checks the binding before writing anything (so it can't schedule an already-broken job), it can't protect against the binding breaking *after* the schedule exists — that fails silently on every fire with nothing but the session log to notice.

</details>

#### Cron doesn't inherit your shell's `PATH` or env vars

`cron` starts every job with a short built-in `PATH` and no environment — so `git`/`gh`, an AI CLI in a user-local directory, or forge credentials (`GH_TOKEN`, `BITBUCKET_USERNAME`/`BITBUCKET_API_TOKEN`) can all resolve to nothing under cron even though they work fine when you run `branchdiff` yourself. `auto cron add` handles all of this automatically — nothing to hand-edit in `crontab -e`.

<details>
<summary>Technical breakdown — how each kind of value is carried, and doing it by hand</summary>

`PATH`, `DISPLAY`, and `DBUS_SESSION_BUS_ADDRESS` are copied once, as a snapshot, straight into the schedule's generated script from the shell running `add` — fine, since none of them rotate. Forge auth (`BITBUCKET_USERNAME`/`BITBUCKET_API_TOKEN`/`GH_TOKEN`/`GITHUB_TOKEN`/`GH_HOST`/`GH_ENTERPRISE_TOKEN`) is never snapshotted, since a token rotated after `cron add` would otherwise sit stale for the schedule's whole lifetime — instead the scheduled job's exec runs inside your own login shell, sourcing your profile fresh on every fire, so a rotated token is picked up by the very next cycle. A team using only GitHub, only Bitbucket, or no `--notify` simply has fewer snapshot vars to copy — no warning either way.

A custom `--exec` command's own env vars ride the same login-shell wrap — `export` one in `~/.zshrc`/`~/.bashrc` and the scheduled job sees it at every fire, no crontab edit needed. The alternative is a plain `VAR=value` line at the top of the crontab (`crontab -e`, applies to every job in that file):
```
MY_TOOL_API_KEY=your-key
```
Either way, a schedule already running when you add the var won't pick it up until its next fire — its already-spawned `--watch` loop keeps the environment it started with for its whole lifetime (forge auth aside, which refreshes every cycle) — see **Covering today's gap** above to restart it now instead of waiting.

If you write the crontab line yourself instead of using `auto cron add`, none of the above happens automatically: add `PATH`/`--notify` vars by hand, wrap your own command in `$SHELL -ilc '...'` (or `export` forge auth directly on the crontab line) for live-resolved auth, and make sure `branchdiff` itself is on that `PATH` (this prints its directory):
```bash
dirname "$(dirname "$(readlink -f "$(which branchdiff)")")"
```

</details>

#### "GitHub CLI (gh) is not installed"

Install from https://cli.github.com then `gh auth login`.

#### PR or comment sync not working

Run with `BRANCHDIFF_DEBUG=1` (see [Debug Mode](#debug-mode) above).

#### Something else

Run `branchdiff doctor`.

---

## Data & privacy

Everything is local. No outbound calls except:
- `localhost` (UI ↔ CLI server)
- GitHub API via your local `gh` CLI (only for PR viewing and comment sync — only when you click a sync button)

Stored in `~/.branchdiff/`:
- `registry.json` — running instance metadata
- `config.json` — your global flag defaults, if you've created one (see [Config File](#config-file))
- `<repo-hash>/` — per-repo SQLite with comment threads

Reset current repo: `branchdiff clear`
Wipe everything: `branchdiff prune`

Export data for backup or device migration: `branchdiff export --all` (see [Export & Import](#export-import))

---

## Help & reference

```bash
branchdiff --help           # all commands and flags
branchdiff version          # print the installed version
branchdiff version --check  # check if a newer version is available on npm
branchdiff guide            # open this guide in browser (no repo needed)
branchdiff changelog        # release notes in browser (no repo needed)
```

---

## Uninstall

Choose the command that matches your installation method.

#### npm

```bash
npm uninstall -g @encryptioner/branchdiff
```

#### pnpm

```bash
pnpm remove -g @encryptioner/branchdiff
```

#### yarn

```bash
yarn global remove @encryptioner/branchdiff
```

#### Homebrew (macOS / Linux)

```bash
brew uninstall branchdiff
brew untap encryptioner/branchdiff
```

#### pip / uv / pipx

```bash
pip uninstall branchdiff
```

Or: `uv tool uninstall branchdiff` / `pipx uninstall branchdiff`.

#### Scoop (Windows)

```powershell
scoop uninstall branchdiff
scoop bucket rm branchdiff
```

#### apt (Debian / Ubuntu)

```bash
sudo apt remove branchdiff
sudo rm /etc/apt/keyrings/branchdiff.gpg
sudo rm /etc/apt/sources.list.d/branchdiff.list
sudo apt update
```

#### Standalone binary (Windows / macOS / Linux)

Delete the `branchdiff` (or `branchdiff.exe`) binary from its folder. If you added it to PATH manually, remove the PATH entry.

---

### Remove all data (prune)

Uninstalling the package or binary does **not** delete branchdiff's local data. To wipe everything:

```bash
branchdiff prune
```

Or manually:

```bash
rm -rf ~/.branchdiff
```

This removes all review sessions, comment threads, code tours, credentials, and UI state for every repository. The operation is irreversible.

---

## Everything at a glance

Each feature links to the section that covers it:

- [**Commit detail view**](#individual-commit-detail-view) — click any commit in the history sidebar to open a full diff page with metadata, file list, and session-aware comment threads
- [**Local-first**](#data-privacy) — runs entirely on your machine, no data leaves localhost
- [**Dark and light themes**](#light-and-dark-mode) — automatic system detection, manual toggle in toolbar or CLI flag
- [**Split, unified, and full views**](#themes-appearance) — switch instantly with toolbar buttons or keyboard shortcuts
- [**Three diff modes**](#diff-modes) — Git (commit ancestry), File (content comparison), Delta (disagreements between modes)
- [**Inline comments**](#inline-comments) — click any diff line to leave feedback with severity tags
- [**Persistent review sessions**](#review-sessions) — comments survive new commits when comparing named branches
- [**AI review skill**](#ai-review) — `branchdiff skill add` creates Claude Code skills; use `/branchdiff-review` to post comments
- [**AI resolve skill**](#ai-review) — `/branchdiff-resolve` reads open threads, makes the code fixes, marks each resolved
- [**Any AI supported**](#any-other-ai) — copy-paste prompts or pipe: `branchdiff review context | your-ai-tool`
- [**Automatic PR review**](#automatic-pr-review-branchdiff-auto) — `branchdiff auto` watches your open PRs and reviews the ones with new commits; lets you pick which to review (or none/all), notifies on your desktop, publishes only when told to, and can review several at once with `--parallel`
- [**One command across every repo**](#several-repos-at-once-repo-paths) — point `auto` at a parent directory (or list repos with `--repo-paths`) to scan them all, pick from one combined candidate list, and end each pass with a report of what was reviewed and where to find it
- [**Isolated reviews**](#reviewing-without-touching-your-working-tree) — `--worktree` reviews a PR in `.worktrees/` so your working tree is never switched; each AI review is pinned to one session and can't drift onto another PR
- [**Commit history browser**](#history-repo-at-a-commit) — `branchdiff history` for the log, `branchdiff show <ref>` for the whole repo at a commit, plus per-file history that follows renames. Toggle a **commit graph** to see branches and merges as continuous colored lanes with merge curves — click a node to open its commit, hover for details, and read the on-screen legend for what each symbol means. Select any commit's short hash to copy it. The list scales with the repo, so **Load all** stays smooth on repos with thousands of commits, graph included
- [**Branch & tag browser**](#the-file-browser) — `branchdiff branches` lists every local and remote branch and tag with last-commit times and tracking info, with a search box to filter by name and an All/Local/Remote toggle to narrow the branches list; click one to open its history, or hover to copy its name or open it in a new tab
- [**Code search**](#the-file-browser) — `branchdiff search <query>` runs a `git grep` across tracked files, grouped by file, with literal/regex and case options. Scope to a ref with `--ref` (e.g. a PR head); add `--json` to print structured results to stdout for scripts and AI agents instead of opening the browser
- [**Blame view**](#the-file-browser) — open a file in `branchdiff tree` and press **Blame** to see each line's last commit, author, and message grouped into hunks; the view is virtualized so even very large files scroll smoothly
- [**Cross-page navigation**](#navigating-the-diff-view) — history, branches, search, and the file browser each carry the same icon nav in their header to jump between views; the **Back** button falls back to closing the tab (and then the dashboard) when there's no page to return to, instead of doing nothing
- [**Back to top**](#navigating-the-diff-view) — a floating button appears once you scroll down in history, branches, search, changelog, the user guide, the stats dashboard, or the diff view, jumping back to the top in one click
- [**Typo-tolerant refs**](#history-repo-at-a-commit) — mistype a ref in `history`/`show` and branchdiff suggests the closest branch or tag before giving up
- [**GitHub PR sync**](#github) — push local comments to GitHub PR, pull GitHub comments into branchdiff
- [**Bitbucket PR sync**](#bitbucket) — same push/pull workflow for Bitbucket Cloud PRs
- [**Create PRs from UI**](#creating-pull-requests-from-the-ui) — open pull requests on GitHub or Bitbucket directly from the toolbar when no PR exists
- [**PR lifecycle actions**](#managing-prs-lifecycle-actions) — approve, request changes, comment, merge, close, reopen, toggle draft, and edit PR title/description directly from the toolbar dropdown
- [**File browser**](#the-file-browser) — navigate repo tree with syntax highlighting (`branchdiff tree`)
- [**Code tours**](#code-tours) — AI-generated guided walkthroughs of your codebase
- [**Keyboard-driven**](#keyboard-shortcuts) — navigate files, hunks, and views without touching the mouse
- [**Export & Import**](#export-import) — back up review & tour data to JSON and restore it on another machine; conflict strategies: merge, skip, overwrite
- [**Multiple instances**](#instance-management) — run several sessions simultaneously: different repos each on their own port, or different branch comparisons within the same repo
- [**Close session from browser**](#close-session-from-the-browser) — stop the server and close the tab from any 3-dot menu, no terminal needed
- [**UI state persistence**](#navigating-the-diff-view) — collapse state, viewed file markers, and filter preferences persist across port changes and machines via repo fingerprinting
- [**Sidebar filtering**](#sidebar-filtering) — filter files by 10 states: Commented, Uncommented, Resolved, Viewed, Unviewed, Stale (viewed but changed), Collapsed, Expanded, Staged, Unstaged
- [**Working tree toggle**](#working-tree-changes) — switch between staged and unstaged changes from the toolbar