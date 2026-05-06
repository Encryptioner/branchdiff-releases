<!-- AUTO-GENERATED - DO NOT EDIT IN THIS REPO. Source of truth: private repo. Edits here will be overwritten on the next release. -->

# User Guide

## Getting Started

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

#### Option 9: Snap (Linux)

```bash
sudo snap install branchdiff --classic
```

Uses classic confinement for access to arbitrary git repositories.

#### Option 10: apt (Debian / Ubuntu)

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

### Update branchdiff

```bash
branchdiff update
```

The `update` command auto-detects your installation method (npm, pnpm, yarn, Homebrew, pip, scoop) and runs the appropriate upgrade command. To override detection:

```bash
branchdiff update --pm npm     # Force npm
branchdiff update --pm homebrew  # Force Homebrew
```

When binaries become available, the update command will automatically detect and install the latest binary for your platform.

### Quick Reference

| I want to… | Command |
|---|---|
| See my uncommitted changes | `branchdiff` |
| Compare with main | `branchdiff main` |
| Compare two branches | `branchdiff main feat` |
| View a GitHub PR | `branchdiff https://github.com/owner/repo/pull/123` |
| View a Bitbucket PR | `branchdiff https://bitbucket.org/workspace/repo/pull-requests/123` |
| Browse repo files | `branchdiff tree` |
| Export session data | `branchdiff export --all` |
| Import session data | `branchdiff import backup.json` |
| View last commit | `branchdiff HEAD~1` |
| Compare branch vs parent | `branchdiff --earlier-commit` |
| Show repo info & state | `branchdiff info` |
| Clear UI state | `branchdiff state reset` |
| Dark mode / unified view | `branchdiff main --dark --unified` |

Any ref works: branch name, commit SHA, tag, `HEAD~N`, `origin/<branch>`.

---

## Features at a Glance

- **Local-first** — runs entirely on your machine, no data leaves localhost
- **Dark and light themes** — automatic system detection, manual toggle in toolbar or CLI flag
- **Split, unified, and full views** — switch instantly with toolbar buttons or keyboard shortcuts
- **Three diff modes** — Git (commit ancestry), File (content comparison), Delta (disagreements between modes)
- **Inline comments** — click any diff line to leave feedback with severity tags
- **Persistent review sessions** — comments survive new commits when comparing named branches
- **AI review skill** — `branchdiff skill add` creates Claude Code skills; use `/branchdiff-review` to post comments
- **AI resolve skill** — `/branchdiff-resolve` reads open threads, makes the code fixes, marks each resolved
- **Any AI supported** — copy-paste prompts or pipe: `branchdiff review context | your-ai-tool`
- **GitHub PR sync** — push local comments to GitHub PR, pull GitHub comments into branchdiff
- **Bitbucket PR sync** — same push/pull workflow for Bitbucket Cloud PRs
- **Create PRs from UI** — open pull requests on GitHub or Bitbucket directly from the toolbar when no PR exists
- **File browser** — navigate repo tree with syntax highlighting (`branchdiff tree`)
- **Code tours** — AI-generated guided walkthroughs of your codebase
- **Keyboard-driven** — navigate files, hunks, and views without touching the mouse
- **Export & Import** — back up review & tour data to JSON and restore it on another machine; conflict strategies: merge, skip, overwrite
- **Multiple instances** — run several sessions simultaneously: different repos each on their own port, or different branch comparisons within the same repo
- **UI state persistence** — collapse state, viewed file markers, and filter preferences persist across port changes and machines via repo fingerprinting
- **Sidebar filtering** — filter files by 9 states: Commented, Uncommented, Viewed, Unviewed, Stale (viewed but changed), Collapsed, Expanded, Staged, Unstaged
- **Working tree toggle** — switch between staged and unstaged changes from the toolbar

---

## Themes & Appearance

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
- **View mode toggle** — the Full view is modal-based; use Close (Esc) or the X button to return to the diff view

---

## Viewing Diffs

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

### Parent commit comparison

```bash
branchdiff --earlier-commit             # current branch vs its parent (HEAD~1)
branchdiff --earlier-commit feature     # feature vs feature~1
```

Compares a branch against its parent commit — useful for reviewing a single branch's latest change. Cannot be combined with `--base`/`--compare`.

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

### Viewing a GitHub PR

```bash
branchdiff https://github.com/owner/repo/pull/123
```

Requires `gh` CLI installed and authenticated (`gh auth login`).

### Viewing a Bitbucket PR

```bash
branchdiff https://bitbucket.org/workspace/repo/pull-requests/123
```

Requires authentication — the CLI checks for Bitbucket credentials via the `bb` CLI or environment variables (`BITBUCKET_USERNAME` and `BITBUCKET_APP_PASSWORD`). Automatically detects the base and source branches, handles cross-repo PRs (forks), and displays branch info in the terminal.

---

## Diff Modes

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

## Review Sessions

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

### Snapshot reviews — ephemeral

Working tree, staged changes, or a specific commit get their own session per HEAD state. Making a new commit creates a new session — old comments are not shown.

### Summary

| Comparison type | Comments survive new commits? | Start fresh |
|---|---|---|
| `branchdiff main..feature` | Yes | `--new` or "New review" button |
| `branchdiff HEAD~1` | No — new commit = new session | — |
| `branchdiff` (working tree) | No — new commit = new session | — |

---

## Inline Comments

### Posting comments

Click the **+** button that appears on any diff line to start a comment thread. Add your message and save. Comments support **markdown** — use the Write/Preview toggle to see formatted output before posting.

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

---

## File Browser

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

---

## Discovering Features

### The toolbar

The top toolbar adapts to your current session and shows relevant controls:

- **File / Git / Delta** mode switcher — choose how diffs are compared
- **Expand all / Collapse all** buttons — expand or collapse all file diffs at once (toggle based on current state)
- **Unified / Split / Full** view mode toggle — choose your diff layout
- **Working tree toggle** — switch between staged and unstaged changes (appears when viewing uncommitted work)
- **Comment actions** — navigate threads (previous/next), comment count, copy for AI review, archive session, view history
- **3-dot menu** — theme toggle, whitespace display, keyboard shortcuts, this guideline, changelog, and links

### Sidebar filtering

Filter badges appear at the top of the file sidebar to narrow the file list by state:

- **Commented** / **Uncommented** — files with or without open review comments
- **Viewed** / **Unviewed** — files marked as reviewed or not yet seen
- **Stale** — files that were viewed but have since changed (amber dot indicator)
- **Collapsed** / **Expanded** — minimized or expanded diffs
- **Staged** / **Unstaged** — files with staged or unstaged changes (visible in working tree mode)

File rows also show inline status badges: **S** (staged, accent), **U** (unstaged, amber), amber dot (stale — file changed since viewed), and checkmark (viewed).

Badges auto-hide when inapplicable (e.g., "Commented" disappears if no comments exist, "Staged"/"Unstaged" hidden outside working tree mode). Clicking a badge activates it; clicking again clears it. Only one badge in each pair is active at a time. The **Clear** button resets all filters.

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

## Code Tours

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

## AI Review

Review and fix diffs with any AI assistant — no plugin, no MCP server, no special setup.

### Claude Code — Skills

Install skills once per repo, then use slash commands in any session:

```bash
branchdiff skill add   # creates .claude/skills/branchdiff-{review,resolve}/SKILL.md
```

| Slash command | What it does |
|---|---|
| `/branchdiff-review` | AI reads the diff and posts inline comments with severity tags |
| `/branchdiff-review main feature` | Review a specific branch comparison |
| `/branchdiff-resolve` | AI reads open threads, fixes the code, resolves each comment |
| `/branchdiff-resolve abc123` | Resolve a single thread by ID |

**Skill options:**

```bash
branchdiff skill add --type review           # review skill only
branchdiff skill add --type resolve          # resolve skill only
branchdiff skill add --name myproject        # custom slash command prefix
branchdiff skill add --force                 # overwrite existing files
```

### Review skill workflow

`/branchdiff-review` reads the full diff, analyzes each changed file, and posts inline comments tagged by severity:
- `[must-fix]` — bugs, security issues, data loss risks
- `[suggestion]` — concrete improvements, missing tests
- `[question]` — unclear behavior needing clarification

After the review, it summarizes findings and prompts you to run `/branchdiff-resolve`.

### Resolve skill workflow

`/branchdiff-resolve` reads all open review threads and resolves them:
1. Reads each thread's comment body to understand the requested change
2. Makes the code edit using the file path and line numbers from the thread
3. Marks the thread resolved with a summary, or dismisses it with a reason if the fix shouldn't apply
4. Skips general comments and threads waiting for user clarification

The review and resolve skills form a complete loop — review, inspect in browser, resolve — without leaving your editor.

### Any other AI

Copy-paste one of these prompts:

**To review:**
```
You are reviewing code using branchdiff agent commands (not any other tool).
Run `branchdiff review guide` first to load the full reference, then:
1. Run `branchdiff agent diff` to read the full diff.
2. Post comments: branchdiff agent comment --file <path> --line <n> --body "[tag] message"
   Tags: [must-fix] bugs/security · [suggestion] improvements · [nit] style · [question] unclear
3. Confirm: branchdiff agent list --status open
Start: branchdiff review guide
```

**To resolve:**
```
You are resolving open review comments using branchdiff agent commands.
Run `branchdiff review guide` first to load the full reference, then:
1. Run `branchdiff agent list --status open --json` to get open threads.
2. Fix the code, then: branchdiff agent resolve <id> --summary "what you did"
   Or dismiss: branchdiff agent dismiss <id> --reason "why"
Start: branchdiff review guide
```

### One-shot pipe

```bash
branchdiff review context | claude -p "review for security"
branchdiff review context --refs "main feature" | your-ai-tool  # no session needed
branchdiff review run --exec "claude" --mode review
branchdiff review run --exec "llm -m gpt-4o" --mode resolve
```

### Agent command reference

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
```

> Keep branchdiff running while the AI works. Agents hit `http://localhost:<port>/api/*`.

---

## AI Workflows

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
2. Output verdict, top must-fix items, recurring themes, thread counts.
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

## Platform Integrations

### GitHub

Sync review comments between branchdiff and GitHub PRs.

**Prerequisites:**
1. Install the [GitHub CLI](https://cli.github.com): `gh --version`
2. Authenticate: `gh auth login`
3. Your repo's git remote must point to `github.com`
4. A PR must be open for your current branch

**Push local comments to GitHub:**
1. Write comments in branchdiff (manually or via AI review)
2. Click the PR number button in the toolbar (e.g. `#42`)
3. Click **Push to PR** — each single-comment thread is posted as an inline review comment

**Pull GitHub comments into branchdiff:**
1. Click the PR number button
2. Click **Pull from PR** — all review comments from the GitHub PR are imported as local threads
3. Duplicate comments are automatically skipped

### Bitbucket

**Setup — App Password or API Token**

**Option A — Bitbucket App Password** (recommended)

1. Go to **bitbucket.org/account/settings/app-passwords** → Create app password
2. Enable scopes: **Repositories: Read** + **Pull requests: Read** + **Pull requests: Write**
3. Set `BITBUCKET_USERNAME` to your **Bitbucket username** (the one shown in your profile URL, not your email)

**Option B — Atlassian API Token**

1. Go to **id.atlassian.com** → Security → API tokens → Create API token
2. Set `BITBUCKET_USERNAME` to your **email address** — Atlassian tokens require email, not username

> **Important:** Using an App Password with an email (or an Atlassian token with a username) will cause a 401 error.
> Repositories: Read is required for private repos — without it, the PR list API returns 401 even if Pull requests scopes are set.

```bash
# Option A: environment variables (restart branchdiff after setting)
export BITBUCKET_USERNAME="your-username-or-email"
export BITBUCKET_API_TOKEN="your-token"

# Option B: config file
mkdir -p ~/.branchdiff
echo '{"bitbucket":{"username":"...","apiToken":"..."}}' > ~/.branchdiff/credentials.json
chmod 600 ~/.branchdiff/credentials.json
```

**Viewing and Syncing Bitbucket PRs**

View a Bitbucket PR by pasting its URL:
```bash
branchdiff https://bitbucket.org/workspace/repo/pull-requests/123
```

Push and pull review comments identically to GitHub — click the PR number button in the toolbar. Bitbucket comments sync seamlessly with your local review threads.

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

---

## Keyboard Shortcuts

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

## Shell Completion

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
| `branchdiff review run <tab>` | `--exec`, `--mode`, `--prompt`, `--dry-run`, `--files`, `--timeout` |
| `branchdiff skill add <tab>` | `--type`, `--name`, `--out`, `--force` |
| `branchdiff completion <tab>` | `install`, `zsh`, `bash` |

Branch names come from `git branch -a` at completion time, so remote branches appear once fetched.

---

## Instance Management

Multiple repos open at once — each gets its own port starting at 5391. You can also run multiple sessions **within the same repo** when comparing different ref pairs.

```bash
branchdiff list         # show all running instances
branchdiff open         # reopen browser for this repo (prompts to choose if multiple running sessions)
branchdiff kill         # stop all instances
branchdiff clear        # stop this repo's instance and delete its review data
branchdiff prune        # delete all stored data (~/.branchdiff)
branchdiff doctor       # diagnose install / environment issues
branchdiff update       # self-update (auto-detects package manager)
branchdiff version      # print current version
branchdiff version --check  # check npm for latest version
branchdiff info         # show repo fingerprint, name, and state table size
branchdiff state reset  # clear UI state (collapse, viewed markers) without affecting sessions
```

Rerunning `branchdiff` with the **same ref pair** in a repo that already has a running instance **reuses** it (just reopens the browser). Use `--new` to force a restart. Running with a **different ref pair** starts a new session on the next available port.

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

### UI

Both Export and Import are also available in the **3-dot menu** (⋯) on the diff view and file browser:
- **Export** — opens a checklist of sessions; select which to include and download the file. The downloaded filename includes the repository name and timestamp (e.g. `branchdiff-export-my-repo-2026-01-15_10-30-00.json`).
- **Import** — upload a `.json` export file, choose conflict strategy, and confirm. A warning appears if the file came from a different repository.

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
| `--earlier-commit` | Compare branch against its parent commit |

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
| `Bitbucket PR lookup: { branch, resultCount: 0 }` | Credentials valid, no open PR found for the queried branch |
| `Bitbucket PR lookup: { branch, resultCount: 1 }` | PR was found (problem is elsewhere) |
| `GitHub getPr error: ...` | `gh pr view` failed — check `gh auth status` |
| `GitHub getFiles/getComments/pullComments error` | Comment sync step failed |
| `Bitbucket getDiffStatFiles error` | Comment push: failed to list PR files |
| `git getBlobMap(branch) error` | Branch comparison: git ref not found or invalid |
| `git getBranchFileContent(branch, file) error` | File content fetch failed for that branch/file |
| `git getBranches error` | Could not list git branches |

**Common fixes from debug output:**

- **Bitbucket 401** — mismatch between token type and username field. App Password → use Bitbucket username. Atlassian API Token → use email address. Also ensure **Repositories: Read** scope is enabled (required for private repos).
- **Bitbucket resultCount: 0** — verify the branch name shown matches the PR's source branch exactly on Bitbucket.
- **repoSlug or workspace wrong** — check your git remote URL: `git remote get-url origin`.
- **getBlobMap error** — the branch ref passed to branchdiff doesn't exist locally; run `git fetch` first.

---

## Troubleshooting

**"Not a git repository"** — run from inside a git working tree.

**Port already in use** — use `branchdiff --port 7000`.

**UI won't load / stale state** — run `branchdiff --new`.

**Native module errors (`better-sqlite3`)** — happens after switching Node versions:
```bash
npm rebuild -g better-sqlite3
```

**"GitHub CLI (gh) is not installed"** — install from https://cli.github.com then `gh auth login`.

**PR or comment sync not working** — run with `BRANCHDIFF_DEBUG=1` (see [Debug Mode](#debug-mode) above).

**Something else** — run `branchdiff doctor`.

---

## Data & Privacy

Everything is local. No outbound calls except:
- `localhost` (UI ↔ CLI server)
- GitHub API via your local `gh` CLI (only for PR viewing and comment sync — only when you click a sync button)

Stored in `~/.branchdiff/`:
- `registry.json` — running instance metadata
- `<repo-hash>/` — per-repo SQLite with comment threads

Reset current repo: `branchdiff clear`
Wipe everything: `branchdiff prune`

Export data for backup or device migration: `branchdiff export --all` (see [Export & Import](#export--import))

---

## Help & Reference

```bash
branchdiff --help           # all commands and flags
branchdiff version          # print current version (v1.4.0)
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

#### Snap (Linux)

```bash
sudo snap remove branchdiff
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